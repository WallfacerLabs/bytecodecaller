import { type Anvil, createAnvil } from '@viem/anvil'
import { http, createClient } from 'viem'
import { getAnvil } from './anvil'
import { deployContracts } from './contracts'

export async function getAnvilClient() {
  const anvil = await getAnvil()

  const contracts = await deployContracts(anvil)

  return createClient({
    transport: http(`http://${anvil.host}:${anvil.port}`),
  }).extend(() => ({
    contracts,
  }))
}
