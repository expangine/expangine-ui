import { NodeCompiler } from '../Node';
import { CompilerSwitch } from './switch';


export const CompilerIf: NodeCompiler = ([tag, attrs, events, childSlots], component, scope, parent) => 
  CompilerSwitch([tag, { value: true, ...attrs }, events, childSlots], component, scope, parent)
;