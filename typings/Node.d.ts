import { Expression, ExpressionValue } from 'expangine-runtime';
import { Scope } from './Scope';
import { ComponentInstanceAny } from './ComponentInstance';
export declare type Off = () => void;
export declare type NodeTemplateTag = string | Expression;
export declare type NodeTemplateValues = Record<string, ExpressionValue>;
export declare type NodeTemplateEvents = Record<string, ExpressionValue | ((payload: any) => any)>;
export declare type NodeTemplateChild = string | NodeTemplate | Expression;
export declare type NodeTemplateNamedSlots = Record<string, NodeTemplateChild[]>;
export declare type NodeTemplateSlots = NodeTemplateChild[] | NodeTemplateNamedSlots;
export declare type NodeTemplate = [NodeTemplateTag, NodeTemplateValues?, NodeTemplateEvents?, NodeTemplateSlots?];
export declare type NodeCompiler = (template: NodeTemplate, component: ComponentInstanceAny, scope: Scope, parent?: NodeInstance) => NodeInstance;
export interface NodeInstance {
    parent?: NodeInstance;
    children?: NodeInstance[];
    component: ComponentInstanceAny;
    elements: Node[];
    scope: Scope;
}
export declare function isStyleElement(x: any): x is HTMLElement;
export declare function getSlots(slots?: NodeTemplateSlots, name?: string): NodeTemplateChild[];
export declare function isNamedSlots(value: any): value is NodeTemplateNamedSlots;
export declare function changeElements(target: Node[], elements: Node[]): void;
export interface NodeChildrenController {
    elements: Node[];
    updateScopes(values: any): void;
    destroy(): void;
}
export declare function createChildNodes(children: NodeTemplateChild[], scope: Scope, component: ComponentInstanceAny, instance: NodeInstance, sharedScope?: boolean): NodeChildrenController;
