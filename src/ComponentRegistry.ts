import { Component } from './Component';

export function addComponent<A = never, E = never, S extends string = never>(comp: Component<A, E, S>, id?: string)
{
  ComponentRegistry[id || `${comp.collection}/${comp.name}`] = comp as any;
}

export const ComponentRegistry: Record<string, Component<any, any, any>> = Object.create(null);