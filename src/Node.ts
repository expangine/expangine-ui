import { Expression, isObject, isString, isArray } from 'expangine-runtime';
import { DEFAULT_SLOT } from './constants';
import { Scope } from './Scope';
import { ComponentInstanceAny } from './ComponentInstance';
import { compile } from './compile';


export type Off = () => void;
export type NodeTemplateTag = string | Expression;
export type NodeTemplateValues = Record<string, Expression | any>; // when value is Expression, that expression is watched
export type NodeTemplateEvents = Record<string, Expression | any | ((payload: any) => any)>;
export type NodeTemplateChild = string | NodeTemplate | Expression;
export type NodeTemplateNamedSlots = Record<string, NodeTemplateChild[]>;
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
        ? slots[name]
        : [];
}


export function isNamedSlots(value: any): value is NodeTemplateNamedSlots
{
  return typeof value === 'object' && !Array.isArray(value);
}

export function changeElements(target: Node[], element: Node[])
{
  if (target.length === 0)
  {
    target.push(...element);
  }
  else
  {
    const parent = target[0].parentNode;

    if (parent)
    {
      let prev: Node = target[0].previousSibling;
      let removing: Set<Node> = new Set(target);

      for (let i = 0; i < element.length; i++)
      {
        const desired = element[i];
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

    target.splice(0, target.length, ...element);
  }
}

export interface NodeChildrenController
{
  element: Node[];
  updateScopes( values: any ): void;
  destroyScopes(): void;
}

export function createChildNodes(children: NodeTemplateChild[], scope: Scope, component: ComponentInstanceAny, instance: NodeInstance): NodeChildrenController
{
  const element: Node[] = [];
  const scopes: Scope[] = [scope];

  for (const child of children)
  {
    if (isString(child)) 
    {
      element.push(document.createTextNode(child));
    } 
    else if (Scope.isWatchable(child))
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
      const childNode = compile(child, component, scope, instance);

      for (const childElement of childNode.element)
      {
        element.push(childElement);
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
