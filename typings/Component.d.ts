import { Type, Expression, ObjectType, ExpressionValue } from 'expangine-runtime';
import { ComponentInstance, ComponentInstanceAny } from './ComponentInstance';
import { NodeTemplate } from './Node';
export declare type TypeProvider<A, T extends Type = Type> = Type | ((attrs: {
    [K in keyof A]?: Type;
}) => T);
export declare type ExpressionProvider = Expression | ((c: ComponentInstanceAny) => Expression);
export interface ComponentValue<A, E, S extends string, L, C, V extends keyof A> {
    type: TypeProvider<A>;
    default?: ExpressionProvider;
    callable?: TypeProvider<A, ObjectType>;
    required?: boolean;
    changed?(value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
    initial?(value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
    update?(value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
}
export interface ComponentSlot<A> {
    scope: TypeProvider<A, ObjectType>;
    required?: boolean;
    accepts?: string[];
    array?: true;
    arrayLength?: ExpressionValue;
    arrayIndexAlias?: string;
}
export interface ComponentBase<A, E = never, S extends string = never, L = never, C = never> {
    name: string;
    collection: string;
    targets?: string[];
    render(instance: ComponentInstance<A, E, S, L, C>): NodeTemplate;
    created?(instance: ComponentInstance<A, E, S, L, C>): void;
    updated?(instance: ComponentInstance<A, E, S, L, C>): void;
    destroyed?(instance: ComponentInstance<A, E, S, L, C>): void;
}
export declare type NeverPartial<T, O> = [T] extends [never] ? Partial<O> : O;
export declare type Component<A = never, E = never, S extends string = never, L = never, C = never> = ComponentBase<A, E, S, L, C> & NeverPartial<A, {
    attributes: {
        [V in keyof A]: ComponentValue<A, E, S, L, C, V> | TypeProvider<A>;
    };
}> & NeverPartial<L, {
    state: {
        [V in keyof L]: ExpressionProvider;
    };
}> & NeverPartial<C, {
    computed: {
        [V in keyof C]: ExpressionProvider;
    };
}> & NeverPartial<E, {
    events: {
        [K in keyof E]: TypeProvider<A, ObjectType>;
    };
}> & NeverPartial<S, {
    slots: {
        [K in S]: ComponentSlot<A> | TypeProvider<A, ObjectType>;
    };
}>;
