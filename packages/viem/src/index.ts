import { getBytecodeCallerData } from '@bytecodecaller/core'
import { type Abi, type Hex, type PublicClient, decodeFunctionResult, encodeFunctionData } from 'viem'

interface CallBytecodeParams {
  client: {
    call: PublicClient['call']
  }
  block?: bigint
  bytecode: Hex
  abi: Abi
  method: string
  args: any[]
}

export const callBytecodeExtension = (client: {
  call: PublicClient['call']
}) => ({
  callBytecode: ({ block, bytecode, abi, method, args }: Omit<CallBytecodeParams, 'client'>) =>
    callBytecode({
      client,
      block,
      bytecode,
      abi,
      method,
      args,
    }),
})

async function callBytecode<ReturnType>({
  client,
  block,
  bytecode,
  abi,
  method,
  args,
}: CallBytecodeParams): Promise<ReturnType> {
  const contractCallData = encodeFunctionData({
    abi,
    functionName: method,
    args,
  })
  const data = getBytecodeCallerData(bytecode, contractCallData)

  const result = await client.call({
    data,
    blockNumber: block,
    to: null,
  })

  if (!result.data) throw new Error('No data returned from call')
  const decodedResult = decodeFunctionResult({
    abi,
    functionName: method,
    data: result.data,
  })

  return decodedResult as ReturnType
}
