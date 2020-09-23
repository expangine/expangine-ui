import { NodeCompiler } from '../Node';
import { COMPILER_DEFAULT, COMPILER_DYNAMIC, COMPILER_COMPONENT, DIRECTIVE_IF, DIRECTIVE_SLOT, DIRECTIVE_FOR, DIRECTIVE_SWITCH } from '../constants';

import { CompilerDefault } from './default';
import { CompilerDynamic } from './dynamic';
import { CompilerIf } from './if';
import { CompilerComponent } from './component';
import { CompilerSlot } from './slot';
import { CompilerFor } from './for';
import { CompilerSwitch } from './switch';


export const compilers: Record<string, NodeCompiler> = {
  [COMPILER_DEFAULT]: CompilerDefault,
  [COMPILER_DYNAMIC]: CompilerDynamic,
  [COMPILER_COMPONENT]: CompilerComponent,
  [DIRECTIVE_IF]: CompilerIf,  
  [DIRECTIVE_SLOT]: CompilerSlot,
  [DIRECTIVE_FOR]: CompilerFor,
  [DIRECTIVE_SWITCH]: CompilerSwitch,  
};
