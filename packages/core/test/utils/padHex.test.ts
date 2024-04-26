import { padHex } from 'src/utils/padHex'
import { describe, expect, it } from 'vitest'

describe('padHex', () => {
  it('empty string', () => {
    expect(padHex('')).toEqual('')
  })

  it('string of uneven length', () => {
    expect(padHex('123')).toEqual('0123')
  })

  it('string of even length', () => {
    expect(padHex('1234')).toEqual('1234')
  })
})
