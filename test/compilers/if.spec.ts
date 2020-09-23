
import { mount, createIf, createIfs } from '../../src';
import { expectHTML } from '../helper';
import { Exprs, NumberOps } from 'expangine-runtime';


describe('if compiler', () => 
{

  it('single text node', () =>
  {
    const d = { visible: false };
    const i = mount(d, createIf(Exprs.get('visible'), ['Hello World']));

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
    const i = mount(d, createIf(Exprs.get('visible'), ['Hello', 'World']));

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
    const i = mount(d, createIf(Exprs.get('visible'), []));

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<!--if-->'
    ]);
  });

  it('expression node', () =>
  {
    const d = { visible: false, content: 'Howdy' };
    const i = mount(d, createIf(Exprs.get('visible'), [
      Exprs.get('content'),
    ]));

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
    const i = mount(d, createIf(Exprs.get('visible'), [
      ['span', {}, {}, [['p']]],
      ['b']
    ]));

    expectHTML(i, [
      '<!--if-->',
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<span><p></p></span>',
      '<b></b>',
    ]);
  });

  it('if else-if else', () =>
  {
    const d = { state: 0 };
    const i = mount(d, 
      createIfs([
        [
          Exprs.op(NumberOps.isEqual, { value: Exprs.get('state'), test: 0 }), 
          ['First']
        ],
        [
          Exprs.op(NumberOps.isEqual, { value: Exprs.get('state'), test: 1 }), 
          ['Second']
        ],
      ], 
      ['Third']
    ));

    expectHTML(i, [
      'First',
    ]);

    i.scope.set('state', 1);

    expectHTML(i, [
      'Second',
    ]);

    i.scope.set('state', 2);

    expectHTML(i, [
      'Third',
    ]);

    i.scope.set('state', 0);

    expectHTML(i, [
      'First',
    ]);
  });

});
