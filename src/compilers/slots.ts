import { NodeCompiler, NodeInstance, getSlots, createChildNodes } from '../Node';
import { DEFAULT_SLOT } from '../constants';
import { Scope } from '../Scope';


export const CompilerSlot: NodeCompiler = (template, component, scope, parent) => 
{
  const [, attrs, , childSlots] = template;
  const element = [document.createComment('slot')];
  const instance: NodeInstance = { parent, component, scope, element };

  if (attrs)
  {
    const slotName = attrs.name || DEFAULT_SLOT;
    const slotScope = scope.createChild();
    const slots = getSlots(component.slots, slotName) || getSlots(childSlots, slotName);
    
    if (attrs.scope)
    {
      for (const scopeKey in slotScope)
      {
        const scopeValue = slotScope[scopeKey];

        if (Scope.isWatchable(scopeValue))
        {
          scope.watch(scopeValue, (value) =>
          {
            slotScope.set(scopeKey, scopeValue);
          });
        }
        else
        {
          slotScope.set(scopeKey, scopeValue);
        }
      }
    }

    if (slots)
    {
      const controller = createChildNodes(slots, slotScope, component, instance);

      instance.element = controller.element;
    }
  }

  return instance;
};