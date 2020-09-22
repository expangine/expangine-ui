import { Component } from './Component';

export function addComponent<A = never, E = never, S extends string = never, L = never>(comp: Component<A, E, S, L>, id?: string)
{
  ComponentRegistry[id || `${comp.collection}/${comp.name}`] = comp as any;
}

export const ComponentRegistry: Record<string, Component<any, any, any, any>> = Object.create(null);