import { Type, Expression, ObjectType } from 'expangine-runtime';
import { ComponentInstance } from './ComponentInstance';
import { NodeTemplate } from './Node';


export interface ComponentValue<A, E, S extends string, V extends keyof A> 
{
  type: Type;
  default?: Expression;
  changed? (value: A[V], instance: ComponentInstance<A, E, S>): void;
  initial? (value: A[V], instance: ComponentInstance<A, E, S>): void;
  update? (value: A[V], instance: ComponentInstance<A, E, S>): void;
}

export interface ComponentBase<A, E = never, S extends string = never> 
{
  ref?: string;
  name: string;
  collection: string;
  state?: Expression;
  render (instance: ComponentInstance<A, E, S>): NodeTemplate;
  created? (instance: ComponentInstance<A, E, S>): void;
  updated? (instance: ComponentInstance<A, E, S>): void;
  destroyed? (instance: ComponentInstance<A, E, S>): void;
}

export type IfNever<T, Y, N> = [T] extends [never] ? Y : N;

export type Component<A = never, E = never, S extends string = never> = 
  ComponentBase<A, E, S> & 
  IfNever<A, {}, { attributes: { [V in keyof A]: ComponentValue<A, E, S, V> | Type } }> & 
  IfNever<E, {}, { events: { [K in keyof E]: Type } }> & 
  IfNever<S, {}, { slots: { [L in S]: ObjectType } }>
;