import { NodeCompiler } from '../Node';
import { Scope } from '../Scope';
export interface DefaultEventObject {
    stop: boolean;
    prevent: boolean;
    nativeEvent: Event;
    scope: Scope;
}
export declare const CompilerDefault: NodeCompiler;
