
import { mount, createIf, addComponent, createSlot, createComponent } from '../src';
import { expectHTML } from './helper';
import { Exprs, ListOps, NumberOps, Types } from 'expangine-runtime';


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
          createIf(Exprs.op(ListOps.contains, {
            list: Exprs.get('statuses'),
            item: Exprs.get('item', 'status'),
            isEqual: Exprs.op(NumberOps.isEqual, {
              value: Exprs.get('value'),
              test: Exprs.get('test'),
            }),
          }), [
            Exprs.get('item', 'label'),
          ])
        ]],
      ]]
    ]]);

    expectHTML(i, [
      `<div>
        <div class="item">A</div>
        <div class="item">B</div>
        <div class="item">C</div>
        <div class="item">D</div>
      </div>`
    ]);

    i.scope.observed.statuses = [0];

    expectHTML(i, [
      `<div>
        <div class="item">A</div>
        <div class="item"><!--if--></div>
        <div class="item">C</div>
        <div class="item"><!--if--></div>
      </div>`
    ]);

    i.scope.observed.statuses = [1];

    expectHTML(i, [
      `<div>
        <div class="item"><!--if--></div>
        <div class="item">B</div>
        <div class="item"><!--if--></div>
        <div class="item"><!--if--></div>
      </div>`
    ]);
  });


  const TestEmit = addComponent<never, { click: void }>({
    collection: 'test',
    name: 'emit',
    events: {
      click: Types.object(),
    },
    render: (c) =>
      ['div', {}, { click: () => c.trigger('click', null)}, [
        createSlot(),
      ]],
  })

  it('emit', () =>
  {
    const d = {
      emitted: false,
    };
    const i = mount(d, createComponent(TestEmit, {}, { click: Exprs.get('emitted').set(Exprs.true()) }, {
      default: ['Hello']
    }));

    const button = i.node.elements[0] as HTMLElement;

    expectHTML(i, [
      `<div>Hello</div>`
    ]);

    expect(i.scope.observed.emitted).toBeFalsy();

    button.click();

    expect(i.scope.observed.emitted).toBeTruthy();
  });

});
