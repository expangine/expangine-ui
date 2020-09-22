import { Type, isObject, Exprs } from 'expangine-runtime';
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
  const localScope = new Scope<any>(null, { this: component, emit: {} });

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
    const localState = localScope.eval(componentBase.state)();

    if (isObject(localState)) 
    {
      for (const stateName in localState)
      {
        localScope.set(stateName, localState[stateName], true);
      }
    }
  }

  if (isObject(events) && componentBase.events && component.parent?.scope) 
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
        const listener = component.parent.scope.eval(eventValue);

        localScope.watch(
          Exprs.get('emit', ev),
          listener,
          false
        );
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

  if (componentBase.ref && parentComponent)
  {
    if (!parentComponent.scope.has('refs', true))
    {
      parentComponent.scope.set('refs', {}, true)
    }

    parentComponent.scope.get('refs')[componentBase.ref] = component;
  }
  
  return instance;
};