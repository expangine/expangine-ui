import { Expression } from 'expangine-runtime';
import { LiveContext } from 'expangine-runtime-live';
import { Watcher, Node as LinkedNode } from 'scrute';
import { Off } from './Node';
export declare class Scope<A extends LiveContext = any> {
    parent: Scope | null;
    data: A;
    observed: A;
    link: LinkedNode<Scope<A>>;
    children?: LinkedNode<Scope<A>>;
    disables: number;
    watchers: LinkedNode<Watcher>;
    constructor(parent?: Scope | null, data?: any);
    addToParent(): void;
    createChild(data?: any, addToParent?: boolean): Scope;
    get<V extends keyof A>(attr: V, defaultValue?: A[V]): A[V];
    set<V extends keyof A>(attr: V, value: A[V]): void;
    setMany(values: Partial<A>): void;
    watch(expr: any, onValue: (value: any) => void): Off;
    eval(expr: any): ((extra?: any) => any);
    enable(): void;
    disable(): void;
    setEnabled(enabled: boolean): void;
    destroy(): void;
    static isWatchable(x: any): x is (Expression | any[]);
}
