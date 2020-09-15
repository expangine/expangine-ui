
import { mount } from '../src';
import { expectHTML, increment } from './helper';
import { Exprs } from 'expangine-runtime';


describe('default compiler', () => 
{

  it('single text node', () =>
  {
    const d = {};
    const i = mount(d, ['div', {}, {}, ['Hello World']]);

    expectHTML(i, [
      '<div>Hello World</div>'
    ]);
  });

  it('multiple text node', () =>
  {
    const d = {};
    const i = mount(d, ['div', {}, {}, ['Hello', 'World']]);

    expectHTML(i, [
      '<div>HelloWorld</div>'
    ]);
  });

  it('empty node', () =>
  {
    const d = {};
    const i = mount(d, ['div', {}, {}, []]);

    expectHTML(i, [
      '<div></div>'
    ]);
  });

  it('expression node', () =>
  {
    const d = { content: 'Howdy' };
    const i = mount(d, ['div', {}, {}, [
      Exprs.get('content'),
    ]]);

    expectHTML(i, [
      '<div>Howdy</div>'
    ]);
  });

  it('attributes static', () =>
  {
    const d = {};
    const i = mount(d, ['div', { class: 'btn' }, {}, ['Hello World']]);

    expectHTML(i, [
      '<div class="btn">Hello World</div>'
    ]);
  });

  it('attributes dynamic', () =>
  {
    const d = { title: 'Greetings' };
    const i = mount(d, ['div', { title: Exprs.get('title') }, {}, ['A']]);

    expectHTML(i, [
      '<div title="Greetings">A</div>'
    ]);

    i.scope.set('title', 'Earthling');

    expectHTML(i, [
      '<div title="Earthling">A</div>'
    ]);
  });

  it('nested', () =>
  {
    const d = {};
    const i = mount(d, ['div', {}, {}, [
      ['span', {}, {}, [['p']]],
      ['b']
    ]]);

    expectHTML(i, [
      '<div><span><p></p></span><b></b></div>'
    ]);
  });

  it('events', () =>
  {
    const d = { count: 0 };
    const i = mount(d, ['button', {}, { 
      click: increment(['count']),
    }, [
      Exprs.template('Clicked {count} times', {
        count: Exprs.get('count'),
      }),
    ]]);
    const button = i.node.element[0] as HTMLElement;

    expectHTML(i, [
      '<button>Clicked 0 times</button>'
    ]);

    button.click();

    expectHTML(i, [
      '<button>Clicked 1 times</button>'
    ]);

    button.click();

    expectHTML(i, [
      '<button>Clicked 2 times</button>'
    ]);
  });

});
