import { Scope } from './Scope';
import { Component } from './Component';
import { NodeInstance, NodeTemplateNamedSlots, Off, changeElement } from './Node';
import { compile } from './compile';


export class ComponentInstance<A, E, S extends string> 
{
  public component: Component<A, E, S>;
  public cache: Record<string, any>;
  public scope: Scope<A>;
  public node?: NodeInstance;
  public parent?: ComponentInstance<any, any, any>;
  public slots?: NodeTemplateNamedSlots;
  public listeners: Record<keyof E, Array<(payload: any) => any>>;

  public constructor(component: Component<A, E, S>, slots?: NodeTemplateNamedSlots, parent?: ComponentInstance<any, any, any>) 
  {
    this.component = component;
    this.cache = Object.create(null);
    this.scope = new Scope(parent?.scope);
    this.slots = slots;
    this.parent = parent;
    this.listeners = Object.create(null);
  }

  public trigger<K extends keyof E>(eventName: K, payload: E[K]): void 
  {
    if (eventName in this.listeners) 
    {
      this.listeners[eventName].forEach((l) => l(payload));
    }
  }

  public on<K extends keyof E>(eventName: K, listener: (payload: E[K]) => any): Off 
  {
    if (!(eventName in this.listeners))
    { 
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(listener);

    return () => 
    {
      const i = this.listeners[eventName].indexOf(listener);

      if (i !== -1) 
      {
          this.listeners[eventName].splice(i, 1);
      }
    };
  }

  public update(): void 
  {
    if (this.component.updated && this.node) 
    {
      this.component.updated(this, this.node.element);
    }
  }

  public render(): void 
  {
    this.scope.destroy();
    this.scope = new Scope(this.parent?.scope);
    this.cache = Object.create(null);

    const rendered = this.component.render(this);
    const node = compile(rendered, this, this.scope);

    changeElement(this.node, node.element);
    
    this.node = node;
  }

  public destroy(): void 
  {
    this.scope.destroy();
    this.listeners = Object.create(null);
  }

}