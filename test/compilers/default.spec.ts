
import { mount } from '../../src';
import { expectHTML, increment } from '../helper';
import { Exprs } from 'expangine-runtime';

// tslint:disable: no-magic-numbers

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
    const button = i.node.elements[0] as HTMLElement;

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

  it('array and object attributes', () =>
  {
    const d = { flag: false, pixels: 1 };
    const i = mount(d, ['div', { 
      class: Exprs.tuple(
        'static',
        Exprs.if(Exprs.get('flag')).than(Exprs.const('flag')).else(Exprs.const('no-flag')),
        Exprs.object({
          'obj-flag': Exprs.get('flag'),
          'obj-static': Exprs.const(true),
          'obj-hidden': Exprs.const(false),
        }),
      ),
      style: Exprs.object({
        display: 'none',
        border: Exprs.tuple(
          Exprs.template('{pixels}px', { pixels: Exprs.get('pixels') }),
          'solid',
          'black'
        ),
      })
    }, {}, []]);

    expectHTML(i, [
      '<div class="static no-flag obj-static" style="display: none; border: 1px solid black"></div>'
    ]);

    i.scope.set('flag', true);

    expectHTML(i, [
      '<div class="static flag obj-flag obj-static" style="display: none; border: 1px solid black"></div>'
    ]);

    i.scope.set('pixels', 3);

    expectHTML(i, [
      '<div class="static flag obj-flag obj-static" style="display: none; border: 3px solid black"></div>'
    ]);
  });

});
