import { isString } from 'expangine-runtime';
import { DIRECTIVE_SHOW } from '../constants';
import { NodeCompiler, NodeInstance, getSlots, changeElement, isStyleElement, createChildNodes } from '../Node';



export const CompilerVisibility: NodeCompiler = (template, component, scope, parent) => 
{
  const [tag, attrs, , childSlots] = template;
  const show = tag === DIRECTIVE_SHOW;
  const placeholder = [document.createComment((tag as string).substring(1))];
  const element: Node[] = placeholder.slice();
  const instance: NodeInstance = { parent, component, scope, element };
  const childScope = scope.createChild();
  const childTemplate = getSlots(childSlots);
  
  if (attrs && attrs.condition && childTemplate) 
  {   
    const controller = createChildNodes(childTemplate, scope, component, childScope, instance);
  
    let visible: boolean | undefined;

    scope.watch(attrs.condition, (newVisible) => 
    {
      const visibleBoolean = !!newVisible;

      if (visible !== visibleBoolean)
      {
        visible = visibleBoolean;

        const isVisible = (visible === show);

        if (isString(childTemplate))
        {
          const previous = instance.element;
          const desired = isVisible ? controller.element : placeholder;

          if (previous !== desired) 
          {
            changeElement(instance, desired);
          }
        }
        else if (isStyleElement(instance.element))
        {
          instance.element.style.display = isVisible ? '' : 'none';
        }

        childScope.setEnabled(isVisible);
      }           
    });
  }
  else
  {
    throw new Error(`The ${tag} directive requires a condition attribute and a singule child.`);
  }

  return instance;
};