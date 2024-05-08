import { startAnvil, stopAnvil } from '@bytecodecaller/testing'
import { getBytecodeCallerData } from 'src/getBytecodeCallerData'
import { decodeFunctionResult, encodeFunctionData } from 'viem'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getAnvilClient } from './server/client'

describe('ByteCodeCaller', () => {
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
    const callData = encodeFunctionData({
      abi: contract.abi,
      functionName: 'estimateExpenses',
      args: [client.contracts.Friend.address, client.contracts.Seller.address],
    })

    const byteCodeCallerData = getBytecodeCallerData(contract.bytecode, callData)
    const result = await client.call({
      to: null,
      data: byteCodeCallerData,
    })

    expect(result.data).toBeDefined()

    const decodedResult = decodeFunctionResult({
      abi: contract.abi,
      functionName: 'estimateExpenses',
      data: result.data!,
    })

    expect(decodedResult).toEqual(200n)
  })
})
