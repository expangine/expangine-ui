import { Exprs, AnyOps, defs } from 'expangine-runtime';
import { NodeCompiler, NodeInstance, changeElements, createChildNodes, getSlots, NodeChildrenController, isStyleElement } from '../Node';
import { DEFAULT_SLOT } from '../constants';


export type HideAction = 'hide' | 'detach' | 'destroy';

export const CompilerSwitch: NodeCompiler = (template, component, scope, parent) => 
{
  const [tag, attrs, , childSlots] = template;
  const directiveName = (tag as string).substring(1);
  const placeholder = [document.createComment(directiveName)];
  const element: Node[] = placeholder.slice();
  const instance: NodeInstance = { parent, component, scope, element };
  let childScope = scope.createChild();
  
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
    let lastController: NodeChildrenController | undefined = undefined;

    scope.watch(expr, (slotName) =>
    {
      const nextTemplate = getSlots(childSlots, slotName);

      if (nextTemplate.length === 0)
      {
        childScope.setEnabled(false);

        switch (mode)
        {
          case 'detach':
            changeElements(instance.element, placeholder);
            break;

          case 'destroy':
            if (lastController) 
            {
              childScope = scope.createChild();
              lastController.destroy();
              lastController = undefined;
            }

            changeElements(instance.element, placeholder);
            break;

          case 'hide':
            if (lastController) 
            {
              const hideElements = instance.element.slice();

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

              changeElements(instance.element, hideElements);
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
            childScope = scope.createChild();
            lastController.destroy();
            lastController = undefined;
          }

          const nextController = createChildNodes(nextTemplate, childScope, component, instance);

          changeElements(instance.element, nextController.element);

          lastController = nextController;
          lastVisibleSlot = slotName;
        }
        else if (mode === 'detach')
        {
          changeElements(instance.element, lastController.element);
        }
        else
        {
          const showElements = instance.element.slice();

          for (let i = 0; i < showElements.length; i++) 
          {
            const show = showElements[i];

            if (isStyleElement(show)) 
            {
              show.style.display = '';
            } 
            else 
            {
              showElements[i] = lastController.element[i];
            }
          }

          changeElements(instance.element, showElements);
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