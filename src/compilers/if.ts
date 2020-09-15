import { NodeCompiler, NodeInstance, getSlots, changeElement, createChildNodes } from '../Node';


export const CompilerIf: NodeCompiler = (template, component, scope, parent) => 
{
  const [, attrs, , childSlots] = template;
  const placeholder = [document.createComment('if')];
  const element: Node[] = placeholder.slice();
  const instance: NodeInstance = { parent, component, scope, element };
  const childScope = scope.createChild();
  const childTemplate = getSlots(childSlots);

  if (attrs && attrs.condition && childTemplate) 
  {
    const controller = createChildNodes(childTemplate, scope, component, childScope, instance);

    let visible = false;

    scope.watch(attrs.condition, (newVisible) => 
    {
      const visibleBoolean = !!newVisible;

      if (visible !== visibleBoolean)
      {
        visible = visibleBoolean;
        
        const desired = visible ? controller.element : placeholder;

        changeElement(instance, desired);

        childScope.setEnabled(visible);
      }
    });
  }
  else
  {
    throw new Error(`The :if directive requires a condition attribute and a single child.`);
  }

  return instance;
};