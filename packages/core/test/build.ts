import fs from 'node:fs'
import { compileSol } from 'solc-typed-ast'

type Hex = `0x${string}`

interface TestContracts {
  Array: Hex
}

let contracts: TestContracts | undefined = undefined

async function getContracts() {
  const files = fs.readdirSync('test/contracts')

  const result = await compileSol(
    files.map((file) => `test/contracts/${file}`),
    'auto'
  )

  const resultData: Record<string, Hex> = {}
  for (const file in result.data.contracts) {
    const contractFile = result.data.contracts[file]
    for (const contract in contractFile) {
      const contractData = contractFile[contract]
      resultData[contract] = contractData.evm.bytecode.object
    }
  }

  contracts = resultData as any as TestContracts

  return contracts
}

getContracts()
