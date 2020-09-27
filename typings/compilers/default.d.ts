import { NodeCompiler } from '../Node';
export interface DefaultEventObject {
    stop: boolean;
    prevent: boolean;
    nativeEvent: Event;
}
export declare const CompilerDefault: NodeCompiler;
