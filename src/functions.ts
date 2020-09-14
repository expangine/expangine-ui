
export function createScope(object: any)
{
  function scope() { /* not empty */ }

  return copyProperties(new (scope as any)(), object);
}

export function createChildScope(parent: any, object: any) 
{
  function child() { /* not empty */ }
  child.prototype = parent;

  return copyProperties(new (child as any)(), object);
}

export function copyProperties(target: any, source: any)
{
  for (const prop in source)
  {
    target[prop] = source[prop];
  }

  return target;
}