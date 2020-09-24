import { Expression } from 'expangine-runtime';
import { LiveContext } from 'expangine-runtime-live';
import { Watcher, Node as LinkedNode } from 'scrute';
import { Off } from './Node';
export declare class Scope<A extends LiveContext = any> {
    parent: Scope | null;
    observed: A;
    link: LinkedNode<Scope<A>>;
    children?: LinkedNode<Scope<A>>;
    disables: number;
    watchers: LinkedNode<Watcher>;
    constructor(parent?: Scope | null, data?: A);
    createChild(data?: any, addToParent?: boolean): Scope;
    get<V extends keyof A>(attr: V, defaultValue?: A[V], here?: boolean): A[V];
    has(attr: string | number | symbol, here?: boolean): attr is (keyof A);
    set<V extends keyof A>(attr: V, value: A[V], here?: boolean): boolean;
    remove<V extends keyof A>(attr: V): void;
    setMany(values: Partial<A>): void;
    watch(expr: any, onValue: (value: any) => void, immediate?: boolean, equalityCheck?: boolean): Off;
    eval(expr: any): ((extra?: any) => any);
    enable(): void;
    disable(): void;
    setEnabled(enabled: boolean): void;
    destroy(): void;
    private static registered;
    static register(): void;
    static isWatchable(x: any): x is (Expression | [string, ...any[]]);
}
