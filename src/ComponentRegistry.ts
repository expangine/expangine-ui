import { Component } from './Component';


export const ComponentRegistry: Record<string, Component<any, any, any, any, any>> = Object.create(null);

export function addComponent<A = never, E = never, S extends string = never, L = never, C = never>(comp: Component<A, E, S, L, C>, id?: string)
{
  ComponentRegistry[id || `${comp.collection}/${comp.name}`] = comp as any;

  return comp;
}

export type Extend<P, C> = [P] extends [never]
    ? C
    : [C] extends [never]
        ? P
        : P extends string
            ? P | C
            : { [K in keyof P]: K extends keyof C ? C[K] : P[K] } & C;

export function extendComponent<
  A = never, E = never, S extends string = never, L = never, C = never, 
  BA = never, BE = never, BS extends string = never, BL = never, BC = never
>(
  base: Component<BA, BE, BS, BL, BC>, 
  extension: Partial<Component<A, E, S, L, C>>
): Component<Extend<BA, A>, Extend<BE, E>, Extend<BS, S>, Extend<BL, L>, Extend<BC, C>>
{
  return {
    collection: extension.collection || base.collection,
    name: extension.name || base.name,
    attributes: {
      ...(base.attributes || {}),
      ...(extension.attributes || {}),
    },
    state: {
      ...(base.state || {}),
      ...(extension.state || {}),
    },
    computed: {
      ...(base.computed || {}),
      ...(extension.computed || {}),
    },
    events: {
      ...(base.events || {}),
      ...(extension.events || {}),
    },
    slots: {
      ...(base.slots || {}),
      ...(extension.slots || {}),
    },
    render: extension.render || base.render,
    created: extension.created || base.created,
    updated: extension.updated || base.updated,
    destroyed: extension.destroyed || base.destroyed,
  } as any as Component<Extend<BA, A>, Extend<BE, E>, Extend<BS, S>, Extend<BL, L>, Extend<BC, C>>;
}