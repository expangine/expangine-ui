import { Type, isObject } from 'expangine-runtime';
import { NodeCompiler, isNamedSlots } from '../Node';
import { Scope } from '../Scope';
import { ComponentRegistry } from '../ComponentRegistry';
import { ComponentInstance } from '../ComponentInstance';
import { compile } from '../compile';


export const CompilerComponent: NodeCompiler = (template, parentComponent, scope, parent) => 
{
    const [id, attrs, events, childSlots] = template;
    const componentBase = ComponentRegistry[id as string];
    const component = new ComponentInstance(componentBase, isNamedSlots(childSlots) ? childSlots : undefined, parentComponent);
    const rendered = componentBase.render(component);
    const localScope = scope.createChild({ this: component, refs: {} });
    const instance = compile(rendered, component, localScope, parent);

    if (scope && scope.data.refs && componentBase.ref)
    {
        scope.data.refs[componentBase.ref] = component;
    }

    component.node = instance;
    component.scope = localScope;

    if (componentBase.attributes)
    {
        for (const attr in componentBase.attributes)
        {
            const attrValue = componentBase.attributes[attr];
            const attrObject = attrValue instanceof Type
                ? { type: attrValue }
                : attrValue;

            const attrInput = attrs && attr in attrs ? attrs[attr] : attrObject.default;

            if (Scope.isWatchable(attrInput))
            {
                let first = true;

                scope.watch(attrInput, (v) =>
                {
                    localScope.set(attr, v);

                    if (instance.element)
                    {
                        if (first && attrObject.initial)
                        {
                            attrObject.initial(v, component, instance.element);
                        }
                        else if (!first && attrObject.changed)
                        {
                            attrObject.changed(v, component, instance.element);
                        }
                        if (attrObject.update)
                        {
                            attrObject.update(v, component, instance.element);
                        }
                        if (!first && componentBase.updated)
                        {
                            componentBase.updated(component, instance.element);
                        }
                    }
                    
                    first = false;
                });
            }
            else
            {
                localScope.set(attr, attrInput);
            }
        }
    }

    if (componentBase.state)
    {
        const localState = scope.eval(componentBase.state)();

        if (isObject(localState)) 
        {
            for (const stateName in localState)
            {
                localScope.set(stateName, localState[stateName]);
            }
        }
    }

    if (isObject(events) && componentBase.events) 
    {
        for (const ev in events) 
        {
            if (!(ev in componentBase.events))
            {
                continue;
            }

            const eventValue = events[ev];

            if (Scope.isWatchable(eventValue)) 
            {
                const listener = localScope.eval(eventValue);

                component.on(ev, listener);
            }
        }
    }

    if (componentBase.created && instance.element) 
    {
        componentBase.created(component, instance.element);
    }
    
    return instance;
};