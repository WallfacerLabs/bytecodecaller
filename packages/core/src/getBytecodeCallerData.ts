import { OpCodeBuilder } from './OpCodeBuilder'
import { UnevenBytesLengthError } from './errors'

export function getBytecodeCallerData(bytecode: string, callData: string) {
  if (bytecode.length % 2 !== 0 || callData.length % 2 !== 0) throw new UnevenBytesLengthError()

  bytecode.startsWith('0x') ? (bytecode = bytecode.slice(2)) : bytecode
  callData.startsWith('0x') ? (callData = callData.slice(2)) : callData

  const dat = bytecode + callData

  const opCodeBuilder = new OpCodeBuilder()

  const callDataMemPos = bytecode.length / 2

  opCodeBuilder
    .pushBytesSizeToStack(dat)
    .pushBytesSizeToStack(dat)
    .addOpCode('CODESIZE')
    .addOpCode('SUB')
    .pushToStack('00')
    .addOpCode('CODECOPY')
    // retSize
    .pushToStack('00')
    // retOffset
    .pushToStack('00')

    // argsSize
    .pushBytesSizeToStack(callData)

    // argsOffset
    .pushToStack(callDataMemPos)

    // value
    .pushToStack('00')

    // size for create opcode
    .pushBytesSizeToStack(bytecode)

    // offset for create opcode
    .pushToStack('00')

    //value for create opcode
    .pushToStack('00')
    .addOpCode('CREATE')

    .pushToStack('FF'.repeat(32))

    .addOpCode('CALL')
    // get return data size
    .addOpCode('RETURNDATASIZE')
    // dup return data size
    .addOpCode('DUP1')

    .pushToStack('00')
    .pushToStack('00')
    .addOpCode('RETURNDATACOPY')

    .pushToStack('00')
    .addOpCode('RETURN')
    .addBytes(dat)
  return opCodeBuilder.toString()
}
