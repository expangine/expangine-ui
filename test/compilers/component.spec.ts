
import { mount, addComponent } from '../../src';
import { expectHTML } from '../helper';
import { Exprs, Types, AnyOps } from 'expangine-runtime';


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
    render: () => ['button', {
      name: Exprs.get('name'),
      type: Exprs.get('type'),
    }, { 
      click: Exprs.set(Exprs.get(), 'emit', 'click').to(Exprs.const(null)) ,
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

});
