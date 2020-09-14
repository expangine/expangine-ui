import { Expression } from 'expangine-runtime';
import { Scope } from './Scope';
import { ComponentInstance } from './ComponentInstance';
export declare type Off = () => void;
export declare type NodeTemplateTag = string | Expression;
export declare type NodeTemplateValues = Record<string, Expression | any>;
export declare type NodeTemplateEvents = Record<string, Expression | any | ((payload: any) => any)>;
export declare type NodeTemplateChild = string | NodeTemplate | Expression;
export declare type NodeTemplateNamedSlots = Record<string, NodeTemplateChild>;
export declare type NodeTemplateSlots = NodeTemplateChild[] | NodeTemplateNamedSlots;
export declare type NodeTemplate = [NodeTemplateTag, NodeTemplateValues?, NodeTemplateEvents?, NodeTemplateSlots?];
export declare type NodeCompiler = (template: NodeTemplate, component: ComponentInstance<any, any, any>, scope: Scope, parent?: NodeInstance) => NodeInstance;
export interface NodeInstance {
    parent?: NodeInstance;
    children?: NodeInstance[];
    component: ComponentInstance<any, any, any>;
    element: Node[];
    scope: Scope;
}
export declare function isStyleElement(x: any): x is HTMLElement;
export declare function getSlots(slots?: NodeTemplateSlots, name?: string): NodeTemplateChild[];
export declare function isNamedSlots(value: any): value is NodeTemplateNamedSlots;
export declare function changeElement(instance: NodeInstance, element: Node[]): void;
export interface NodeChildrenController {
    element: Node[];
    updateScopes(values: any): void;
    destroyScopes(): void;
}
export declare function createChildNodes(children: NodeTemplateChild[], scope: Scope, component: ComponentInstance<any, any, any>, childScope: Scope, instance: NodeInstance): NodeChildrenController;
