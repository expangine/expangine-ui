import { BooleanOps } from 'expangine-runtime';
import { NodeCompiler } from '../Node';
import { CompilerSwitch } from './switch';


export const CompilerIf: NodeCompiler = ([tag, attrs, events, childSlots], component, scope, parent) => 
  CompilerSwitch([tag, { value: true, isEqual: BooleanOps.isEqual, ...attrs }, events, childSlots], component, scope, parent)
;