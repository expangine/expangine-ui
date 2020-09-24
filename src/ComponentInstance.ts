import { Exprs, Expression, ExpressionValue, defs } from 'expangine-runtime';
import { Scope } from './Scope';
import { Component, ComponentValue } from './Component';
import { NodeInstance, NodeTemplateNamedSlots, Off, changeElements } from './Node';
import { compile } from './compile';


export type ComponentInstanceAny = ComponentInstance<any, any, any, any, any>;

export class ComponentInstance<A, E, S extends string, L, C> 
{
  public component: Component<A, E, S, L, C>;
  public attrs: Partial<Record<keyof A, ExpressionValue>>;
  public cache: Record<string, any>;
  public scope: Scope<A & L & C & { emit: E, refs: Record<string, any> }>;
  public outerScope: Scope;
  public node?: NodeInstance;
  public parent?: ComponentInstanceAny;
  public slots?: NodeTemplateNamedSlots;

  public constructor(component: Component<A, E, S, L, C>, attrs: Partial<Record<keyof A, ExpressionValue>>, scope: Scope, slots?: NodeTemplateNamedSlots, parent?: ComponentInstanceAny, outerScope?: Scope) 
  {
    this.component = component;
    this.attrs = attrs;
    this.scope = scope;
    this.outerScope = outerScope || scope;
    this.slots = slots;
    this.parent = parent;
    this.cache = Object.create(null);
  }

  public call<K extends keyof A>(attr: K, args: Record<string, ExpressionValue>): Expression
  {
    const attrObject = (this.component as any as Component<any, any, any, any, any>).attributes?.[attr];
    const attrValue = this.attrs[attr];
    const attrExpr = attrValue || (attrObject as ComponentValue<any, any, any, any, any, string>)?.default;

    if (attrExpr)
    {
      const def = Exprs.define();
      
      for (const arg in args)
      {
        def.with(arg, defs.getExpression(args[arg]));
      }

      def.run(defs.getExpression(attrExpr));

      return def;
    }

    return Exprs.noop();
  }

  public trigger<K extends keyof E>(eventName: K, payload: E[K], evalScope: Scope = this.scope): void
  {
    this.scope.observed.emit[eventName] = evalScope.eval(payload)();
  }

  public on<K extends keyof E>(eventName: K, listener: (payload: E[K]) => any): Off 
  {
    return this.scope.watch(
      Exprs.get('emit', eventName),
      listener,
      false
    );
  }

  public update(): void 
  {
    if (this.component.updated && this.node) 
    {
      this.component.updated(this);
    }
  }

  public render(): void 
  {
    this.cache = Object.create(null);

    const rendered = this.component.render(this);
    const node = compile(rendered, this, this.scope);

    changeElements(this.node.elements, node.elements);
    
    this.node = node;
  }

  public destroy(): void 
  {
    this.scope.destroy();
  }

}