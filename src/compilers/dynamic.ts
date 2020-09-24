import { NodeCompiler, NodeInstance, changeElements } from '../Node';
import { compile } from '../compile';
import { Scope } from '../Scope';


export const CompilerDynamic: NodeCompiler = (template, component, scope, parent) =>
{
  const [tag] = template;
  const instance: NodeInstance = { parent, component, scope, elements: [document.createComment('dynamic')] };
  let lastScope: Scope;

  scope.watch(tag, (tagValue: any) =>
  {
    template[0] = tagValue;

    if (lastScope)
    {
      lastScope.destroy();
    }

    lastScope = scope.createChild();

    const dynamicInstance = compile(template, component, lastScope, parent);

    changeElements(instance.elements, dynamicInstance.elements);

  }, true, true);

  return instance;
};