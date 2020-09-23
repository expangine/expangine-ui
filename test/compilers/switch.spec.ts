
import { mount, createSwitch } from '../../src';
import { expectHTML } from '../helper';
import { Exprs } from 'expangine-runtime';


describe('switch compiler', () => 
{

  it('simple cases', () =>
  {
    const d = { state: 0 };
    const i = mount(d, 
      createSwitch(Exprs.get('state'), [
        [0, ['First']],
        [1, ['Second']],
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
