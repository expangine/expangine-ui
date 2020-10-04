
import { mount, addComponent, createSlot, createComponent, createFor } from '../../src';
import { Exprs, Types, NumberOps } from 'expangine-runtime';
import { expectHTML } from '../helper';

// tslint:disable: no-magic-numbers

describe('slot compiler', () => 
{

  // test/layout
  const TestLayout = addComponent<{ columns: number }>({ 
    name: 'layout',
    collection: 'test',
    attributes: {
      columns: Types.number(0, undefined, true),
    },
    render: (c) => ['div', { class: 'columns' }, {}, [
      createFor(Exprs.get('columns'), [
        ['div', { class: 'column' }, {}, [
          createSlot({ slotIndex: Exprs.get('index') }, []),
        ]],
      ]),
    ]],
  });

  it('simple layout', () =>
  {
    const d = { columns: 2 };
    const i = mount(d, createComponent(TestLayout, { columns: Exprs.get('columns') }, {}, {
      default: {
        0: [
          ['div', {}, {}, [
            Exprs.if(Exprs.op(NumberOps.isDivisible, {
              value: Exprs.get('columns'),
              by: 2
            })).than(Exprs.const('Even')).else(Exprs.const('Odd'))
          ]],
        ],
        1: [
          Exprs.get('columns'),
        ],
        2: [
          'Howdy!'
        ],
      }
    }));

    expectHTML(i, [
      `<div class="columns">
        <div class="column">
         <div>Even</div>
        </div>
        <div class="column">
         2
        </div>
      </div>`,
    ]);

    i.scope.set('columns', 3);

    expectHTML(i, [
      `<div class="columns">
        <div class="column">
         <div>Odd</div>
        </div>
        <div class="column">
         3
        </div>
        <div class="column">
         Howdy!
        </div>
      </div>`,
    ]);
  });

  // test/layout-computed
  const TestLayoutComputed = addComponent<{ columns: number }, never, 'default'>({ 
    name: 'layout-computed',
    collection: 'test',
    attributes: {
      columns: Types.number(0, undefined, true),
    },
    slots: {
      default: {
        scope: Types.object(),
        array: true,
        arrayLength: Exprs.op(NumberOps.mul, { value: Exprs.get('columns'), multiplier: 2 }),
      }
    },
    render: (c) => ['div', { class: 'columns' }, {}, [
      createFor(c.getSlotArrayLength(), [
        ['div', { class: 'column' }, {}, [
          createSlot({ slotIndex: Exprs.get('index') }, []),
        ]],
      ]),
    ]],
  });

  it('computed layout', () =>
  {
    const d = { columns: 1 };
    const i = mount(d, createComponent(TestLayoutComputed, { columns: Exprs.get('columns') }, {}, {
      default: {
        0: ['a'],
        1: ['b'],
        2: ['c'],
      }
    }));

    expectHTML(i, [
      `<div class="columns">
        <div class="column">a</div>
        <div class="column">b</div>
      </div>`,
    ]);

    i.scope.set('columns', 2);

    expectHTML(i, [
      `<div class="columns">
        <div class="column">a</div>
        <div class="column">b</div>
        <div class="column">c</div>
        <div class="column"></div>
      </div>`,
    ]);
  });

  // test/layout-dynamic
  const TestLayoutDyanmic = addComponent({ 
    name: 'layout-dynamic',
    collection: 'test',
    render: (c) => ['div', { class: 'columns' }, {}, [
      createFor(c.getSlotArrayLength(), [
        ['div', { class: 'column' }, {}, [
          createSlot({ slotIndex: Exprs.get('index') }, []),
        ]],
      ]),
    ]],
  });

  it('dynamic layout', () =>
  {
    const d = { columns: 1 };
    const i = mount(d, createComponent(TestLayoutDyanmic, {}, {}, {
      default: {
        0: ['a'],
        1: ['b'],
        3: ['d'],
      }
    }));

    expectHTML(i, [
      `<div class="columns">
        <div class="column">a</div>
        <div class="column">b</div>
        <div class="column"></div>
        <div class="column">d</div>
      </div>`,
    ]);
  });

});
