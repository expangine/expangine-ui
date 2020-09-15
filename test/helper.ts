import { ComponentInstance } from '../src';
import { Exprs, NumberOps } from 'expangine-runtime';


export function expectHTML(instance: ComponentInstance<any, any, any>, html: string[])
{
  expect(instance.node.element.length).toBe(html.length);
  
  for (let i = 0; i < html.length; i++) 
  {
    const node = instance.node.element[i];

    if (node instanceof HTMLElement) {
      expect(node.outerHTML).toBe(html[i]);
    } else if (node instanceof Text) {
      expect(node.textContent).toBe(html[i]);
    } else if (node instanceof Comment) {
      expect(`<!--${node.textContent}-->`).toBe(html[i]);
    } else {
      expect(html[i]).toBeNull();
    }
  }
}

export function increment(path: string[], by: number = 1)
{
  return Exprs.set(Exprs.get(), ...path)
    .to(Exprs.op(NumberOps.add, {
      value: Exprs.get(...path),
      addend: Exprs.const(by),
    }))
  ;
}