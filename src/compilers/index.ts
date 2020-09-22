import { NodeCompiler } from '../Node';
import { COMPILER_DEFAULT, COMPILER_DYNAMIC, COMPILER_COMPONENT, DIRECTIVE_IF, DIRECTIVE_SHOW, DIRECTIVE_HIDE, DIRECTIVE_SLOT, DIRECTIVE_FOR } from '../constants';

import { CompilerDefault } from './default';
import { CompilerDynamic } from './dynamic';
import { CompilerIf } from './if';
import { CompilerVisibility } from './visibility';
import { CompilerComponent } from './component';
import { CompilerSlot } from './slot';
import { CompilerFor } from './for';


export const compilers: Record<string, NodeCompiler> = {
  [COMPILER_DEFAULT]: CompilerDefault,
  [COMPILER_DYNAMIC]: CompilerDynamic,
  [COMPILER_COMPONENT]: CompilerComponent,
  [DIRECTIVE_IF]: CompilerIf,
  [DIRECTIVE_SHOW]: CompilerVisibility,
  [DIRECTIVE_HIDE]: CompilerVisibility,
  [DIRECTIVE_SLOT]: CompilerSlot,
  [DIRECTIVE_FOR]: CompilerFor,
};
