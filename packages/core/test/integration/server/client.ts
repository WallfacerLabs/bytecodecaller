import { deployContracts, getAnvil } from '@bytecodecaller/testing'
import { http, createPublicClient } from 'viem'

export async function getAnvilClient() {
  const anvil = await getAnvil()

  const contracts = await deployContracts(anvil)

  return createPublicClient({
    transport: http(`http://${anvil.host}:${anvil.port}`),
  }).extend(() => ({
    contracts,
  }))
}
