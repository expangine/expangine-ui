import { Type, isObject } from 'expangine-runtime';
import { ComponentSlot } from '../Component';
import { NodeCompiler, NodeInstance, getSlots, createChildNodes } from '../Node';
import { DEFAULT_SLOT } from '../constants';
import { Scope } from '../Scope';


export const COMPILER_SLOT_COMMENT = 'slot';

export const COMPILER_SLOT_DEFAULT_SLOT_INDEX = 'slotIndex';


export const CompilerSlot: NodeCompiler = (template, component, scope, parent) => 
{
  const [, attrs, , childSlots] = template;
  const element = [document.createComment(COMPILER_SLOT_COMMENT)];
  const instance: NodeInstance = { parent, component, scope, elements: element };

  if (attrs)
  {
    const slotName = attrs.name || DEFAULT_SLOT;
    const slotIndex = attrs.slotIndex 
      ? scope.evalNow(attrs.slotIndex) || 0
      : 0;
    const componentSlots = getSlots(component.slots, slotName, slotIndex);
    const slotOverride = componentSlots.length > 0;
    const slots = slotOverride
      ? componentSlots
      : getSlots(childSlots, slotName, slotIndex);
    const slotScope = slotOverride
      ? component.outerScope.createChild()
      : scope.createChild();

    if (attrs.slotIndex)
    {
      const slotOptions = component.getSlotOptions(slotName);
      const slotIndexName = slotOptions
        ? slotOptions.arrayIndexAlias || COMPILER_SLOT_DEFAULT_SLOT_INDEX
        : COMPILER_SLOT_DEFAULT_SLOT_INDEX;

      slotScope.set(slotIndexName, slotIndex);
    }
    
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

export function isComponentSlot<A>(x: any): x is ComponentSlot<A>
{
  return isObject(x) && x.scope instanceof Type;
}