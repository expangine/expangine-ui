import { Type, Expression, ObjectType, ExpressionValue } from 'expangine-runtime';
import { ComponentInstance } from './ComponentInstance';
import { NodeTemplate } from './Node';


export interface ComponentValue<A, E, S extends string, L, C, V extends keyof A> 
{
  type: Type;
  default?: Expression;
  callable?: ObjectType;
  changed? (value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
  initial? (value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
  update? (value: A[V], instance: ComponentInstance<A, E, S, L, C>): void;
}

export interface ComponentSlot
{
  scope: ObjectType;
  array?: true;
  arrayLength?: ExpressionValue;
  arrayIndexAlias?: string;
}

export interface ComponentBase<A, E = never, S extends string = never, L = never, C = never> 
{
  name: string;
  collection: string;
  render (instance: ComponentInstance<A, E, S, L, C>): NodeTemplate;
  created? (instance: ComponentInstance<A, E, S, L, C>): void;
  updated? (instance: ComponentInstance<A, E, S, L, C>): void;
  destroyed? (instance: ComponentInstance<A, E, S, L, C>): void;
}

export type NeverPartial<T, O> = [T] extends [never] ? Partial<O> : O;

export type Component<A = never, E = never, S extends string = never, L = never, C = never> = 
  ComponentBase<A, E, S, L, C> & 
  NeverPartial<A, { attributes: { [V in keyof A]: ComponentValue<A, E, S, L, C, V> | Type } }> & 
  NeverPartial<L, { state: { [V in keyof L]: Expression } }> & 
  NeverPartial<C, { computed: { [V in keyof C]: Expression } }> & 
  NeverPartial<E, { events: { [K in keyof E]: ObjectType } }> & 
  NeverPartial<S, { slots: { [K in S]: ComponentSlot | ObjectType } }>
;