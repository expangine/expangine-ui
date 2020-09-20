import { isObject, isFunction } from 'expangine-runtime';
import { NodeCompiler, NodeInstance, getSlots, createChildNodes } from '../Node';
import { Scope } from '../Scope';


export const CompilerDefault: NodeCompiler = (template, component, scope, parent) => 
{
  const [tag, attrs, events, childSlots] = template;
  const element = document.createElement(tag as any) as HTMLElement;
  const instance: NodeInstance = { element: [element], component, scope, parent };

  if (isObject(attrs)) 
  {
    for (const attr in attrs) 
    {
      const attrValue = attrs[attr];

      if (Scope.isWatchable(attrValue)) 
      {
        scope.watch(attrValue, (v) => 
        {
          element.setAttribute(attr, v);
        });
      }
      else 
      {
        element.setAttribute(attr, attrValue);
      }
    }
  }

  if (isObject(events)) 
  {
    for (const ev in events) 
    {
      const eventValue = events[ev];

      if (isFunction(eventValue)) 
      {
        element.addEventListener(ev, eventValue);
      } 
      else
      { 
        const listener = scope.eval(eventValue);

        // todo: prevent, stop, capture, self, once
        element.addEventListener(ev, (nativeEvent) => 
        { 
          if (listener() === false) 
          {
            return false;
          }
        });
      }
    }
  }

  const childs =  getSlots(childSlots);

  if (childs.length > 0) 
  {
    const childController = createChildNodes(childs, scope, component, instance);

    for (const child of childController.element)
    {
      element.appendChild(child);
    }
  }

  return instance;
};