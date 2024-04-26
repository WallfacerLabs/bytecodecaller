import { JsonRpcProvider } from 'ethers'
import { startAnvil } from 'test/anvil'

async function main() {
  const anvil = await startAnvil()
  const provider = new JsonRpcProvider(`http://${anvil.host}:${anvil.port}`)
}
