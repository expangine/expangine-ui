
import { mount, addComponent, createSlot, createComponent, createFor } from '../../src';
import { expectHTML, increment } from '../helper';
import { Exprs, Types, AnyOps, TextOps } from 'expangine-runtime';

// tslint:disable: no-magic-numbers

describe('component compiler', () => 
{

  // test/button
  const TestButton = addComponent<{ content: string, name?: string, type?: string }, { click: void }>({ 
    name: 'button',
    collection: 'test',
    attributes: {
      content: Types.text(),
      name: {
        type: Types.text(),
        default: Exprs.const(''),
      },
      type: {
        type: Types.text(),
        default: Exprs.const(''),
      },
    },
    events: {
      click: Types.object(),
    },
    render: (c) => ['button', {
      name: Exprs.get('name'),
      type: Exprs.get('type'),
    }, { 
      click: () => c.trigger('click', null),
    }, [
      createSlot({}, [
        Exprs.get('content')
      ]),
    ]],
  });

  it('simple button', () =>
  {
    const d = { text: 'Action' };
    const i = mount(d, createComponent(TestButton, {
      content: Exprs.get('text'), 
      type: 'submit',
    }));

    expectHTML(i, [
      '<button type="submit">Action</button>',
    ]);

    i.scope.set('text', 'Another Action');

    expectHTML(i, [
      '<button type="submit">Another Action</button>',
    ]);
  });

  it('simple button overwrite default slot static', () =>
  {
    const d = {};
    const i = mount(d, createComponent(TestButton, { type: 'submit' }, {}, {
      default: ['Complete'],
    }));

    expectHTML(i, [
      '<button type="submit">Complete</button>',
    ]);
  });

  it('simple button overwrite default slot reactive', () =>
  {
    const d = { text: 'Action' };
    const i = mount(d, createComponent(TestButton, {}, {}, {
      default: [Exprs.get('text')]
    }));

    expectHTML(i, [
      '<button>Action</button>',
    ]);

    i.scope.set('text', 'Changed Action');

    expectHTML(i, [
      '<button>Changed Action</button>',
    ]);
  });

  it('simple button emit event', () =>
  {
    const d = { text: 'Action', clicks: 0 };
    const i = mount(d, createComponent(TestButton, {}, { click: increment(['clicks']) }, {
      default: [Exprs.template('Clicks ({clicks})', {
        clicks: Exprs.get('clicks'),
      })],
    }));

    expectHTML(i, [
      '<button>Clicks (0)</button>',
    ]);

    (i.node.elements[0] as HTMLElement).click();

    expect(i.scope.observed.clicks).toBe(1);

    expectHTML(i, [
      '<button>Clicks (1)</button>',
    ]);
  });

  // test/list
  const TestList = addComponent<{ items: any[] }, never, 'item'>({ 
    name: 'list',
    collection: 'test',
    attributes: {
      items: Types.list(Types.any()),
    },
    slots: {
      item: Types.object({ item: Types.any(), index: Types.number() }),
    },
    render: () => ['ol', {}, {}, [
      createFor(Exprs.get('items'), [
        ['li', {}, {}, [
          createSlot({ name: 'item', scope: { item: Exprs.get('item'), index: Exprs.get('index') } })
        ]]
      ]),
    ]],
  });

  it('list with scope', () =>
  {
    const d = { 
      todos: [ 
        { done: true, name: 'A' }, 
        { done: false, name: 'B' } 
      ]
    };
    const i = mount(d, createComponent(TestList, { items: Exprs.get('todos') }, {}, {
      item: [Exprs.template('({done}) {name}', {
        name: Exprs.get('item', 'name'),
        done: Exprs.op(AnyOps.ternary, {
          condition: Exprs.get('item', 'done'),
          truthy: Exprs.const('x'),
          falsy: Exprs.const(' '),
        }),
      })],
    }));

    expectHTML(i, [
      `<ol>
        <!--for-->
        <li>(x) A</li>
        <li>( ) B</li>
      </ol>`,
    ]);

    i.scope.observed.todos.push(
      { done: false, name: 'C' }
    );

    expectHTML(i, [
      `<ol>
        <!--for-->
        <li>(x) A</li>
        <li>( ) B</li>
        <li>( ) C</li>
      </ol>`,
    ]);

    i.scope.observed.todos[1].done = true;

    expectHTML(i, [
      `<ol>
        <!--for-->
        <li>(x) A</li>
        <li>(x) B</li>
        <li>( ) C</li>
      </ol>`,
    ]);
  });

  // test/state-static
  const TestStateStatic = addComponent<never, never, never, { count: number }>({ 
    name: 'state-static',
    collection: 'test',
    state: {
      count: Exprs.const(0),
    },
    render: (c) => ['div', {}, { 
      click: increment(['count']),
    }, [
      Exprs.get('count'),
    ]],
  });

  it('button with static state', () =>
  {
    const i = mount({}, createComponent(TestStateStatic, { ref: 'd' }));

    expectHTML(i, [
      `<div>0</div>`,
    ]);

    expect(i.scope.observed.refs.d).toBeDefined();
    expect(i.scope.observed.refs.d.count).toBe(0);

    (i.node.elements[0] as HTMLElement).click();

    expectHTML(i, [
      `<div>1</div>`,
    ]);

    expect(i.scope.observed.refs.d.count).toBe(1);
  });

  // test/state-dynamic
  const TestStateDynamic = addComponent<{ text: string }, never, never, never, { upper: number }>({ 
    name: 'state-dynamic',
    collection: 'test',
    attributes: {
      text: Types.text(),
    },
    computed: {
      upper: Exprs.op(TextOps.upper, { value: Exprs.get('text') })
    },
    render: (c) => ['div', {}, {}, [
      Exprs.get('upper'),
    ]],
  });

  it('button with dynamic state', () =>
  {
    const i = mount({ content: 'Hello' }, createComponent(TestStateDynamic, { ref: 'd', text: Exprs.get('content') }));

    expectHTML(i, [
      `<div>HELLO</div>`,
    ]);

    expect(i.scope.observed.refs.d).toBeDefined();
    expect(i.scope.observed.refs.d.text).toBe('Hello');
    expect(i.scope.observed.refs.d.upper).toBe('HELLO');

    i.scope.set('content', 'World');

    expectHTML(i, [
      `<div>WORLD</div>`,
    ]);

    expect(i.scope.observed.refs.d.text).toBe('World');
    expect(i.scope.observed.refs.d.upper).toBe('WORLD');
  });

  // test/dropdown
  const TestDropdown = addComponent<{ options: string, value: string, label: string }>({ 
    name: 'dropdown',
    collection: 'test',
    attributes: {
      options: Types.list(Types.any()),
      value: {
        type: Types.text(),
        callable: Types.object({ option: Types.any() }),
        default: Exprs.get('option', 'value'),
      },
      label: {
        type: Types.text(),
        callable: Types.object({ option: Types.any() }),
        default: Exprs.get('option', 'label'),
      },
    },
    render: (c) => ['select', {}, {}, [
      createFor(Exprs.get('options'), [
        ['option', {
          value: c.call('value', { option: Exprs.get('item') }),
        }, {}, [
          c.call('label', { option: Exprs.get('item') }),
        ]],
      ]),
    ]],
  });

  it('callable arguments', () =>
  {
    const d = {
      answers: [
        { value: 0, text: 'Zero' },
        { value: 1, text: 'One' },
        { value: 2, text: 'Two' },
      ]
    };
    const i = mount(d, createComponent(TestDropdown, { 
      options: Exprs.get('answers'),
      label: Exprs.get('option', 'text'),
    }));

    expectHTML(i, [
      `<select>
        <!--for-->
        <option value="0">Zero</option>
        <option value="1">One</option>
        <option value="2">Two</option>
      </select>`,
    ]);

    i.scope.observed.answers[2].value = 3;

    expectHTML(i, [
      `<select>
        <!--for-->
        <option value="0">Zero</option>
        <option value="1">One</option>
        <option value="3">Two</option>
      </select>`,
    ]);
  });


});
