import { Component } from './Component';
export declare function addComponent<A = never, E = never, S extends string = never, L = never, C = never>(comp: Component<A, E, S, L, C>, id?: string): Component<A, E, S, L, C>;
export declare const ComponentRegistry: Record<string, Component<any, any, any, any, any>>;
