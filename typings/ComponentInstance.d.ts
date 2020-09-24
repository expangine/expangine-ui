import { Expression, ExpressionValue } from 'expangine-runtime';
import { Scope } from './Scope';
import { Component } from './Component';
import { NodeInstance, NodeTemplateNamedSlots, Off } from './Node';
export declare type ComponentInstanceAny = ComponentInstance<any, any, any, any, any>;
export declare class ComponentInstance<A, E, S extends string, L, C> {
    component: Component<A, E, S, L, C>;
    attrs: Partial<Record<keyof A, ExpressionValue>>;
    cache: Record<string, any>;
    scope: Scope<A & L & C & {
        emit: E;
        refs: Record<string, any>;
    }>;
    outerScope: Scope;
    node?: NodeInstance;
    parent?: ComponentInstanceAny;
    slots?: NodeTemplateNamedSlots;
    constructor(component: Component<A, E, S, L, C>, attrs: Partial<Record<keyof A, ExpressionValue>>, scope: Scope, slots?: NodeTemplateNamedSlots, parent?: ComponentInstanceAny, outerScope?: Scope);
    call<K extends keyof A>(attr: K, args: Record<string, ExpressionValue>): Expression;
    trigger<K extends keyof E>(eventName: K, payload: E[K], evalScope?: Scope): void;
    on<K extends keyof E>(eventName: K, listener: (payload: E[K]) => any): Off;
    update(): void;
    render(): void;
    destroy(): void;
}
