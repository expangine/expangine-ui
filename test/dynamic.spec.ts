
import { mount } from '../src';
import { expectHTML } from './helper';
import { Exprs } from 'expangine-runtime';


describe('dynamic compiler', () => 
{

  it('simple tag', () =>
  {
    const d = { tag: 'div' };
    const i = mount(d, [Exprs.get('tag'), {}, {}, ['Hello World']]);

    expectHTML(i, [
      '<div>Hello World</div>'
    ]);

    i.scope.set('tag', 'span');

    expectHTML(i, [
      '<span>Hello World</span>'
    ]);
  });

});
