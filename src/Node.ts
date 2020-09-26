import { Expression, isObject, isString, isArray, ExpressionValue } from 'expangine-runtime';
import { DEFAULT_SLOT } from './constants';
import { Scope } from './Scope';
import { ComponentInstanceAny } from './ComponentInstance';
import { compile } from './compile';


export type Off = () => void;
export type NodeTemplateTag = string | Expression;
export type NodeTemplateValues = Record<string, ExpressionValue>; // when value is Expression, that expression is watched
export type NodeTemplateEvents = Record<string, ExpressionValue | ((payload: any) => any)>;
export type NodeTemplateChild = string | NodeTemplate | Expression;
export type NodeTemplateNamedSlots = Record<string, NodeTemplateChild[] | Record<string, NodeTemplateChild[]>>;
export type NodeTemplateSlots = NodeTemplateChild[] | NodeTemplateNamedSlots;

export type NodeTemplate = [
  NodeTemplateTag,
  NodeTemplateValues?,
  NodeTemplateEvents?,
  NodeTemplateSlots?
];


export type NodeCompiler = (template: NodeTemplate, component: ComponentInstanceAny, scope: Scope, parent?: NodeInstance) => NodeInstance;

export interface NodeInstance 
{
  parent?: NodeInstance;
  children?: NodeInstance[];
  component: ComponentInstanceAny;
  elements: Node[];
  scope: Scope;
}


export function isStyleElement(x: any): x is HTMLElement 
{
  return !!x && isObject(x.style);
}

export function getSlots(slots?: NodeTemplateSlots, name: string = DEFAULT_SLOT, slotIndex: number = 0): NodeTemplateChild[]
{
  return !slots
    ? []
    : isArray(slots)
      ? slots
      : isObject(slots) && isArray(slots[name])
        ? slots[name]
        : isObject(slots) && isObject(slots[name]) && isArray(slots[name][slotIndex])
          ? slots[name][slotIndex]
          : [];
}


export function isNamedSlots(value: any): value is NodeTemplateNamedSlots
{
  return typeof value === 'object' && !Array.isArray(value);
}

export function changeElements(target: Node[], elements: Node[])
{
  if (target.length === 0)
  {
    target.push(...elements);
  }
  else
  {
    const parent = target[0].parentNode;

    if (parent)
    {
      const removing: Set<Node> = new Set(target);
      let prev: Node = target[0].previousSibling;

      for (let i = 0; i < elements.length; i++)
      {
        const desired = elements[i];
        const current = prev
          ? prev.nextSibling
          : target[i];

        removing.delete(desired);

        if (current !== desired)
        {
          if (current)
          {
            parent.insertBefore(desired, current);
          }
          else if (!prev && parent.firstChild)
          {
            parent.insertBefore(desired, parent.firstChild);
          }
          else
          {
            parent.appendChild(desired);
          }
        }

        prev = desired;
      }

      for (const remove of removing)
      {
        parent.removeChild(remove);
      }
    }

    target.splice(0, target.length, ...elements);
  }
}

export interface NodeChildrenController
{
  elements: Node[];
  updateScopes( values: any ): void;
  destroy(): void;
}

export function createChildNodes(children: NodeTemplateChild[], scope: Scope, component: ComponentInstanceAny, instance: NodeInstance, sharedScope: boolean = false): NodeChildrenController
{
  const elements: Node[] = [];
  const scopes: Scope[] = [];

  for (const child of children)
  {
    if (isString(child)) 
    {
      elements.push(document.createTextNode(child));
    } 
    else if (Scope.isWatchable(child))
    {
      const textNode = document.createTextNode('');

      scope.watch(child, (text) =>
      {
        textNode.textContent = text;
      });

      elements.push(textNode);
    }
    else 
    {
      const childNode = compile(child, component, scope, instance);

      for (const childElement of childNode.elements)
      {
        elements.push(childElement);
      }

      if (childNode.scope !== scope)
      {
        scopes.push(childNode.scope);
      }

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
    elements,
    updateScopes(values: any) 
    {
      scope.setMany(values);

      for (const s of scopes) 
      {
        s.setMany(values);
      }
    },
    destroy() 
    {
      if (!sharedScope) 
      {
        scope.destroy();
      }

      for (const s of scopes) 
      {
        s.destroy();
      }
    },
  };
}
