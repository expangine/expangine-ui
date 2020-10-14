import { Expression, DataTypes, Exprs, ConstantExpression } from 'expangine-runtime';
import { LiveContext, LiveRuntime } from 'expangine-runtime-live';
import { Watcher, Node as LinkedNode, observe, unobserve, watch } from 'scrute';
import { Off } from './Node';


export class Scope<A extends LiveContext = any> 
{

  public parent: Scope | null;
  public observed: A;
  public link: LinkedNode<Scope<A>>;
  public children?: LinkedNode<Scope<A>>;
  public disables: number;
  public watchers: LinkedNode<Watcher>;
  
  public constructor(parent: Scope | null = null, data: A = Object.create(null)) 
  {
    this.parent = parent;
    this.observed = observe(data);
    this.disables = 0;
    this.link = new LinkedNode(this);
    this.watchers = LinkedNode.head();
  }

  public createChild(data: any = {}, addToParent: boolean = true): Scope 
  {
    const child = new Scope(this, data);

    if (addToParent)
    {
      if (!this.children)
      {
        this.children = LinkedNode.head();
      }

      this.children.push(child.link);
    }
    
    return child;
  }

  public get<V extends keyof A>(attr: V, defaultValue?: A[V], here: boolean = false): A[V] 
  {
    return attr in this.observed 
      ? this.observed[attr]
      : this.parent && !here
        ? this.parent.get(attr, defaultValue)
        : defaultValue;
  }

  public has(attr: string | number | symbol, here: boolean = false): attr is (keyof A)
  {
    return attr in this.observed
      ? true
      : this.parent && !here
        ? this.parent.has(attr)
        : false;
  }

  public set<V extends keyof A>(attr: V, value: A[V], here: boolean = false): boolean 
  {
    if (attr in this.observed || 
       here || 
       !this.parent ||
       !this.parent.set(attr, value))
    {
      this.observed[attr] = value;

      return true;
    }

    return false;
  }

  public remove<V extends keyof A>(attr: V): void 
  {
    if (attr in this.observed)
    {
      delete this.observed[attr];
    }
    else if (this.parent)
    {
      this.parent.remove(attr);
    }
  }

  public setMany(values: Partial<A>) 
  {
    for (const prop in values)
    {
      this.set(prop, values[prop]);
    }
  }

  public watch(exprValue: any, onValue: (value: any) => void, immediate: boolean = true, equalityCheck: boolean = false, async: boolean = false): Off 
  {
    const expr = LiveRuntime.defs.getExpression(exprValue);
    const cmd = LiveRuntime.getCommand(expr);

    if (!expr.isDynamic())
    {
      onValue(cmd(this));

      return () => {};
    }

    let first: boolean = true;
    let last: any;

    const handleResult = (result: any) => {
      if (immediate || !first) {
        if (first || (!equalityCheck || !DataTypes.equals(last, result))) {
          onValue(result);
        }
      }

      last = equalityCheck ? DataTypes.copy(result) : result;
      first = false;
    };

    const watcher = watch(() => {
      const result = cmd(this);

      if (!async) {
        handleResult( result );
      }
    }, {
      onResult: ({ result }) => {
        if (async) {
          handleResult( result );
        }
      },
    });

    const node = new LinkedNode(watcher);

    this.watchers.push(node);

    return () => {
      watcher.off();
      node.remove();
    };
  }

  public eval(expr: any): (() => any)
  public eval<E extends string>(expr: any, extraArgs: E[]): ((extra: Record<E, any>) => any) 
  public eval(expr: any, extraArgs: string[] = []): ((extra?: any) => any) 
  {
    if (extraArgs.length > 0)
    {
      const extraConsts: Record<string, ConstantExpression> = extraArgs.reduce(
        (out, a) => (out[a] = Exprs.const(undefined), out), {}
      );
      const extraExpr = Exprs.define(extraConsts, LiveRuntime.defs.getExpression(expr));
      const extraCmd = LiveRuntime.eval(extraExpr);

      return (extra) =>
      {
        for (const arg of extraArgs)
        {
          extraConsts[arg].value = extra?.[arg];
        }

        return extraCmd(this);
      };
    }
    else
    {
      const cmd = LiveRuntime.eval(expr);

      return () => cmd(this);
    }
  }

  public evalNow(expr: any): any
  {
    return this.eval(expr)();
  }

  public enable(): void 
  {
    if (this.disables > 0) 
    {
      this.disables--;
      
      if (this.disables === 0) 
      {
        this.watchers.forEach((w) => w.resume());
      }

      if (this.children) 
      {
        this.children.forEach((c) => c.enable());
      }
    }
  }

  public disable(): void 
  {
    if (this.disables === 0) 
    {
      this.watchers.forEach((w) => w.pause());
    }
    
    if (this.children) 
    {
      this.children.forEach((c) => c.disable());
    }

    this.disables++;
  }

  public setEnabled(enabled: boolean) 
  {
    enabled ? this.enable() : this.disable();
  }

  public destroy(): void 
  {
    this.link.remove();
    this.disables = Number.MAX_SAFE_INTEGER;
    this.watchers.forEach((w) => w.off());
    
    if (this.children)
    {
      this.children.forEach((c) => c.destroy());
    }

    unobserve(this.observed);
  }

  private static registered: boolean = false;

  public static register()
  {
    if (!this.registered)
    {
      const { dataSet, dataGet, dataHas, dataRemove } = LiveRuntime;

      LiveRuntime.dataGet = (obj, prop) => obj instanceof Scope ? obj.get(prop) : dataGet(obj, prop);
      LiveRuntime.dataSet = (obj, prop, value) => obj instanceof Scope ? obj.set(prop, value) : dataSet(obj, prop, value);
      LiveRuntime.dataHas = (obj, prop) => obj instanceof Scope ? obj.has(prop) : dataHas(obj, prop);
      LiveRuntime.dataRemove = (obj, prop) => obj instanceof Scope ? obj.remove(prop) : dataRemove(obj, prop);

      DataTypes.addCopier({
        priority: 12,
        copy: (x) => {
          if (x instanceof Event) {
            return x;
          }
        },
      });

      this.registered = true;
    }
  }

  public static isWatchable(x: any): x is (Expression | [string, ...any[]])
  {
    return LiveRuntime.defs.isExpression(x);
  }

}


Scope.register();