import fs from 'node:fs'
import path from 'node:path'
import type { Anvil } from '@viem/anvil'
import {
  http,
  type Abi,
  type Address,
  type Hex,
  createPublicClient,
  createTestClient,
  createWalletClient,
  parseAbi,
  zeroAddress,
} from 'viem'
import { anvil as anvilChain } from 'viem/chains'

export async function deployContracts(anvil: Anvil) {
  const transport = http(`http://${anvil.host}:${anvil.port}`)
  const testClient = createTestClient({
    transport,
    mode: 'anvil',
  })
  await testClient.setBalance({
    address: zeroAddress,
    value: 100000000000000000000n,
  })

  const walletClient = createWalletClient({
    transport,
    account: zeroAddress,
  })
  const publicClient = createPublicClient({
    transport,
  })

  for (const contractName in contracts) {
    const contract = contracts[contractName]
    const hash = await walletClient.deployContract({
      account: zeroAddress,
      bytecode: contract.bytecode,
      abi: contract.abi,
      chain: anvilChain,
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    if (receipt.contractAddress) {
      contracts[contractName].address = receipt.contractAddress
    } else {
      throw new Error('Contract deployment failed')
    }
  }

  return contracts
}

type Contract = {
  abi: Abi
  bytecode: Hex
  address?: Address
}

const contracts: Record<string, Contract> = {
  Friend: {
    abi: parseAbi(['function askHowManyMangoes() external view returns (uint256)']),
    bytecode: getBytecode('FruitMarket.sol', 'FriendWhoWantsMangoes'),
  },
  Seller: {
    abi: parseAbi(['function askForMangoesPrice(uint256 numberOfMangoes) external view returns (uint256)']),
    bytecode: getBytecode('FruitMarket.sol', 'MangoSeller'),
  },
  PriceEstimator: {
    abi: parseAbi(['function estimateExpenses(address, address) external view returns (uint256)']),
    bytecode: getBytecode('MangoPriceEstimator.sol', 'MangoPriceEstimator'),
  },
} as const

function getBytecode(contractFileName: string, contractName: string): Hex {
  const fileName = `src_contracts_${contractFileName.replace('.', '_')}_${contractName}.bin`
  const filePath = path.join(__dirname, '..', 'build', fileName)
  return fs.readFileSync(filePath).toString() as Hex
}
