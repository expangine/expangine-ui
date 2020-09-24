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
  const localScope = new Scope<any>(null, { emit: {}, refs: {} });
  const component = new ComponentInstance(componentBase, attrs, localScope, isNamedSlots(childSlots) ? childSlots : undefined, parentComponent, scope);  
  const addRef = attrs?.ref;

  if (addRef)
  {
    delete attrs.ref;
  }

  if (componentBase.attributes)
  {
    for (const attr in componentBase.attributes)
    {
      const attrValue = componentBase.attributes[attr];
      const attrObject = attrValue instanceof Type
        ? { type: attrValue }
        : attrValue;

      if (attrObject.callable)
      {
        continue;
      }

      const attrInput = attrs && attr in attrs ? attrs[attr] : attrObject.default;

      if (Scope.isWatchable(attrInput))
      {
        let first = true;

        scope.watch(attrInput, (v) =>
        {
          localScope.set(attr, v, true);

          if (first && attrObject.initial)
          {
            attrObject.initial(v, component);
          }
          else if (!first && attrObject.changed)
          {
            attrObject.changed(v, component);
          }
          if (attrObject.update)
          {
            attrObject.update(v, component);
          }

          if (!first && componentBase.updated)
          {
            componentBase.updated(component);
          }
          
          first = false;
        });
      }
      else
      {
        localScope.set(attr, attrInput, true);
      }
    }
  }

  if (componentBase.state)
  {
    for (const stateName in componentBase.state)
    {
      const stateValue = componentBase.state[stateName];

      localScope.set(stateName, localScope.eval(stateValue)(), true);
    }
  }

  if (componentBase.computed)
  {
    for (const computedName in componentBase.computed)
    {
      const computedValue = componentBase.computed[computedName];

      localScope.watch(computedValue, (value) => 
      {
        localScope.set(computedName, value, true);
      });
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
        const listener = scope.eval(eventValue);

        component.on(ev, listener);
      }
    }
  }

  const rendered = componentBase.render(component);
  const instance = compile(rendered, component, localScope, parent);

  component.node = instance;

  if (componentBase.created) 
  {
    componentBase.created(component);
  }

  if (addRef && parentComponent)
  {
    parentComponent.scope.observed.refs[addRef] = localScope.observed;
  }
  
  return instance;
};