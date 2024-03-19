export const OPCODES = {
  STOP: '00',
  ADD: '01',
  MUL: '02',
  SUB: '03',
  DIV: '04',
  SDIV: '05',
  MOD: '06',
  SMOD: '07',
  ADDMOD: '08',
  MULMOD: '09',
  EXP: '0A',
  SIGNEXTEND: '0B',
  LT: '10',
  GT: '11',
  SLT: '12',
  SGT: '13',
  EQ: '14',
  ISZERO: '15',
  AND: '16',
  OR: '17',
  XOR: '18',
  NOT: '19',
  BYTE: '1A',
  SHL: '1B',
  SHR: '1C',
  SAR: '1D',
  KECCAK256: '20',
  ADDRESS: '30',
  BALANCE: '31',
  ORIGIN: '32',
  CALLER: '33',
  CALLVALUE: '34',
  CALLDATALOAD: '35',
  CALLDATASIZE: '36',
  CALLDATACOPY: '37',
  CODESIZE: '38',
  CODECOPY: '39',
  GASPRICE: '3A',
  EXTCODESIZE: '3B',
  EXTCODECOPY: '3C',
  RETURNDATASIZE: '3D',
  RETURNDATACOPY: '3E',
  EXTCODEHASH: '3F',
  BLOCKHASH: '40',
  COINBASE: '41',
  TIMESTAMP: '42',
  NUMBER: '43',
  PREVRANDAO: '44',
  GASLIMIT: '45',
  CHAINID: '46',
  SELFBALANCE: '47',
  BASEFEE: '48',
  POP: '50',
  MLOAD: '51',
  MSTORE: '52',
  MSTORE8: '53',
  SLOAD: '54',
  SSTORE: '55',
  JUMP: '56',
  JUMPI: '57',
  PC: '58',
  MSIZE: '59',
  GAS: '5A',
  JUMPDEST: '5B',
  PUSH0: '5F',
  PUSH1: '60',
  PUSH2: '61',
  PUSH3: '62',
  PUSH4: '63',
  PUSH5: '64',
  PUSH6: '65',
  PUSH7: '66',
  PUSH8: '67',
  PUSH9: '68',
  PUSH10: '69',
  PUSH11: '6A',
  PUSH12: '6B',
  PUSH13: '6C',
  PUSH14: '6D',
  PUSH15: '6E',
  PUSH16: '6F',
  PUSH17: '70',
  PUSH18: '71',
  PUSH19: '72',
  PUSH20: '73',
  PUSH21: '74',
  PUSH22: '75',
  PUSH23: '76',
  PUSH24: '77',
  PUSH25: '78',
  PUSH26: '79',
  PUSH27: '7A',
  PUSH28: '7B',
  PUSH29: '7C',
  PUSH30: '7D',
  PUSH31: '7E',
  PUSH32: '7F',
  DUP1: '80',
  DUP2: '81',
  DUP3: '82',
  DUP4: '83',
  DUP5: '84',
  DUP6: '85',
  DUP7: '86',
  DUP8: '87',
  DUP9: '88',
  DUP10: '89',
  DUP11: '8A',
  DUP12: '8B',
  DUP13: '8C',
  DUP14: '8D',
  DUP15: '8E',
  DUP16: '8F',
  SWAP1: '90',
  SWAP2: '91',
  SWAP3: '92',
  SWAP4: '93',
  SWAP5: '94',
  SWAP6: '95',
  SWAP7: '96',
  SWAP8: '97',
  SWAP9: '98',
  SWAP10: '99',
  SWAP11: '9A',
  SWAP12: '9B',
  SWAP13: '9C',
  SWAP14: '9D',
  SWAP15: '9E',
  SWAP16: '9F',
  LOG0: 'A0',
  LOG1: 'A1',
  LOG2: 'A2',
  LOG3: 'A3',
  LOG4: 'A4',
  CREATE: 'F0',
  CALL: 'F1',
  CALLCODE: 'F2',
  RETURN: 'F3',
  DELEGATECALL: 'F4',
  CREATE2: 'F5',
  STATICCALL: 'FA',
  REVERT: 'FD',
  SELFDESTRUCT: 'FF',
}
