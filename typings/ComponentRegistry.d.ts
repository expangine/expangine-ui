import { Component } from './Component';
export declare const ComponentRegistry: Record<string, Component<any, any, any, any, any>>;
export declare function addComponent<A = never, E = never, S extends string = never, L = never, C = never>(comp: Component<A, E, S, L, C>, id?: string): Component<A, E, S, L, C>;
export declare type Extend<P, C> = [P] extends [never] ? C : [C] extends [never] ? P : P extends string ? P | C : {
    [K in keyof P]: K extends keyof C ? C[K] : P[K];
} & C;
export declare function extendComponent<A = never, E = never, S extends string = never, L = never, C = never, BA = never, BE = never, BS extends string = never, BL = never, BC = never>(base: Component<BA, BE, BS, BL, BC>, extension: Partial<Component<A, E, S, L, C>>): Component<Extend<BA, A>, Extend<BE, E>, Extend<BS, S>, Extend<BL, L>, Extend<BC, C>>;
