import { isObject, isFunction, isArray } from 'expangine-runtime';
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
  const instance: NodeInstance = { elements: [element], component, scope, parent };

  if (isObject(attrs)) 
  {
    for (const attr in attrs) 
    {
      const attrValue = attrs[attr];
      const apply = getPropertySetter(tag as string, attr);

      if (Scope.isWatchable(attrValue)) 
      {
        scope.watch(attrValue, (v) => 
        {
          apply(element, v);
        });
      }
      else 
      {
        apply(element, attrValue);
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

      const handler = isFunction(eventValue)
        ? eventValue
        : scope.eval(eventValue, ['nativeEvent', 'stop', 'prevent']);

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

        if (handler(eventObject, scope) === false) 
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

  const childs =  getSlots(childSlots);

  if (childs.length > 0) 
  {
    const childController = createChildNodes(childs, scope, component, instance);

    for (const child of childController.elements)
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

function getPropertySetter(tag: string, propPath: string): ((e: HTMLElement, value: any) => void)
{
  const path = propPath.split('_');
  const prop = path[0];
  const options = getPropertyOptions(prop);
  const { tags, property, attribute, stringify } = options;
  const forStyle = attribute.toLowerCase() === 'style';
  const useProperty = tags !== true && 
    (tags.length === 0 || tags.includes(tag.toLowerCase()));

  if (property && useProperty) 
  {
    if (path.length > 1)
    {
      return (e, value) =>
      {
        const n = path.length - 1;
        let curr = e;

        for (let i = 0; i < n; i++) {
          const node = path[i];
          if (!curr[node]) {
            curr[node] = {};
          }
          curr = curr[node];
        }
        
        if (value === undefined || value === null) {
          delete curr[path[n]];
        } else {
          curr[path[n]] = value;
        }
      };
    }
    else
    {
      return (e, value) => 
      {
        if (value === null || value === undefined || value === '') {
          e.removeAttribute(attribute);
        } else if (stringify) {
          e[property] = convertToString(value, forStyle);
        } else {
          e[property] = value;
        }
      };
    }
  } 
  else 
  {
    return (e, value) => 
    {
      const stringValue = convertToString(value, forStyle);

      if (stringValue === '') {
        e.removeAttribute(attribute);
      } else {
        e.setAttribute(attribute, stringValue);
      }
    };
  }
}

interface NoProperty
{
  property: false;
  attribute: string;
  tags: true;
  stringify: boolean;
}

interface HasProperty
{
  property: string;
  attribute: string;
  tags: string[] | true;
  stringify: boolean;
}

function getPropertyOptions(prop: string): NoProperty | HasProperty
{
  const option = tagSupportByProperty[prop];
  const attr = propertyToAttribute(prop);

  if (!option) {
    return {
      property: false,
      attribute: attr,
      tags: true,
      stringify: false,
    };
  }

  return {
    property: isArray(option) ? prop : option.property || prop,
    attribute: isArray(option) ? attr : option.attribute || attr,
    tags: isArray(option) ? option : option.tags || true,
    stringify: isArray(option) ? false : option.stringify || false,
  };
}

function propertyToAttribute(camel: string)
{
  return camel.replace(/([A-Z])/g, (x) => '-' + x.toLowerCase());
}

const tagSupportByProperty: Record<string, string[] | { property?: string, attribute?: string, tags?: string[], stringify?: true }> = {
  abbr: ['th'],
  accept: ['input'],
  acceptCharset: ['form'],
  accessKey: [],
  action: ['form'],
  allow: ['iframe'],
  allowdirs: ['input'],
  allowfullscreen: ['iframe'],
  allowPaymentRequest: ['iframe'],
  as: ['link'],
  async: ['script'],
  autocapitalize: ['textarea'],
  autocomplete: ['form', 'input', 'textarea'],
  autofocus: ['button', 'input', 'select', 'textarea'],
  autoplay: ['audio', 'media'],
  alt: ['area', 'img'],
  caption: ['table'],
  class: {
    property: 'className',
    stringify: true,
  },
  className: [],
  charset: ['script'],
  cite: ['blockquote', 'q', 'cite'],
  contentEditable: [],
  coords: ['area'],
  color: ['basefont'],
  cols: ['textarea'],
  colSpan: {
    tags: ['th', 'td'],
    attribute: 'colspan',
  },
  content: ['meta'],
  controls: ['audio', 'media'],
  crossOrigin: {
    tags: ['img', 'link', 'audio', 'media'],
    attribute: 'crossorigin',
  },
  csp: ['iframe'],
  currentTime: ['audio', 'media'],
  data: ['object'],
  dataset: [],
  decoding: ['img'],
  default: ['track'],
  defaultMuted: ['audio', 'media'],
  defaultPlaybackRate: ['audio', 'media'],
  defaultSelected: ['option'],
  defaultValue: ['input', 'output', 'textarea'],
  defer: ['script'],
  dirName: {
    tags: ['input'],
    attribute: 'dirname',
  },
  dir: [],
  disabled: ['button', 'fieldset', 'input', 'link', 'optgroup', 'option', 'select', 'style', 'textarea'],
  disableRemotePlayback: ['audio', 'media'],
  download: ['a', 'area'],
  draggable: [],
  encoding: ['form'],
  enctype: ['form'],
  face: ['basefont'],
  files: ['input'],
  for: {
    property: 'htmlFor',
    tags: ['label'],
  },
  form: ['input'],
  formAction: {
    tags: ['button', 'input'],
    attribute: 'formaction',
  },
  formEnctype: {
    tags: ['button', 'input'],
    attribute: 'formenctype',
  },
  formMethod: {
    tags: ['button', 'input'],
    attribute: 'formmethod',
  },
  formNoValidate: {
    tags: ['button', 'input'],
    attribute: 'formnovalidate',
  },
  formTarget: {
    tags: ['button', 'input'],
    attribute: 'formtarget',
  },
  hash: ['a', 'area'],
  height: ['canvas', 'embed', 'iframe', 'img', 'object', 'video'],
  hidden: [],
  host: ['a', 'area'],
  hostname: ['a', 'area'],
  href: ['a', 'area', 'base', 'link'],
  hreflang: ['a', 'area', 'link'],
  httpEquiv: ['meta'],
  id: [],
  inert: [],
  innerHTML: [],
  innerText: [],
  isMap: {
    tags: ['img'],
    attribute: 'ismap',
  },
  label: ['optgroup', 'track'],
  lang: [],
  length: ['select'],
  loading: ['img'],
  loop: ['audio', 'media'],
  kind: ['track'],
  max: ['input', 'progress'],
  maxLength: {
    tags: ['input', 'textarea'],
    attribute: 'maxlength',
  },
  media: ['a', 'area', 'link', 'source', 'style'],
  mediaGroup: {
    tags: ['audio', 'media'],
    attribute: 'mediagroup',
  },
  menu: ['button'],
  method: ['form'],
  min: ['input'],
  minLength: {
    tags: ['input', 'textarea'],
    attribute: 'minlength'
  },
  multiple: ['input', 'select'],
  muted: ['audio', 'media'],
  name: ['button', 'fieldset', 'form', 'iframe', 'input', 'map', 'meta', 'object', 'output', 'param', 'select', 'textarea'],
  noValidate: {
    tags: ['form'],
    attribute: 'novalidate',
  },
  noModule: ['script'],
  open: ['dialog'],
  outerHTML: [],
  password: ['a', 'area'],
  pathname: ['a', 'area'],
  pattern: ['input'],
  placeholder: ['input', 'textarea'],
  playbackRate: ['audio', 'media'],
  port: ['a', 'area'],
  poster: ['video'],
  protocol: ['a', 'area'],
  readOnly: {
    tags: ['input', 'textarea'],
    attribute: 'readonly',
  },
  referrerPolicy: {
    tags: ['iframe', 'img', 'link', 'script'],
    attribute: 'referrerpolicy',
  },
  rel: ['a', 'area', 'link'],
  returnValue: ['dialog'],
  required: ['input', 'select', 'textarea'],
  reversed: ['ol'],
  rows: ['textarea'],
  rowSpan: {
    tags: ['td', 'th'],
    attribute: 'rowspan',
  },
  scrollTop: [],
  sandbox: ['iframe'],
  scope: ['th'],
  search: ['area'],
  select: ['content'],
  selected: ['option'],
  selectedIndex: ['select'],
  selectionStart: ['input', 'textarea'],
  selectionEnd: ['input', 'textarea'],
  selectionDirection: ['input', 'textarea'],
  shape: ['area'],
  size: ['basefont', 'input', 'select'],
  sizes: ['img'],
  src: ['embed', 'iframe', 'img', 'media', 'audio', 'script', 'source', 'track'],
  srcset: ['img'],
  srcdoc: ['iframe'],
  srclang: ['track'],
  span: ['col', 'colgroup'],
  start: ['ol'],
  step: ['input'],
  style: {
    tags: [],
    stringify: true,
  },
  tabIndex: {
    tags: [],
    attribute: 'tabindex',
  },
  target: ['a', 'area', 'base', 'form'],
  textContent: [],
  text: ['a', 'option', 'script', 'title'],
  title: [],
  type: ['a', 'area', 'button', 'embed', 'input', 'link', 'ol', 'object', 'script', 'source', 'style'],
  typeMustMatch: {
    tags: ['object'],
    attribute: 'typemustmatch',
  },
  useMap: {
    tags: ['img', 'object'],
    attribute: 'usemap',
  },
  username: ['a', 'area'],
  volume: ['audio', 'media'],
  validationMessage: ['fieldset'],
  validity: ['fieldset', 'input'],
  value: ['button', 'data', 'input', 'li', 'option', 'output', 'param', 'progress', 'select', 'textarea'],
  width: ['canvas', 'embed', 'iframe', 'img', 'object', 'video'],
  wrap: ['textarea'],
};

function convertToString(x: any, forStyle: boolean = false): string
{
  if (isArray(x))
  {
    return x.map((y) => convertToString(y)).filter((y) => Boolean(y)).join(forStyle ? '; ' : ' ');
  }
  else if (isObject(x))
  {
    const converted = [];

    for (const prop in x)
    {
      if (x[prop] || (forStyle && x[prop] === 0))
      {
        converted.push(forStyle
          ? prop + ': ' + convertToString(x[prop])
          : prop
        );
      }
    }

    return converted.join(forStyle ? '; ' : ' ');
  }
  
  return x === null || x === undefined || x === false ? '' : String(x);
}