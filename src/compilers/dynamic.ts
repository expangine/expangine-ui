import { NodeCompiler, NodeInstance, changeElement } from '../Node';
import { compile } from '../compile';


export const CompilerDynamic: NodeCompiler = (template, component, scope, parent) =>
{
  const [tag] = template;
  const instance: NodeInstance = { parent, component, scope, element: [document.createComment('dynamic')] };
  let lastInstance: NodeInstance;

  scope.watch(tag, (tagValue: any) =>
  {
    template[0] = tagValue;

    if (lastInstance)
    {
      lastInstance.scope.destroy();
    }

    const dynamicInstance = compile(template, component, scope, parent);

    changeElement(instance, dynamicInstance.element);

    lastInstance = dynamicInstance;
  });

  return instance;
};