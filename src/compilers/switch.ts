import { Exprs, AnyOps, defs } from 'expangine-runtime';
import { NodeCompiler, NodeInstance, changeElements, createChildNodes, getSlots, NodeChildrenController, isStyleElement } from '../Node';
import { DEFAULT_SLOT } from '../constants';


export type HideAction = 'hide' | 'detach' | 'destroy';

export const CompilerSwitch: NodeCompiler = (template, component, scope, parent) => 
{
  const [tag, attrs, , childSlots] = template;
  const directiveName = (tag as string).substring(1);
  const placeholder = [document.createComment(directiveName)];
  const elements: Node[] = placeholder.slice();
  const instance: NodeInstance = { parent, component, scope, elements };
  const childScope = scope.createChild();
  
  if (attrs && attrs.cases && attrs.value)
  {
    const mode: HideAction = attrs.mode || 'detach';
    const value = defs.getExpression(attrs.value);

    const expr = Exprs.switch(value, attrs.isEqual || AnyOps.isEqual);
    for (const caseName in attrs.cases) {
      expr.case(attrs.cases[caseName]).than(caseName);
    }
    expr.default(DEFAULT_SLOT);

    let lastVisibleSlot: string;
    let lastController: NodeChildrenController;

    scope.watch(expr, (slotName) =>
    {
      const nextTemplate = getSlots(childSlots, slotName);

      if (nextTemplate.length === 0)
      {
        childScope.setEnabled(false);

        switch (mode)
        {
          case 'detach':
            changeElements(instance.elements, placeholder);
            break;

          case 'destroy':
            if (lastController) 
            {
              lastController.destroy();
              lastController = undefined;
            }

            changeElements(instance.elements, placeholder);
            break;

          case 'hide':
            if (lastController) 
            {
              const hideElements = instance.elements.slice();

              for (let i = 0; i < hideElements.length; i++) 
              {
                const hide = hideElements[i];

                if (isStyleElement(hide)) 
                {
                  hide.style.display = 'none';
                } 
                else 
                {
                  hideElements[i] = document.createComment('');
                }
              }

              changeElements(instance.elements, hideElements);
            }
            break;
        }
      }
      else
      {
        if (slotName !== lastVisibleSlot || mode === 'destroy')
        {
          if (lastController)
          {
            lastController.destroy();
            lastController = undefined;
          }

          const nextController = createChildNodes(nextTemplate, childScope, component, instance, true);

          changeElements(instance.elements, nextController.elements);

          lastController = nextController;
          lastVisibleSlot = slotName;
        }
        else if (mode === 'detach')
        {
          changeElements(instance.elements, lastController.elements);
        }
        else
        {
          const showElements = instance.elements.slice();

          for (let i = 0; i < showElements.length; i++) 
          {
            const show = showElements[i];

            if (isStyleElement(show)) 
            {
              show.style.display = '';
            } 
            else 
            {
              showElements[i] = lastController.elements[i];
            }
          }

          changeElements(instance.elements, showElements);
        }

        childScope.setEnabled(true);
      }

    }, true, true);
  }
  else
  {
    throw new Error(`The ${tag} directive requires a cases and value attribute.`);
  }

  return instance;
};