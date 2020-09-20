import { Scope } from '../src';
import { Exprs } from 'expangine-runtime';


// esline-disable: magic-numbers

describe('Scope', () => 
{

  it('parent change', () =>
  {
    const p = new Scope(null, { content: 'Hello' });
    const c = p.createChild();

    const changes: string[] = [];

    c.watch(Exprs.get('content'), (content) => {
      changes.push(content);
    });

    expect(changes).toStrictEqual(['Hello']);

    p.set('content', 'World');

    expect(changes).toStrictEqual(['Hello', 'World']);

    c.set('content', 'From Child');

    expect(changes).toStrictEqual(['Hello', 'World', 'From Child']);
  });

  it('template change', () =>
  {
    const p = new Scope(null, { content: 'Hello', times: 1 });
    const c = p.createChild();

    const changes: string[] = [];

    c.watch(Exprs.template('{content} ({times})', {
      content: Exprs.get('content'),
      times: Exprs.get('times'),
    }), (content) => {
      changes.push(content);
    });

    expect(changes).toStrictEqual(['Hello (1)']);

    p.set('content', 'World');

    expect(changes).toStrictEqual(['Hello (1)', 'World (1)']);

    c.set('times', 2);

    expect(changes).toStrictEqual(['Hello (1)', 'World (1)', 'World (2)']);
  });

});