import { NodeCompiler, NodeInstance, getSlots, createChildNodes } from '../Node';
import { DEFAULT_SLOT } from '../constants';
import { Scope } from '../Scope';


export const COMPILER_SLOT_COMMENT = 'slot';

export const CompilerSlot: NodeCompiler = (template, component, scope, parent) => 
{
  const [, attrs, , childSlots] = template;
  const element = [document.createComment(COMPILER_SLOT_COMMENT)];
  const instance: NodeInstance = { parent, component, scope, elements: element };

  if (attrs)
  {
    const slotName = attrs.name || DEFAULT_SLOT;
    const componentSlots = getSlots(component.slots, slotName);
    const slotOverride = componentSlots.length > 0;
    const slots = slotOverride
      ? componentSlots
      : getSlots(childSlots, slotName);
    const slotScope = slotOverride
      ? component.outerScope.createChild()
      : scope.createChild();
    
    if (attrs.scope)
    {
      for (const scopeKey in attrs.scope)
      {
        const scopeValue = attrs.scope[scopeKey];

        if (Scope.isWatchable(scopeValue))
        {
          scope.watch(scopeValue, (value) =>
          {
            slotScope.set(scopeKey, value, true);
          });
        }
        else
        {
          slotScope.set(scopeKey, scopeValue, true);
        }
      }
    }

    if (slots)
    {
      const controller = createChildNodes(slots, slotScope, component, instance);

      instance.elements = controller.elements;
    }
  }

  return instance;
};