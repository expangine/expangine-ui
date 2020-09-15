import { Expression, isArray } from 'expangine-runtime';
import { LiveContext, LiveRuntime } from 'expangine-runtime-live';
import { Watcher, Node as LinkedNode, observe, unobserve, watch } from 'scrute';
import { copyProperties, createChildScope, createScope } from './fns';
import { Off } from './Node';


export class Scope<A extends LiveContext = any> 
{
  
  public parent: Scope | null;
  public data: A;
  public observed: A;
  public link: LinkedNode<Scope<A>>;
  public children?: LinkedNode<Scope<A>>;
  public disables: number;
  public watchers: LinkedNode<Watcher>;
  
  public constructor(parent: Scope | null = null, data: any = {}) 
  {
    this.parent = parent;
    this.data = parent ? createChildScope(parent.data, data) : createScope(data);
    this.observed = observe(this.data);
    this.disables = 0;
    this.link = new LinkedNode(this);
    this.watchers = LinkedNode.head();
  }

  public addToParent() 
  {
    if (this.parent) 
    {
      if (!this.parent.children) {
        this.parent.children = LinkedNode.head();
      }
      this.link.insertAfter(this.parent.children);
    }
  }

  public createChild(data: any = {}, addToParent: boolean = true): Scope 
  {
    const child = new Scope(this, data);

    if (addToParent) 
    {
      child.addToParent();
    }
    
    return child;
  }

  public get<V extends keyof A>(attr: V, defaultValue?: A[V]): A[V] 
  {
    return attr in this.observed ? this.observed[attr] : defaultValue;
  }

  public set<V extends keyof A>(attr: V, value: A[V]): void 
  {
    this.observed[attr] = value;
  }

  public setMany(values: Partial<A>) 
  {
    copyProperties(this.observed, values);
  }

  public watch(expr: any, onValue: (value: any) => void): Off 
  {
    const cmd = LiveRuntime.eval(expr);

    const watcher = watch(() => {
      onValue(cmd(this.observed));
    });

    const node = new LinkedNode(watcher);

    node.insertAfter(this.watchers);

    return () => {
      watcher.off();
      node.remove();
    };
  }

  public eval(expr: any): ((extra?: any) => any) 
  {
    const cmd = LiveRuntime.eval(expr);

    return (extra) => cmd(extra ? createChildScope(this.observed, extra) : this.observed);
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

  public static isWatchable(x: any): x is (Expression | any[])
  {
    return isArray(x) || x instanceof Expression;
  }

}
