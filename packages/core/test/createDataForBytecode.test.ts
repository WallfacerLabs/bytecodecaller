import { OPCODES } from 'src/constants/opcodes'
import { createDataForBytecode } from 'src/createDataForBytecode'
import { UnevenBytesLengthError } from 'src/errors'
import { describe, expect, it } from 'vitest'

const ZERO_HEX = '00'
const MAX_BYTE = 'FF'
const FIRST_BYTECODE_CONSTANT_SEGMENT =
  OPCODES.CODESIZE + OPCODES.SUB + OPCODES.PUSH1 + ZERO_HEX + OPCODES.CODECOPY + (OPCODES.PUSH1 + ZERO_HEX).repeat(2)
const SECOND_BYTECODE_CONSTANT_SEGMENT = OPCODES.PUSH1 + ZERO_HEX
const THIRD_BYTECODE_CONSTANT_SEGMENT =
  OPCODES.PUSH1 +
  ZERO_HEX +
  OPCODES.PUSH1 +
  ZERO_HEX +
  OPCODES.CREATE +
  OPCODES.PUSH32 +
  MAX_BYTE.repeat(32) +
  OPCODES.CALL +
  OPCODES.RETURNDATASIZE +
  OPCODES.DUP1 +
  (OPCODES.PUSH1 + ZERO_HEX).repeat(2) +
  OPCODES.RETURNDATACOPY +
  OPCODES.PUSH1 +
  ZERO_HEX +
  OPCODES.RETURN

function getExpectedBytecode(
  bytecode: string,
  calldata: string,
  bytecodeSizeHex: string,
  calldataSizeHex: string,
  datSizeHex: string,
  calldataMemoryPositionHex: string
) {
  return (
    (OPCODES.PUSH1 + datSizeHex).repeat(2) +
    FIRST_BYTECODE_CONSTANT_SEGMENT +
    OPCODES.PUSH1 +
    calldataSizeHex +
    OPCODES.PUSH1 +
    calldataMemoryPositionHex +
    SECOND_BYTECODE_CONSTANT_SEGMENT +
    OPCODES.PUSH1 +
    bytecodeSizeHex +
    THIRD_BYTECODE_CONSTANT_SEGMENT +
    bytecode +
    calldata
  )
}

describe('createDataForByteCode', () => {
  const bytecode = 'bytecode'
  const calldata = 'calldata'
  const bytecodeSizeHex = '04'
  const calldataSizeHex = '04'
  const datSizeHex = '08'
  const calldataMemoryPositionHex = '04'
  const expectedDataForBytecode = getExpectedBytecode(
    bytecode,
    calldata,
    bytecodeSizeHex,
    calldataSizeHex,
    datSizeHex,
    calldataMemoryPositionHex
  )

  describe('creates data for bytecode', () => {
    it('no prefix', () => {
      expect(createDataForBytecode(bytecode, calldata).toLowerCase()).toBe(`0x${expectedDataForBytecode}`.toLowerCase())
    })

    it('bytecode with prefix', () => {
      expect(createDataForBytecode(`0x${bytecode}`, calldata).toLowerCase()).toBe(
        `0x${expectedDataForBytecode}`.toLowerCase()
      )
    })

    it('calldata with prefix', () => {
      expect(createDataForBytecode(bytecode, `0x${calldata}`).toLowerCase()).toBe(
        `0x${expectedDataForBytecode}`.toLowerCase()
      )
    })

    it('both with prefix', () => {
      expect(createDataForBytecode(`0x${bytecode}`, `0x${calldata}`).toLowerCase()).toBe(
        `0x${expectedDataForBytecode}`.toLowerCase()
      )
    })
  })

  it('empty bytecode', () => {
    const calldataMemoryPositionHex = '00'
    const bytecodeSizeHex = '00'
    const datSizeHex = '04'
    const bytecode = ''
    const expectedDataForBytecode = getExpectedBytecode(
      bytecode,
      calldata,
      bytecodeSizeHex,
      calldataSizeHex,
      datSizeHex,
      calldataMemoryPositionHex
    )
    expect(createDataForBytecode('', calldata).toLowerCase()).toBe(`0x${expectedDataForBytecode}`.toLowerCase())
  })

  it('empty calldata', () => {
    const datSizeHex = '04'
    const calldataSizeHex = '00'
    const calldata = ''
    const expectedDataForBytecode = getExpectedBytecode(
      bytecode,
      calldata,
      bytecodeSizeHex,
      calldataSizeHex,
      datSizeHex,
      calldataMemoryPositionHex
    )
    expect(createDataForBytecode(bytecode, '').toLowerCase()).toBe(`0x${expectedDataForBytecode}`.toLowerCase())
  })

  describe('invalid input', () => {
    it('uneven calldata length', () => {
      expect(() => createDataForBytecode(bytecode, '0')).toThrow(UnevenBytesLengthError)
    })

    it('uneven bytecode length', () => {
      expect(() => createDataForBytecode('0', calldata)).toThrow(UnevenBytesLengthError)
    })
  })
})
