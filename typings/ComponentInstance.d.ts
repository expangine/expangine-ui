import { Expression, ExpressionValue } from 'expangine-runtime';
import { Scope } from './Scope';
import { Component, ComponentSlot } from './Component';
import { NodeInstance, NodeTemplateNamedSlots, NodeTemplateChild, Off } from './Node';
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
    getSlotArrayLength(slotName?: S | 'default'): Expression;
    getSlotOptions(slotName?: S | 'default'): ComponentSlot | false;
    hasSlot<T, F>(slotName: S | 'default', truthy: T, falsy: F): T | F;
    whenSlot(slotName: S | 'default', getMissing: () => NodeTemplateChild, getChildren: () => NodeTemplateChild): NodeTemplateChild;
    whenSlot(slotName: S | 'default', getMissing: () => NodeTemplateChild[], getChildren: () => NodeTemplateChild[]): NodeTemplateChild[];
}
