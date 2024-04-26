import { type Anvil, createAnvil } from '@viem/anvil'

let anvil: Anvil | undefined = undefined
export async function startAnvil() {
  if (anvil) await anvil.stop()
  anvil = createAnvil({
    autoImpersonate: true,
    gasPrice: 0,
    blockBaseFeePerGas: 0,
  })
  await anvil.start()
  return anvil
}

export async function stopAnvil() {
  if (anvil) await anvil.stop()
  anvil = undefined
}

export async function getAnvil() {
  if (!anvil) {
    throw new Error('Anvil is not running')
  }
  return anvil
}
