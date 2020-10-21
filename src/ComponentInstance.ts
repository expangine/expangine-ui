import { Exprs, Expression, ExpressionValue, defs, isObject, isNumber, Type, ObjectType, isFunction } from 'expangine-runtime';
import { Scope } from './Scope';
import { Component, ComponentValue, ComponentSlot, TypeProvider } from './Component';
import { NodeInstance, NodeTemplateNamedSlots, NodeTemplateChild, Off, changeElements, getSlots } from './Node';
import { compile } from './compile';
import { isComponentSlot } from './compilers/slot';
import { DEFAULT_SLOT } from './constants';


export type ComponentInstanceAny = ComponentInstance<any, any, any, any, any>;

export class ComponentInstance<A, E, S extends string, L, C> 
{

  public component: Component<A, E, S, L, C>;
  public attrs: Partial<Record<keyof A, ExpressionValue>>;
  public cache: Record<string, any>;
  public scope: Scope<A & L & C & { emit: E, refs: Record<string, any> }>;
  public outerScope: Scope;
  public node?: NodeInstance;
  public parent?: ComponentInstanceAny;
  public slots?: NodeTemplateNamedSlots;

  public constructor(component: Component<A, E, S, L, C>, attrs: Partial<Record<keyof A, ExpressionValue>>, scope: Scope, slots?: NodeTemplateNamedSlots, parent?: ComponentInstanceAny, outerScope?: Scope) 
  {
    this.component = component;
    this.attrs = attrs;
    this.scope = scope;
    this.outerScope = outerScope || scope;
    this.slots = slots;
    this.parent = parent;
    this.cache = Object.create(null);
  }

  public call<K extends keyof A>(attr: K, args: Record<string, ExpressionValue>): Expression
  {
    const expr = this.getAttributeExpression(attr);

    if (expr)
    {
      const def = Exprs.define();
      
      for (const arg in args)
      {
        def.with(arg, defs.getExpression(args[arg]));
      }

      def.run(defs.getExpression(expr));

      return def;
    }

    return Exprs.noop();
  }

  public hasCallable<K extends keyof A>(attr: K): boolean
  {
    const options = this.getAttributeOptions(attr);
    const expr = this.getAttributeExpression(attr);

    return Boolean(options && options.callable && expr);
  }

  public hasAttribute<K extends keyof A>(attr: K): boolean
  {
    return Boolean(this.attrs[attr]);
  }

  public callable<K extends keyof A>(attr: K): ((args: any) => {})
  {
    const options = this.getAttributeOptions(attr);
    const expr = this.getAttributeExpression(attr);

    if (!options || !options.callable || !expr)
    {
      throw new Error(`The ${attr} is not callable.`);
    }

    const propTypes = isFunction(options.callable)
      ? options.callable({})
      : options.callable;
    const props = Object.keys(propTypes.options.props);

    return this.scope.eval(expr, props);
  }

  public trigger<K extends keyof E>(eventName: K, payload: E[K]): void
  {
    this.scope.observed.emit[eventName] = payload;
  }

  public on<K extends keyof E>(eventName: K, listener: (payload: E[K]) => any): Off 
  {
    return this.scope.watch(
      Exprs.get('emit', eventName),
      listener,
      false,
      false,
      true
    );
  }

  public update(): void 
  {
    if (this.component.updated && this.node) 
    {
      this.component.updated(this);
    }
  }

  public render(): void 
  {
    this.cache = Object.create(null);

    const rendered = this.component.render(this);
    const node = compile(rendered, this, this.scope);

    changeElements(this.node.elements, node.elements);
    
    this.node = node;
  }

  public destroy(): void 
  {
    this.scope.destroy();
  }

  public getAttributeOptions<K extends keyof A>(attr: K): ComponentValue<A, E, S, L, C, K> | false
  {
    const value = this.component.attributes?.[attr];

    return value
      ? value instanceof Type
        ? { type: value }
        : value as ComponentValue<A, E, S, L, C, K>
      : false;
  }

  public getAttributeExpression<K extends keyof A>(attr: K): Expression | false
  {
    const attrOptions = this.getAttributeOptions(attr);
    
    return this.attrs[attr] || (
      attrOptions 
        ? isFunction(attrOptions.default)
          ? attrOptions.default(this)
          : attrOptions.default
        : false
    );
  }

  public getSlotArrayLength(slotName: S | 'default' = DEFAULT_SLOT): Expression
  {
    const options = this.getSlotOptions(slotName);

    if (options && options.arrayLength)
    {
      return defs.getExpression(options.arrayLength);
    }

    if (this.slots && this.slots[slotName] && isObject(this.slots[slotName]))
    {
      const slots = this.slots[slotName];
      let maxSlotIndex: number | undefined;

      for (const slotIndex in slots)
      {
        const i = parseInt(slotIndex);

        if (isNumber(i) && (maxSlotIndex === undefined || i > maxSlotIndex))
        {
          maxSlotIndex = i;
        }
      }

      if (maxSlotIndex !== undefined)
      {
        return Exprs.const(maxSlotIndex + 1);
      }
    }

    return Exprs.const(0);
  }

  public getSlotOptions(slotName: S | 'default' = 'default'): ComponentSlot<A> | false
  {
    if (this.component.slots)
    {
      const slotInput: ComponentSlot<A> | TypeProvider<A, ObjectType> = this.component.slots[slotName as S];

      return isComponentSlot<A>(slotInput)
        ? slotInput
        : { scope: slotInput };
    }

    return false;
  }

  public getSlotSize(slotName: S | 'default' = 'default', slotIndex: number = 0): number
  {
    return getSlots(this.slots, slotName, slotIndex).length;
  }

  public hasSlot<T, F>(slotName: S | 'default', truthy: T, falsy: F): T | F
  {
    return this.slots && slotName in this.slots ? truthy : falsy;
  }

  public whenSlot(slotName: S | 'default', getMissing: () => NodeTemplateChild, getChildren: () => NodeTemplateChild): NodeTemplateChild
  public whenSlot(slotName: S | 'default', getMissing: () => NodeTemplateChild[], getChildren: () => NodeTemplateChild[]): NodeTemplateChild[]
  public whenSlot<R = NodeTemplateChild | NodeTemplateChild[]>(slotName: S | 'default', getMissing: () => R, getChildren: () => R): R
  {
    return this.slots && slotName in this.slots ? getChildren() : getMissing();
  }

}