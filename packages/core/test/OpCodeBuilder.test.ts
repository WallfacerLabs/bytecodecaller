import { OpCodeBuilder } from 'src/OpCodeBuilder.js'
import { OPCODES, type OpCodeName } from 'src/constants/opcodes.js'
import { InvalidBytesSizeError } from 'src/errors/InvalidBytesSizeError.js'
import { UnevenBytesLengthError } from 'src/errors/UnevenBytesLengthError.js'
import { beforeEach, describe, expect, it } from 'vitest'

describe('padHex', () => {
  let opcodeBuilder: OpCodeBuilder

  beforeEach(() => {
    opcodeBuilder = new OpCodeBuilder()
  })

  it('no opcodes', () => {
    expect(opcodeBuilder.toString()).toEqual('0x')
  })

  describe('addBytes', () => {
    it('empty string', () => {
      opcodeBuilder.addBytes('')
      expect(opcodeBuilder.toString()).toEqual('0x')
    })

    it('non-empty string', () => {
      opcodeBuilder.addBytes('123')
      expect(opcodeBuilder.toString()).toEqual('0x123')
    })

    it('returns the class instance', () => {
      expect(opcodeBuilder.addBytes('123')).toBe(opcodeBuilder)
    })
  })

  describe('addOpCode', () => {
    Object.entries(OPCODES).map(([opCodeName, opCode]) =>
      it(`adds ${opCodeName} op code`, () => {
        opcodeBuilder.addOpCode(opCodeName as OpCodeName)
        expect(opcodeBuilder.toString()).toEqual(`0x${opCode}`)
      })
    )

    it('returns the class instance', () => {
      expect(opcodeBuilder.addOpCode('STOP')).toBe(opcodeBuilder)
    })
  })

  describe('pushToStack', () => {
    describe('number', () => {
      it('zero', () => {
        opcodeBuilder.pushToStack(0)
        expect(opcodeBuilder.toString()).toEqual('0x6000') // PUSH1 and 0
      })

      it('one byte number', () => {
        opcodeBuilder.pushToStack(255)
        expect(opcodeBuilder.toString()).toEqual('0x60ff') // PUSH1 and 255
      })

      it('two bytes number', () => {
        opcodeBuilder.pushToStack(256)
        expect(opcodeBuilder.toString()).toEqual('0x610100') // PUSH2 and 256
      })

      it('more than 32 bytes number', () => {
        expect(() => opcodeBuilder.pushToStack(2 ** 256)).toThrow('Bytes length must be equal or less than 32')
      })
    })

    describe('string', () => {
      it('empty', () => {
        opcodeBuilder.pushToStack('')
        expect(opcodeBuilder.toString()).toEqual('0x5f') // PUSH0
      })

      it('one byte', () => {
        opcodeBuilder.pushToStack('ff')
        expect(opcodeBuilder.toString()).toEqual('0x60ff') // PUSH1 and ff
      })

      it('two bytes', () => {
        opcodeBuilder.pushToStack('0100')
        expect(opcodeBuilder.toString()).toEqual('0x610100') // PUSH2 and 0100
      })

      it('uneven length bytes', () => {
        expect(() => opcodeBuilder.pushToStack('1')).toThrow(new UnevenBytesLengthError())
      })

      it('more than 32 bytes', () => {
        expect(() => opcodeBuilder.pushToStack('ff'.repeat(33))).toThrow(new InvalidBytesSizeError())
      })
    })

    it('returns the class instance', () => {
      expect(opcodeBuilder.pushToStack('')).toBe(opcodeBuilder)
    })
  })

  describe('pushBytesSizeToStack', () => {
    it('empty string', () => {
      opcodeBuilder.pushBytesSizeToStack('')
      expect(opcodeBuilder.toString()).toEqual('0x6000') // PUSH1 and 0
    })

    it('short bytes', () => {
      opcodeBuilder.pushBytesSizeToStack('ff')
      expect(opcodeBuilder.toString()).toEqual('0x6001') // PUSH1 and 1
    })

    it('long bytes', () => {
      opcodeBuilder.pushBytesSizeToStack('ff'.repeat(256))
      expect(opcodeBuilder.toString()).toEqual('0x610100') // PUSH2 and 256
    })

    it('uneven length bytes', () => {
      expect(() => opcodeBuilder.pushToStack('1')).toThrow(new UnevenBytesLengthError())
    })

    it('returns the class instance', () => {
      expect(opcodeBuilder.pushBytesSizeToStack('12')).toBe(opcodeBuilder)
    })
  })
})
