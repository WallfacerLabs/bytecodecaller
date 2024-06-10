import { deployContracts, getAnvil } from '@bytecodecaller/testing'
import { http, createPublicClient } from 'viem'
import { callBytecodeExtension } from '../../../src/index.js'

export async function getAnvilClient() {
  const anvil = await getAnvil()

  const contracts = await deployContracts(anvil)

  return createPublicClient({
    transport: http(`http://${anvil.host}:${anvil.port}`),
  }).extend((client) => ({
    contracts,
    ...callBytecodeExtension(client),
  }))
}
