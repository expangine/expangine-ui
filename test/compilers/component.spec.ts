
import { mount, addComponent } from '../../src';
import { expectHTML, increment } from '../helper';
import { Exprs, Types, AnyOps, TextOps } from 'expangine-runtime';


describe('component compiler', () => 
{

  // test/button
  addComponent<{ content: string, name?: string, type?: string }, { click: void }>({ 
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
      click: Types.null(),
    },
    render: (c) => ['button', {
      name: Exprs.get('name'),
      type: Exprs.get('type'),
    }, { 
      click: () => c.trigger('click', null),
    }, [
      [':slot', {}, {}, [
        Exprs.get('content'),
      ]],
    ]],
  });

  it('simple button', () =>
  {
    const d = { text: 'Action' };
    const i = mount(d, ['test/button', { content: Exprs.get('text'), type: 'submit' }]);

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
    const i = mount(d, ['test/button', { type: 'submit' }, {}, {
      default: ['Complete']
    }]);

    expectHTML(i, [
      '<button type="submit">Complete</button>',
    ]);
  });

  it('simple button overwrite default slot reactive', () =>
  {
    const d = { text: 'Action' };
    const i = mount(d, ['test/button', {}, {}, {
      default: [Exprs.get('text')]
    }]);

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
    const i = mount(d, ['test/button', {}, { click: increment(['clicks']) }, {
      default: [Exprs.template('Clicks ({clicks})', {
        clicks: Exprs.get('clicks'),
      })],
    }]);

    expectHTML(i, [
      '<button>Clicks (0)</button>',
    ]);

    (i.node.element[0] as HTMLElement).click();

    expect(i.scope.observed.clicks).toBe(1);

    expectHTML(i, [
      '<button>Clicks (1)</button>',
    ]);
  });

  // test/list
  addComponent<{ items: any[] }>({ 
    name: 'list',
    collection: 'test',
    attributes: {
      items: Types.list(Types.any()),
    },
    render: () => ['ol', {}, {}, [
      [':for', { items: Exprs.get('items'), key: Exprs.get('index') }, {}, [
        ['li', {}, {}, [
          [':slot', { name: 'item', scope: { item: Exprs.get('item'), index: Exprs.get('index') } }]
        ]]
      ]],
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
    const i = mount(d, ['test/list', { items: Exprs.get('todos') }, {}, {
      item: [Exprs.template('({done}) {name}', {
        name: Exprs.get('item', 'name'),
        done: Exprs.op(AnyOps.ternary, {
          condition: Exprs.get('item', 'done'),
          truthy: Exprs.const('x'),
          falsy: Exprs.const(' '),
        }),
      })],
    }]);

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
  addComponent<never, never, never, { count: number }>({ 
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
    const i = mount({}, ['test/state-static', { ref: 'd' }]);

    expectHTML(i, [
      `<div>0</div>`,
    ]);

    expect(i.scope.observed.refs.d).toBeDefined();
    expect(i.scope.observed.refs.d.count).toBe(0);

    (i.node.element[0] as HTMLElement).click();

    expectHTML(i, [
      `<div>1</div>`,
    ]);

    expect(i.scope.observed.refs.d.count).toBe(1);
  });

  // test/state-dynamic
  addComponent<{ text: string }, never, never, { upper: number }>({ 
    name: 'state-dynamic',
    collection: 'test',
    attributes: {
      text: Types.text(),
    },
    state: {
      upper: Exprs.op(TextOps.upper, { value: Exprs.get('text') })
    },
    render: (c) => ['div', {}, {}, [
      Exprs.get('upper'),
    ]],
  });

  it('button with dynamic state', () =>
  {
    const i = mount({ content: 'Hello' }, ['test/state-dynamic', { ref: 'd', text: Exprs.get('content') }]);

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



});
