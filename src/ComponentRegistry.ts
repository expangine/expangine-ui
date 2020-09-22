import { Component } from './Component';

export function addComponent<A = never, E = never, S extends string = never, L = never, C = never>(comp: Component<A, E, S, L, C>, id?: string)
{
  ComponentRegistry[id || `${comp.collection}/${comp.name}`] = comp as any;
}

export const ComponentRegistry: Record<string, Component<any, any, any, any, any>> = Object.create(null);