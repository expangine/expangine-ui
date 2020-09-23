
import { mount, addComponent } from '../../src';
import { expectHTML } from '../helper';
import { Exprs, Types } from 'expangine-runtime';


describe('dynamic compiler', () => 
{

  it('simple tag', () =>
  {
    const d = { tag: 'div' };
    const i = mount(d, [Exprs.get('tag'), {}, {}, ['Hello World']]);

    expectHTML(i, [
      '<div>Hello World</div>'
    ]);

    i.scope.set('tag', 'span');

    expectHTML(i, [
      '<span>Hello World</span>'
    ]);
  });

  addComponent<{ text: string }>({
    collection: 'dynamic',
    name: '1',
    attributes: {
      text: Types.text(),
    },
    render: () => ['div', {}, {}, [Exprs.get('text')]],
  });

  addComponent<{ text: string }>({
    collection: 'dynamic',
    name: '2',
    attributes: {
      text: Types.text(),
    },
    render: () => ['span', {}, {}, [Exprs.get('text')]],
  });

  it('component tag', () =>
  {
    const d = { tag: 'dynamic/1', content: 'Hello' };
    const i = mount(d, [Exprs.get('tag'), { text: Exprs.get('content') }]);

    expectHTML(i, [
      '<div>Hello</div>'
    ]);

    i.scope.set('tag', 'dynamic/2');

    expectHTML(i, [
      '<span>Hello</span>'
    ]);

    i.scope.set('tag', 'dynamic/1');

    expectHTML(i, [
      '<div>Hello</div>'
    ]);

    i.scope.set('content', 'World');

    expectHTML(i, [
      '<div>World</div>'
    ]);
  });

});
