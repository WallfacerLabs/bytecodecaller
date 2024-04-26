import { createDataForBytecode } from 'src/createDataForBytecode'
import { decodeFunctionResult, encodeFunctionData } from 'viem'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { startAnvil, stopAnvil } from './anvil'
import { getAnvilClient } from './client'

describe('ByteCodeCaller', () => {
  let client: Awaited<ReturnType<typeof getAnvilClient>>

  beforeAll(async () => {
    await startAnvil()
    client = await getAnvilClient()
  })

  afterAll(async () => {
    await stopAnvil()
  })

  it('ArrayReader', async () => {
    const contract = client.contracts.ArrayReader
    const callData = encodeFunctionData({
      abi: contract.abi,
      functionName: 'read',
      args: [client.contracts.Array.address],
    })

    const byteCodeCallerData = createDataForBytecode(contract.bytecode, callData)
    const result = await client.call({
      to: null,
      data: byteCodeCallerData,
    })

    expect(result.data).toBeDefined()

    const decodedResult = decodeFunctionResult({
      abi: contract.abi,
      functionName: 'read',
      data: result.data!,
    })

    expect(decodedResult).toEqual([1n, 2n, 3n])
  })
})
