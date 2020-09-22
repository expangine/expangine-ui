
import { mount } from '../../src';
import { expectHTML } from '../helper';
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

    i.scope.observed.items[0] = 'aaa';

    expectHTML(i, [
      '<div><!--for--> (0: aaa) (1: c) (2: d)</div>'
    ]);

    i.scope.observed.items = ['b', 'a', 'd'];

    expectHTML(i, [
      '<div><!--for--> (0: b) (1: a) (2: d)</div>'
    ]);

    i.scope.observed.items.splice(0, 3, 'e', 'f', 'g');

    expectHTML(i, [
      '<div><!--for--> (0: e) (1: f) (2: g)</div>'
    ]);
  });

});
