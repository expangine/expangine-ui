
import { mount } from '../../src';
import { expectHTML } from '../helper';
import { Exprs } from 'expangine-runtime';


describe('if compiler', () => 
{

  it('single text node', () =>
  {
    const d = { visible: false };
    const i = mount(d, [':if', { condition: Exprs.get('visible') }, {}, ['Hello World']]);

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      'Hello World'
    ]);
  });

  it('multiple text node', () =>
  {
    const d = { visible: false };
    const i = mount(d, [':if', { condition: Exprs.get('visible') }, {}, ['Hello', 'World']]);

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
    const i = mount(d, [':if', { condition: Exprs.get('visible') }, {}, []]);

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, []);
  });

  it('expression node', () =>
  {
    const d = { visible: false, content: 'Howdy' };
    const i = mount(d, [':if', { condition: Exprs.get('visible') }, {}, [
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
    const i = mount(d, [':if', { condition: Exprs.get('visible') }, {}, [
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

});
