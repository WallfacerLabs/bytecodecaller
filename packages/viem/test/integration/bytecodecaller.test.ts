import { startAnvil, stopAnvil } from '@bytecodecaller/testing'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getAnvilClient } from './server/client.js'

describe('bytecodecaller/viem', () => {
  let client: Awaited<ReturnType<typeof getAnvilClient>>

  beforeAll(async () => {
    await startAnvil()
    client = await getAnvilClient()
  })

  afterAll(async () => {
    await stopAnvil()
  })

  it('reads 2 contracts dependent data', async () => {
    const contract = client.contracts.PriceEstimator

    const result = await client.callBytecode({
      bytecode: contract.bytecode,
      abi: contract.abi,
      method: 'estimateExpenses',
      args: [client.contracts.Friend.address, client.contracts.Seller.address],
    })

    expect(result).toEqual(200n)
  })
})
