import { NodeCompiler, NodeTemplate, NodeInstance } from './Node';
import { Scope } from './Scope';
import { Component } from './Component';
import { ComponentInstance } from './ComponentInstance';
export declare const RootComponent: Component<any, any, any>;
export declare function getCompiler(template: NodeTemplate): NodeCompiler;
export declare function compile(template: NodeTemplate, component: ComponentInstance<any, any, any>, scope: Scope, parent?: NodeInstance): NodeInstance;
export declare function mount(page: any, template: NodeTemplate, replace: Node): ComponentInstance<any, any, any>;
