import { OPCODES, type OpCodeName } from './constants/opcodes.js'
import { InvalidBytesSizeError } from './errors/InvalidBytesSizeError.js'
import { UnevenBytesLengthError } from './errors/UnevenBytesLengthError.js'
import { padHex } from './utils/padHex.js'

export class OpCodeBuilder {
  private opCodes: string[] = []

  public addBytes(bytes: string) {
    this.opCodes.push(bytes)
    return this
  }

  public addOpCode(opCode: OpCodeName) {
    this.opCodes.push(OPCODES[opCode])
    return this
  }

  public pushToStack(bytes: string | number) {
    if (typeof bytes === 'number') bytes = padHex(bytes.toString(16))
    if (bytes.length % 2 !== 0) throw new UnevenBytesLengthError()
    const bytesLength = bytes.length / 2
    if (bytesLength > 32) throw new InvalidBytesSizeError()
    const pushOpCode = (Number(`0x${OPCODES.PUSH0}`) + bytesLength).toString(16)
    this.opCodes.push(pushOpCode, bytes)
    return this
  }

  public pushBytesSizeToStack(bytes: string) {
    if (bytes.length % 2 !== 0) throw new UnevenBytesLengthError()
    const callDataSize = padHex((bytes.length / 2).toString(16))
    this.pushToStack(callDataSize)
    return this
  }

  public toString(): `0x${string}` {
    return `0x${this.opCodes.join('')}`
  }
}
