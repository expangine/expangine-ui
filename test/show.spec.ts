
import { mount } from '../src';
import { expectHTML } from './helper';
import { Exprs } from 'expangine-runtime';


describe('if compiler', () => 
{

  it('single text node', () =>
  {
    const d = { visible: false };
    const i = mount(d, [':show', { condition: Exprs.get('visible') }, {}, [
      ['div', {}, {}, ['Hello World']],
    ]]);

    expectHTML(i, [
      '<div style="display: none;">Hello World</div>'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<div style="">Hello World</div>'
    ]);
  });

  it('single text node initially visible', () =>
  {
    const d = { visible: true };
    const i = mount(d, [':show', { condition: Exprs.get('visible') }, {}, [
      ['div', {}, {}, ['Hello World']],
    ]]);

    expectHTML(i, [
      '<div>Hello World</div>'
    ]);

    i.scope.set('visible', false);

    expectHTML(i, [
      '<div style="display: none;">Hello World</div>'
    ]);
  });
/*
  it('multiple text node', () =>
  {
    const d = { visible: false };
    const i = mount(d, [':show', { condition: Exprs.get('visible') }, {}, ['Hello', 'World']]);

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      'Hello',
      'World'
    ]);
  });

  it('empty node', () =>
  {
    const d = { visible: false };
    const i = mount(d, [':show', { condition: Exprs.get('visible') }, {}, []]);

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, []);
  });

  it('expression node', () =>
  {
    const d = { visible: false, content: 'Howdy' };
    const i = mount(d, [':show', { condition: Exprs.get('visible') }, {}, [
      Exprs.get('content'),
    ]]);

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      'Howdy'
    ]);

    i.scope.set('content', 'Partner');

    expectHTML(i, [
      'Partner'
    ]);
  });

  it('nested', () =>
  {
    const d = { visible: false };
    const i = mount(d, [':show', { condition: Exprs.get('visible') }, {}, [
      ['span', {}, {}, [['p']]],
      ['b']
    ]]);

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<span><p></p></span>',
      '<b></b>',
    ]);
  });
*/
});
