import { Scope } from './Scope';
import { Component } from './Component';
import { NodeInstance, NodeTemplateNamedSlots, Off } from './Node';
export declare class ComponentInstance<A, E, S extends string> {
    component: Component<A, E, S>;
    cache: Record<string, any>;
    scope: Scope<A>;
    node?: NodeInstance;
    parent?: ComponentInstance<any, any, any>;
    slots?: NodeTemplateNamedSlots;
    listeners: Record<keyof E, Array<(payload: any) => any>>;
    constructor(component: Component<A, E, S>, slots?: NodeTemplateNamedSlots, parent?: ComponentInstance<any, any, any>);
    trigger<K extends keyof E>(eventName: K, payload: E[K]): void;
    on<K extends keyof E>(eventName: K, listener: (payload: E[K]) => any): Off;
    update(): void;
    render(): void;
    destroy(): void;
}
