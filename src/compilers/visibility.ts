import { DIRECTIVE_SHOW } from '../constants';
import { NodeCompiler, NodeInstance, getSlots, isStyleElement, createChildNodes } from '../Node';



export const CompilerVisibility: NodeCompiler = (template, component, scope, parent) => 
{
  const [tag, attrs, , childSlots] = template;
  const show = tag === DIRECTIVE_SHOW;
  const comment = (tag as string).substring(1);
  const instance: NodeInstance = { parent, component, scope, element: [] };
  const childScope = scope.createChild();
  const childTemplate = getSlots(childSlots);
  
  if (attrs && attrs.condition && childTemplate) 
  {   
    const controller = createChildNodes(childTemplate, childScope, component, instance);
    const placeholders = controller.element.map((e) => document.createComment(comment));
    
    instance.element = controller.element.slice();

    let visible: boolean | undefined;

    scope.watch(attrs.condition, (newVisible) => 
    {
      const visibleBoolean = !!newVisible;

      if (visible !== visibleBoolean)
      {
        visible = visibleBoolean;

        const isVisible = (visible === show);

        for (let i = 0; i < instance.element.length; i++)
        { 
          const given = controller.element[i];
          const next = isVisible ? given : placeholders[i];
          const prev = instance.element[i];

          if (isStyleElement(given))
          {
            given.style.display = isVisible ? '' : 'none';
          }
          else if (next !== prev)
          {
            if (prev.parentElement)
            {
              prev.parentElement.replaceChild(next, prev);
            }
            
            instance.element[i] = next;
          }
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