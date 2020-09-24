import { NodeCompiler, NodeTemplate, NodeInstance } from './Node';
import { Scope } from './Scope';
import { ComponentInstanceAny } from './ComponentInstance';
export declare function getCompiler(template: NodeTemplate): NodeCompiler;
export declare function compile(template: NodeTemplate, component: ComponentInstanceAny, scope: Scope, parent?: NodeInstance): NodeInstance;
export declare function mount<D>(data: D, template: NodeTemplate, replace?: Node): ComponentInstanceAny;
