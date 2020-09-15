import { NodeCompiler, NodeTemplate, NodeInstance } from './Node';
import { Scope } from './Scope';
import { ComponentInstance } from './ComponentInstance';
export declare function getCompiler(template: NodeTemplate): NodeCompiler;
export declare function compile(template: NodeTemplate, component: ComponentInstance<any, any, any>, scope: Scope, parent?: NodeInstance): NodeInstance;
export declare function mount(data: any, template: NodeTemplate, replace?: Node): ComponentInstance<any, any, any>;
