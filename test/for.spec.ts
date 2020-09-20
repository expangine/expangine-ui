
import { mount } from '../src';
import { expectHTML } from './helper';
import { Exprs } from 'expangine-runtime';


describe('for compiler', () => 
{

  it('simple items text', () =>
  {
    const d = { items: [ 'a', 'b', 'c' ] };
    const i = mount(d, ['div', {}, {}, [
      [':for', { 
        items: Exprs.get('items'), 
        key: Exprs.get('item')
      }, {}, [
        Exprs.template(' ({index}: {item})', {
          index: Exprs.get('index'),
          item: Exprs.get('item'),
        }),
      ]]
    ]]);

    expectHTML(i, [
      '<div><!--for--> (0: a) (1: b) (2: c)</div>'
    ]);

    i.scope.observed.items.push('d');

    expectHTML(i, [
      '<div><!--for--> (0: a) (1: b) (2: c) (3: d)</div>'
    ]);

    i.scope.observed.items.splice(1, 1);

    expectHTML(i, [
      '<div><!--for--> (0: a) (1: c) (2: d)</div>'
    ]);
  });

});
