
import { isString } from 'expangine-runtime';
import { ComponentRegistry } from './ComponentRegistry';
import { NodeCompiler, NodeTemplate, NodeInstance, changeElements } from './Node';
import { Scope } from './Scope';
import { ComponentInstance } from './ComponentInstance';
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

export function compile(template: NodeTemplate, component: ComponentInstance<any, any, any>, scope: Scope, parent?: NodeInstance): NodeInstance
{
  return getCompiler(template)(template, component, scope, parent);
}

export function mount<D>(data: D, template: NodeTemplate, replace?: Node): ComponentInstance<D, any, any>
{
  const rootScope = new Scope<D>(null, { ...data, refs: {} });

  const instance = new ComponentInstance<any, any, any>({
    collection: 'expangine',
    name: 'mounted',
    attributes: {},
    events: {},
    slots: {},
    render: () => template,
  }, rootScope);

  const compiled = compile(template, instance, rootScope);

  if (replace) 
  {
    changeElements([replace], compiled.element);
  }

  instance.node = compiled;

  return instance;
}