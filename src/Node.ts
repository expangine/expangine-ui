import { Expression, isObject, isString, isArray } from 'expangine-runtime';
import { DEFAULT_SLOT } from './constants';
import { Scope } from './Scope';
import { ComponentInstance } from './ComponentInstance';
import { compile } from './compile';


export type Off = () => void;
export type NodeTemplateTag = string | Expression;
export type NodeTemplateValues = Record<string, Expression | any>; // when value is Expression, that expression is watched
export type NodeTemplateEvents = Record<string, Expression | any | ((payload: any) => any)>;
export type NodeTemplateChild = string | NodeTemplate | Expression;
export type NodeTemplateNamedSlots = Record<string, NodeTemplateChild>;
export type NodeTemplateSlots = NodeTemplateChild[] | NodeTemplateNamedSlots;

export type NodeTemplate = [
  NodeTemplateTag,
  NodeTemplateValues?,
  NodeTemplateEvents?,
  NodeTemplateSlots?
];


export type NodeCompiler = (template: NodeTemplate, component: ComponentInstance<any, any, any>, scope: Scope, parent?: NodeInstance) => NodeInstance;

export interface NodeInstance 
{
  parent?: NodeInstance;
  children?: NodeInstance[];
  component: ComponentInstance<any, any, any>;
  element: Node[];
  scope: Scope;
}


export function isStyleElement(x: any): x is HTMLElement 
{
  return !!x && isObject(x.style);
}

export function getSlots(slots?: NodeTemplateSlots, name: string = DEFAULT_SLOT): NodeTemplateChild[]
{
  return !slots
    ? []
    : isArray(slots)
      ? slots
      : isObject(slots) && slots[name]
        ? [slots[name]]
        : [];
}


export function isNamedSlots(value: any): value is NodeTemplateNamedSlots
{
  return typeof value === 'object' && !Array.isArray(value);
}

export function changeElement(instance: NodeInstance, element: Node[])
{
  for (let i = 0; i < element.length; i++) 
  {
    const n = element[i];
    const o = instance.element[i];

    if (o === n) 
    {
      continue;
    }

    if (o) 
    {
      if (o.parentElement)
      {
        o.parentElement.replaceChild(n, o);
      }
      
      instance.element[i] = n;
    } 
    else if (!o && i > 0) 
    {
      const prev = instance.element[i - 1];
      const next = prev.nextSibling;

      if (next && next.parentElement) 
      {
        next.parentElement.insertBefore(n, next);
      } 
      else if (!next && prev && prev.parentElement) 
      {
        prev.parentElement.appendChild(n);
      }

      instance.element[i] = n;
    }
  }

  for (let i = instance.element.length - 1; i >= element.length; i--) 
  {
    const o = instance.element[i];

    if (o.parentElement) 
    {
      o.parentElement.removeChild(o);
    }

    instance.element.splice(i, 1);
  }
}

export interface NodeChildrenController
{
  element: Node[];
  updateScopes( values: any ): void;
  destroyScopes(): void;
}

export function createChildNodes(children: NodeTemplateChild[], scope: Scope, component: ComponentInstance<any, any, any>, childScope: Scope, instance: NodeInstance): NodeChildrenController
{
  const element: Node[] = [];
  const scopes: Scope[] = [];

  for (const child of children)
  {
    if (isString(child)) 
    {
      element.push(document.createTextNode(child));
    } 
    else if (child instanceof Expression)
    {
      const textNode = document.createTextNode('');

      scope.watch(child, (text) =>
      {
        textNode.textContent = text;
      });

      element.push(textNode);
    }
    else 
    {
      const childNode = compile(child, component, childScope, instance);

      for (const childElement of childNode.element)
      {
        element.push(childElement);
      }

      scopes.push(childNode.scope);

      if (!instance.children)
      {
        instance.children = [childNode];
      }
      else
      {
        instance.children.push(childNode);
      }
    }
  }

  return {
    element,
    updateScopes(values: any) {
      for (const s of scopes) {
        s.setMany(values);
      }
    },
    destroyScopes() {
      for (const s of scopes) {
        s.destroy();
      }
    },
  };
}
