import { http, createPublicClient } from 'viem'
import { getAnvil } from './anvil'
import { deployContracts } from './contracts'

export async function getAnvilClient() {
  const anvil = await getAnvil()

  const contracts = await deployContracts(anvil)

  return createPublicClient({
    transport: http(`http://${anvil.host}:${anvil.port}`),
  }).extend(() => ({
    contracts,
  }))
}
