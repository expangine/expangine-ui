import { Type, Expression, ObjectType } from 'expangine-runtime';
import { ComponentInstance } from './ComponentInstance';
import { NodeTemplate } from './Node';


export interface ComponentValue<A, E, S extends string, L, V extends keyof A> 
{
  type: Type;
  default?: Expression;
  changed? (value: A[V], instance: ComponentInstance<A, E, S, L>): void;
  initial? (value: A[V], instance: ComponentInstance<A, E, S, L>): void;
  update? (value: A[V], instance: ComponentInstance<A, E, S, L>): void;
}

export interface ComponentBase<A, E = never, S extends string = never, L = never> 
{
  name: string;
  collection: string;
  render (instance: ComponentInstance<A, E, S, L>): NodeTemplate;
  created? (instance: ComponentInstance<A, E, S, L>): void;
  updated? (instance: ComponentInstance<A, E, S, L>): void;
  destroyed? (instance: ComponentInstance<A, E, S, L>): void;
}

export type IfNever<T, Y, N> = [T] extends [never] ? Y : N;

export type Component<A = never, E = never, S extends string = never, L = never> = 
  ComponentBase<A, E, S, L> & 
  IfNever<L, {}, { state: { [V in keyof L]: Expression } }> & 
  IfNever<A, {}, { attributes: { [V in keyof A]: ComponentValue<A, E, S, L, V> | Type } }> & 
  IfNever<E, {}, { events: { [K in keyof E]: Type } }> & 
  IfNever<S, {}, { slots: { [L in S]: ObjectType } }>
;