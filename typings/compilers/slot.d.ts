import { ComponentSlot } from '../Component';
import { NodeCompiler } from '../Node';
export declare const COMPILER_SLOT_COMMENT = "slot";
export declare const COMPILER_SLOT_DEFAULT_SLOT_INDEX = "slotIndex";
export declare const CompilerSlot: NodeCompiler;
export declare function isComponentSlot(x: any): x is ComponentSlot;
