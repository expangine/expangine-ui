
import { isString } from 'expangine-runtime';
import { ComponentRegistry } from './ComponentRegistry';
import { NodeCompiler, NodeTemplate, NodeInstance } from './Node';
import { Scope } from './Scope';
import { Component } from './Component';
import { ComponentInstance } from './ComponentInstance';
import { COMPILER_COMPONENT, COMPILER_DEFAULT, COMPILER_DYNAMIC } from './constants';
import { compilers } from './compilers';


export const RootComponent: Component<any, any, any> =  {
  collection: 'expangine',
  name: 'root',
  attributes: {},
  events: {},
  slots: {},
  render: () => [':slot', {}, {}, []],
};

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

export function mount(page: any, template: NodeTemplate, replace: Node): ComponentInstance<any, any, any>
{
    const rootScope = new Scope(null, { page, refs: {} });

    const instance = new ComponentInstance(RootComponent, { default: template });
    const compiled = compile(template, instance, rootScope);

    if (replace.parentElement) {
        for (const e of compiled.element) {
            replace.parentElement.insertBefore(e, replace);
        }
        replace.parentElement.removeChild(replace);
    }

    instance.node = compiled;

    return instance;
}