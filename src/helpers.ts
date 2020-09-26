import { ExpressionValue, Expression, Exprs } from "expangine-runtime";
import { HideAction } from './compilers/switch';
import { NodeTemplate, NodeTemplateChild } from "./Node";
import { DIRECTIVE_IF, DIRECTIVE_FOR, DIRECTIVE_SLOT, DIRECTIVE_SWITCH } from "./constants";
import { Component } from "./Component";

export function createIf(condition: ExpressionValue, truthy: NodeTemplateChild[], mode: HideAction = 'detach'): NodeTemplate
{
    return createIfs([[condition, truthy]], undefined, mode);
}

export function createIfElse(condition: ExpressionValue, truthy: NodeTemplateChild[], falsy: NodeTemplateChild[], mode: HideAction = 'detach'): NodeTemplate
{
    return createIfs([[condition, truthy]], falsy, mode);
}

export function createIfs(cases: [ExpressionValue, NodeTemplateChild[]][], otherwise?: NodeTemplateChild[], mode: HideAction = 'detach'): NodeTemplate
{
    return [DIRECTIVE_IF, {
        mode,
        cases: cases.reduce((out, [expr,], key) => (out[key] = expr, out), {}),
    }, {}, {
        ...cases.reduce((out, [,tmpl], key) => (out[key] = tmpl, out), {}),
        default: otherwise,
    }];
}

export function createShow(condition: ExpressionValue, truthy: NodeTemplateChild[]): NodeTemplate
{
    return createIfs([[condition, truthy]], undefined, 'hide');
}

export function createHide(condition: ExpressionValue, truthy: NodeTemplateChild[]): NodeTemplate
{
    return createIfs([[Exprs.not(condition), truthy]], undefined, 'hide');
}

export function createSwitch(value: ExpressionValue, cases: [ExpressionValue, NodeTemplateChild[]][], defaultCase?: ExpressionValue, isEqual?: string): NodeTemplate
{
    return [DIRECTIVE_SWITCH, {
        value,
        cases: cases.reduce((out, [expr,], key) => (out[key] = expr, out), {}),
        isEqual,
    }, {}, {
        ...cases.reduce((out, [,tmpl], key) => (out[key] = tmpl, out), {}),
        default: defaultCase,
    }];
}

export function createComponent<A, E, S extends string, L, C>(
    component: Component<A, E, S, L, C>, 
    attributes: Partial<Record<keyof A, ExpressionValue> & { ref: string }> = {}, 
    events: Partial<Record<keyof E, ExpressionValue>> = {}, 
    slots: Partial<Record<S | 'default', NodeTemplateChild[] | Record<string, NodeTemplateChild[]>>> = {}
): NodeTemplate {
    return [`${component.collection}/${component.name}`,
        attributes,
        events,
        slots,
    ];
}

export function createFor(items: Expression, children: NodeTemplateChild[], options: { index?: string, item?: string, key?: ExpressionValue } = {}): NodeTemplate
{
    return [DIRECTIVE_FOR, {
        items,
        ...options,
    }, {}, 
        children,
    ];
}

export function createSlot(attrs: { name?: string, scope?: Record<string, ExpressionValue>, slotIndex?: ExpressionValue }, children: NodeTemplateChild[] = []): NodeTemplate
{
    return [DIRECTIVE_SLOT, attrs, {}, children];
}
