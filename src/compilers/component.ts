import { isObject, isFunction } from 'expangine-runtime';
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
      const options = component.getAttributeOptions(attr);

      if (!options || options.callable)
      {
        continue;
      }

      const attrInput = attrs && attr in attrs 
        ? attrs[attr] 
        : isFunction(options.default)
          ? options.default(component)
          : options.default;

      if (Scope.isWatchable(attrInput))
      {
        let first = true;

        scope.watch(attrInput, (v) =>
        {
          localScope.set(attr, v, true);

          if (first && options.initial)
          {
            options.initial(v, component);
          }
          else if (!first && options.changed)
          {
            options.changed(v, component);
          }
          if (options.update)
          {
            options.update(v, component);
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
      const stateProvider = componentBase.state[stateName];
      const stateValue = isFunction(stateProvider)
        ? stateProvider(component)
        : stateProvider;

      localScope.set(stateName, localScope.evalNow(stateValue), true);
    }
  }

  if (componentBase.computed)
  {
    for (const computedName in componentBase.computed)
    {
      const computedProvider = componentBase.computed[computedName];
      const computedValue = isFunction(computedProvider)
        ? computedProvider(component)
        : computedProvider;

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
        const eventTypeInput = componentBase.events[ev];
        const eventType = isFunction(eventTypeInput)
          ? eventTypeInput({})
          : eventTypeInput;

        const props = Object.keys(eventType.options.props);
        const listener = scope.eval(eventValue, props);

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