import { NodeCompiler, NodeInstance, NodeChildrenController, getSlots, createChildNodes, changeElements } from '../Node';


export const CompilerFor: NodeCompiler = (template, component, scope, parent) => 
{
  const [, attrs, , childSlots] = template;
  const placeholder = document.createComment('for');
  const element = [placeholder];
  const instance: NodeInstance = { parent, component, scope, element };
  const itemTemplate = getSlots(childSlots);

  if (attrs && attrs.items && parent)
  {
    const propItem = attrs.item || 'item';
    const propIndex = attrs.index || 'index';
    const key = scope.eval(attrs.key);
    const map = new Map<any, NodeChildrenController>();

    scope.watch(attrs.items, (items) =>
    {
      const newChildren: Node[] = [placeholder];
      const keys = new Set();

      for (let itemIndex = 0; itemIndex < items.length; itemIndex++)
      {
        const item = items[itemIndex];
        const itemKey = key({ [propItem]: item, [propIndex]: itemIndex });
        let itemController = map.get(itemKey);

        if (!itemController)
        {
          const itemScope = scope.createChild({ [propItem]: item, [propIndex]: itemIndex });

          itemController = createChildNodes(itemTemplate, itemScope, component, instance);

          map.set(itemKey, itemController);
        }
        else
        {
          itemController.updateScopes({ [propItem]: item, [propIndex]: itemIndex });
        }

        keys.add(itemKey);
        newChildren.push(...itemController.element);
      }

      changeElements(instance.element, newChildren);

      map.forEach((entryValue, entryKey) => 
      {
        if (!keys.has(entryKey)) 
        {
          entryValue.destroyScopes();

          map.delete(entryKey);
        }
      });
    });
  }

  return instance;
};