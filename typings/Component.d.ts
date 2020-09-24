import { Type, Expression, ObjectType } from 'expangine-runtime';
import { ComponentInstance } from './ComponentInstance';
import { NodeTemplate } from './Node';
export interface ComponentValue<A, E, S extends string, L, C, V extends keyof A> {
    type: Type;
    default?: Expression;
    callable?: ObjectType;
    changed?(value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
    initial?(value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
    update?(value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
}
export interface ComponentBase<A, E = never, S extends string = never, L = never, C = never> {
    name: string;
    collection: string;
    render(instance: ComponentInstance<A, E, S, L, C>): NodeTemplate;
    created?(instance: ComponentInstance<A, E, S, L, C>): void;
    updated?(instance: ComponentInstance<A, E, S, L, C>): void;
    destroyed?(instance: ComponentInstance<A, E, S, L, C>): void;
}
export declare type IfNever<T, Y, N> = [T] extends [never] ? Y : N;
export declare type Component<A = never, E = never, S extends string = never, L = never, C = never> = ComponentBase<A, E, S, L, C> & IfNever<A, {}, {
    attributes: {
        [V in keyof A]: ComponentValue<A, E, S, L, C, V> | Type;
    };
}> & IfNever<L, {}, {
    state: {
        [V in keyof L]: Expression;
    };
}> & IfNever<C, {}, {
    computed: {
        [V in keyof C]: Expression;
    };
}> & IfNever<E, {}, {
    events: {
        [K in keyof E]: Type;
    };
}> & IfNever<S, {}, {
    slots: {
        [K in S]: ObjectType;
    };
}>;
