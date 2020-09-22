
import { mount } from '../src';
import { expectHTML } from './helper';
import { Exprs, ListOps, NumberOps } from 'expangine-runtime';


describe('complex', () => 
{

  it('if in for', () =>
  {
    const d = { 
      items: [
        { label: 'A', status: 0 },
        { label: 'B', status: 1 },
        { label: 'C', status: 0 },
        { label: 'D', status: 2 },
      ],
      statuses: [0, 1, 2],
    };
    const i = mount(d, ['div', {}, {}, [
      [':for', { 
        items: Exprs.get('items'), 
        key: Exprs.get('item', 'label')
      }, {}, [
        ['div', { class: 'item' }, {}, [
          [':if', { condition: Exprs.op(ListOps.contains, {
            list: Exprs.get('statuses'),
            item: Exprs.get('item', 'status'),
            isEqual: Exprs.op(NumberOps.isEqual, {
              value: Exprs.get('value'),
              test: Exprs.get('test'),
            }),
          })}, {}, [
            Exprs.get('item', 'label'),
          ]]
        ]],
      ]]
    ]]);

    expectHTML(i, [
      `<div>
        <!--for-->
        <div class="item">A</div>
        <div class="item">B</div>
        <div class="item">C</div>
        <div class="item">D</div>
      </div>`
    ]);

    i.scope.observed.statuses = [0];

    expectHTML(i, [
      `<div>
        <!--for-->
        <div class="item">A</div>
        <div class="item"><!--if--></div>
        <div class="item">C</div>
        <div class="item"><!--if--></div>
      </div>`
    ]);

    i.scope.observed.statuses = [1];

    expectHTML(i, [
      `<div>
        <!--for-->
        <div class="item"><!--if--></div>
        <div class="item">B</div>
        <div class="item"><!--if--></div>
        <div class="item"><!--if--></div>
      </div>`
    ]);
  });

});
