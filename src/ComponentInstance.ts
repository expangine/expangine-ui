import { Scope } from './Scope';
import { Component } from './Component';
import { NodeInstance, NodeTemplateNamedSlots, Off, changeElements } from './Node';
import { compile } from './compile';
import { Exprs } from 'expangine-runtime';


export class ComponentInstance<A, E, S extends string> 
{
  public component: Component<A, E, S>;
  public cache: Record<string, any>;
  public scope: Scope<A & { emit: E, refs: Record<string, ComponentInstance<any, any, any>> }>;
  public outerScope: Scope;
  public node?: NodeInstance;
  public parent?: ComponentInstance<any, any, any>;
  public slots?: NodeTemplateNamedSlots;

  public constructor(component: Component<A, E, S>, scope: Scope, slots?: NodeTemplateNamedSlots, parent?: ComponentInstance<any, any, any>, outerScope?: Scope) 
  {
    this.component = component;
    this.cache = Object.create(null);
    this.scope = scope;
    this.outerScope = outerScope || scope;
    this.slots = slots;
    this.parent = parent;
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
    this.scope.destroy();
    this.scope = new Scope(this.parent?.scope);
    this.cache = Object.create(null);

    const rendered = this.component.render(this);
    const node = compile(rendered, this, this.scope);

    changeElements(this.node.element, node.element);
    
    this.node = node;
  }

  public destroy(): void 
  {
    this.scope.destroy();
  }

}