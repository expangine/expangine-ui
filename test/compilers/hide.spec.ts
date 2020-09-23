
import { mount, createHide } from '../../src';
import { expectHTML } from '../helper';
import { Exprs } from 'expangine-runtime';


describe('hide compiler', () => 
{

  it('single text node', () =>
  {
    const d = { invisible: false };
    const i = mount(d, createHide(Exprs.get('invisible'), [
      ['div', {}, {}, ['Hello World']],
    ]));

    expectHTML(i, [
      '<div>Hello World</div>'
    ]);

    i.scope.set('invisible', true);

    expectHTML(i, [
      '<div style="display: none;">Hello World</div>'
    ]);
  });

  it('single text node initially invisible', () =>
  {
    const d = { invisible: true };
    const i = mount(d, createHide(Exprs.get('invisible'), [
      ['div', {}, {}, ['Hello World']],
    ]));

    expectHTML(i, [
      '<!--if-->'
    ]);

    i.scope.set('invisible', false);

    expectHTML(i, [
      '<div>Hello World</div>'
    ]);

    i.scope.set('invisible', true);

    expectHTML(i, [
      '<div style="display: none;">Hello World</div>'
    ]);
  });

  it('multiple text node', () =>
  {
    const d = { invisible: false };
    const i = mount(d, ['div', {}, {}, [
      createHide(Exprs.get('invisible'), ['Hello', 'World'])
    ]]);

    expectHTML(i, [
      '<div>HelloWorld</div>'
    ]);

    i.scope.set('invisible', true);

    expectHTML(i, [    
      '<div><!----><!----></div>'
    ]);
  });

  it('empty node', () =>
  {
    const d = { invisible: false };
    const i = mount(d, ['div', {}, {}, [
      createHide(Exprs.get('invisible'), [])
    ]]);

    expectHTML(i, [
      '<div><!--if--></div>'
    ]);

    i.scope.set('invisible', true);

    expectHTML(i, [
      '<div><!--if--></div>'
    ]);

    i.scope.set('invisible', false);

    expectHTML(i, [
      '<div><!--if--></div>'
    ]);
  });

  it('expression node', () =>
  {
    const d = { invisible: false, content: 'Howdy' };
    const i = mount(d, ['div', {}, {}, [
      createHide(Exprs.get('invisible'), [
        Exprs.get('content'),
      ])
    ]]);

    expectHTML(i, [
      '<div>Howdy</div>'
    ]);

    i.scope.set('content', 'Partner');

    expectHTML(i, [
      '<div>Partner</div>'
    ]);

    i.scope.set('invisible', true);

    expectHTML(i, [
      '<div><!----></div>'
    ]);
  });

  it('nested', () =>
  {
    const d = { invisible: false };
    const i = mount(d, createHide(Exprs.get('invisible'), [
      ['span', {}, {}, [['p']]],
      ['b']
    ]));

    expectHTML(i, [
      '<span><p></p></span>',
      '<b></b>'
    ]);

    i.scope.set('invisible', true);

    expectHTML(i, [
      '<span style="display: none;"><p></p></span>',
      '<b style="display: none;"></b>',
    ]);
  });

});
