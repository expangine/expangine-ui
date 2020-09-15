import { Component } from './Component';
export declare function addComponent<A = never, E = never, S extends string = never>(comp: Component<A, E, S>, id?: string): void;
export declare const ComponentRegistry: Record<string, Component<any, any, any>>;
