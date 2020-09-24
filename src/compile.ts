
import { isString } from 'expangine-runtime';
import { ComponentRegistry } from './ComponentRegistry';
import { NodeCompiler, NodeTemplate, NodeInstance, changeElements } from './Node';
import { Scope } from './Scope';
import { ComponentInstance, ComponentInstanceAny } from './ComponentInstance';
import { COMPILER_COMPONENT, COMPILER_DEFAULT, COMPILER_DYNAMIC } from './constants';
import { compilers } from './compilers';

export function getCompiler(template: NodeTemplate): NodeCompiler  
{
  const [tag] = template;
  const key = isString(tag) 
    ? tag in compilers
      ? tag
      : tag in ComponentRegistry
        ? COMPILER_COMPONENT
        : COMPILER_DEFAULT
    : COMPILER_DYNAMIC;

  return compilers[key];
}

export function compile(template: NodeTemplate, component: ComponentInstanceAny, scope: Scope, parent?: NodeInstance): NodeInstance
{
  return getCompiler(template)(template, component, scope, parent);
}

export function mount<D>(data: D, template: NodeTemplate, replace?: Node): ComponentInstanceAny
{
  const rootScope = new Scope<D>(null, { ...data, refs: {} });

  const instance = new ComponentInstance<any, any, any, any, any>({
    collection: 'expangine',
    name: 'mounted',
    attributes: {},
    events: {},
    slots: {},
    state: {},
    computed: {},
    render: () => template,
  }, rootScope);

  const compiled = compile(template, instance, rootScope);

  if (replace) 
  {
    changeElements([replace], compiled.elements);
  }

  instance.node = compiled;

  return instance;
}