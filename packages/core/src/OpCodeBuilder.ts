import { OPCODES } from './constants/opcodes'
import { padHex } from './utils/padHex'

export class OpCodeBuilder {
  private opCodes: string[] = []

  public addBytes(bytes: string) {
    this.opCodes.push(bytes)
    return this
  }

  public addOpCode(opCode: keyof typeof OPCODES) {
    this.opCodes.push(OPCODES[opCode])
    return this
  }

  public pushToStack(bytes: string | number) {
    if (typeof bytes === 'number') bytes = padHex(bytes.toString(16))
    const bytesLength = bytes.length / 2
    if (bytesLength > 32) throw new Error('Bytes length must be equal or less than 32')
    const pushOpCode = (Number(`0x${OPCODES.PUSH0}`) + bytesLength).toString(16)
    this.opCodes.push(pushOpCode, bytes)
    return this
  }

  public pushBytesSizeToStack(bytes: string) {
    const callDataSize = padHex((bytes.length / 2).toString(16))
    this.pushToStack(callDataSize)
    return this
  }

  public toString(): `0x${string}` {
    return `0x${this.opCodes.join('')}`
  }
}
