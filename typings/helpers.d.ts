import { ExpressionValue, Expression } from "expangine-runtime";
import { HideAction } from './compilers/switch';
import { NodeTemplate, NodeTemplateChild } from "./Node";
import { Component } from "./Component";
export declare function createIf(condition: ExpressionValue, truthy: NodeTemplateChild[], mode?: HideAction): NodeTemplate;
export declare function createIfElse(condition: ExpressionValue, truthy: NodeTemplateChild[], falsy: NodeTemplateChild[], mode?: HideAction): NodeTemplate;
export declare function createIfs(cases: [ExpressionValue, NodeTemplateChild[]][], otherwise?: NodeTemplateChild[], mode?: HideAction): NodeTemplate;
export declare function createShow(condition: ExpressionValue, truthy: NodeTemplateChild[]): NodeTemplate;
export declare function createHide(condition: ExpressionValue, truthy: NodeTemplateChild[]): NodeTemplate;
export declare function createSwitch(value: ExpressionValue, cases: [ExpressionValue, NodeTemplateChild[]][], defaultCase?: ExpressionValue, isEqual?: string): NodeTemplate;
export declare function createComponent<A, E, S extends string, L, C>(component: Component<A, E, S, L, C>, attributes?: Partial<Record<keyof A, ExpressionValue> & {
    ref: string;
}>, events?: Partial<Record<keyof E, ExpressionValue>>, slots?: Partial<Record<S | 'default', NodeTemplateChild[] | Record<string, NodeTemplateChild[]>>>): NodeTemplate;
export declare function createFor(items: Expression, children: NodeTemplateChild[], options?: {
    index?: string;
    item?: string;
    key?: ExpressionValue;
}): NodeTemplate;
export declare function createSlot(attrs?: {
    name?: string;
    scope?: Record<string, ExpressionValue>;
    slotIndex?: ExpressionValue;
}, children?: NodeTemplateChild[]): NodeTemplate;
