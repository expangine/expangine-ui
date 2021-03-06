
import { mount, createShow } from '../../src';
import { expectHTML } from '../helper';
import { Exprs } from 'expangine-runtime';


describe('show compiler', () => 
{

  it('single text node', () =>
  {
    const d = { visible: false };
    const i = mount(d, createShow(Exprs.get('visible'), [
      ['div', {}, {}, ['Hello World']],
    ]));

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<div>Hello World</div>'
    ]);

    i.scope.set('visible', false);

    expectHTML(i, [
      '<div style="display: none;">Hello World</div>'
    ]);
  });

  it('single text node initially visible', () =>
  {
    const d = { visible: true };
    const i = mount(d, createShow(Exprs.get('visible'), [
      ['div', {}, {}, ['Hello World']],
    ]));

    expectHTML(i, [
      '<div>Hello World</div>'
    ]);

    i.scope.set('visible', false);

    expectHTML(i, [
      '<div style="display: none;">Hello World</div>'
    ]);
  });

  it('multiple text node', () =>
  {
    const d = { visible: false };
    const i = mount(d, ['div', {}, {}, [
      createShow(Exprs.get('visible'), ['Hello', 'World'])
    ]]);

    expectHTML(i, [
      '<div><!--if--></div>'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<div>HelloWorld</div>'
    ]);
  });

  it('empty node', () =>
  {
    const d = { visible: false };
    const i = mount(d, ['div', {}, {}, [
      createShow(Exprs.get('visible'), [])
    ]]);

    expectHTML(i, [
      '<div><!--if--></div>'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<div><!--if--></div>'
    ]);
  });

  it('expression node', () =>
  {
    const d = { visible: false, content: 'Howdy' };
    const i = mount(d, ['div', {}, {}, [
      createShow(Exprs.get('visible'), [
        Exprs.get('content'),
      ])
    ]]);

    expectHTML(i, [
      '<div><!--if--></div>'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<div>Howdy</div>'
    ]);

    i.scope.set('content', 'Partner');

    expectHTML(i, [
      '<div>Partner</div>'
    ]);
  });

  it('nested', () =>
  {
    const d = { visible: false };
    const i = mount(d, createShow(Exprs.get('visible'), [
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

    i.scope.set('visible', false);

    expectHTML(i, [
      '<span style="display: none;"><p></p></span>',
      '<b style="display: none;"></b>'
    ]);

    i.scope.set('visible', true);

    expectHTML(i, [
      '<span style=""><p></p></span>',
      '<b style=""></b>',
    ]);
  });

});
