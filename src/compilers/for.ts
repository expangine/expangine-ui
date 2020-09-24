import { NodeCompiler, NodeInstance, NodeChildrenController, getSlots, createChildNodes, changeElements } from '../Node';
import { Exprs, isArray, isSet, isMap, isObject } from 'expangine-runtime';


export const CompilerFor: NodeCompiler = (template, component, scope, parent) => 
{
  const [, attrs, , childSlots] = template;
  const placeholder = document.createComment('for');
  const element = [placeholder];
  const instance: NodeInstance = { parent, component, scope, elements: element };
  const itemTemplate = getSlots(childSlots);

  if (attrs && attrs.items)
  {
    const propItem = attrs.item || 'item';
    const propIndex = attrs.index || 'index';
    const propKey = attrs.key || Exprs.get(propIndex);

    const key = scope.eval(propKey);
    const map = new Map<any, NodeChildrenController>();

    scope.watch(attrs.items, (items) =>
    {
      const newChildren: Node[] = [placeholder];
      const keys = new Set();

      iterateCollection(items, (item, itemIndex) =>
      {
        const itemScopeData = { [propItem]: item, [propIndex]: itemIndex };
        const itemKey = key({ ...itemScopeData });
        let itemController = map.get(itemKey);

        if (!itemController)
        {
          const itemScope = scope.createChild(itemScopeData);

          itemController = createChildNodes(itemTemplate, itemScope, component, instance);

          map.set(itemKey, itemController);
        }
        else
        {
          itemController.updateScopes(itemScopeData);
        }

        keys.add(itemKey);
        newChildren.push(...itemController.elements);
      });

      changeElements(instance.elements, newChildren);

      map.forEach((itemController, itemIndex) => 
      {
        if (!keys.has(itemIndex)) 
        {
          itemController.destroy();

          map.delete(itemIndex);
        }
      });
    });
  }

  return instance;
};

function iterateCollection(collection: any, callback: (item: any, index: any) => void)
{
  if (isArray(collection))
  {
    for (let index = 0; index < collection.length; index++)
    {
      callback(collection[index], index);
    }
  }
  else if (isSet(collection))
  {
    let index = 0;

    for (const item of collection)
    {
      callback(item, index++);
    }
  }
  else if (isMap(collection))
  {
    for (const [key, value] of collection.entries())
    {
      callback(value, key);
    }
  }
  else if (isObject(collection))
  {
    for (const key in collection)
    {
      callback(collection[key], collection);
    }
  }
}