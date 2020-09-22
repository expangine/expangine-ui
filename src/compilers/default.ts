import { isObject, isFunction } from 'expangine-runtime';
import { NodeCompiler, NodeInstance, getSlots, createChildNodes } from '../Node';
import { Scope } from '../Scope';


export interface DefaultEventObject
{
  stop: boolean;
  prevent: boolean;
  nativeEvent: Event;
}

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
          applyAttribute(element, attr, v);
        });
      }
      else 
      {
        applyAttribute(element, attr, attrValue);
      }
    }
  }

  if (isObject(events)) 
  {
    for (const ev in events) 
    {
      const eventParts = ev.split('.');
      const eventName = eventParts.shift();
      const eventValue = events[eventName];
    
      const listenerOptions: AddEventListenerOptions = {
        once:     hasModifier(eventParts, 'once'),
        passive:  hasModifier(eventParts, 'passive'),
        capture:  hasModifier(eventParts, 'capture'),
      };

      if (isFunction(eventValue)) 
      {
        element.addEventListener(eventName, eventValue, listenerOptions);
      } 
      else
      { 
        const listener = scope.eval(eventValue);

        element.addEventListener(eventName, (nativeEvent) => 
        {
          for (const modifier of eventParts)
          {
            if (modifier in modifierHandlers)
            {
              if (!modifierHandlers[modifier](element, nativeEvent))
              {
                return;
              }
            }
          }

          const eventObject: DefaultEventObject = {
            nativeEvent,
            stop: false,
            prevent: false,
          };

          if (listener(eventObject) === false) 
          {
            return false;
          }

          for (const modifier in eventObject)
          {
            if (eventObject[modifier] && modifier in modifierHandlers)
            {
              if (!modifierHandlers[modifier](element, nativeEvent))
              {
                return;
              }
            }
          }

        }, listenerOptions);
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

const modifierHandlers: Record<string, (el: HTMLElement, ev: Event) => boolean> = {
  prevent (el: HTMLElement, ev: Event): boolean {
    if (ev.preventDefault) {
      ev.preventDefault();
    }
    return true;
  },
  stop (el: HTMLElement, ev: Event): boolean {
    if (ev.stopPropagation) {
      ev.stopPropagation();
    }
    return true;
  },
  self (el: HTMLElement, ev: Event): boolean {
    return ev.target === el;
  },
};

function hasModifier(modifiers: string[], modifier: string)
{
  const i = modifiers.indexOf(modifier);
  const exists = i >= 0;

  if (exists)
  {
    modifiers.splice(i, 1);
  }

  return exists;
}

function applyAttribute(e: HTMLElement, attr: string, value: any)
{
  if (value === '' || value === null || value === undefined)
  {
    if (e.hasAttribute(attr))
    {
      e.removeAttribute(attr);  
    }
  }
  else
  {
    e.setAttribute(attr, value);
  }
}