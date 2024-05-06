import fs from 'node:fs'
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

interface Contract {
  abi: Abi
  bytecode: Hex
  address?: Address
}

function getBytecode(fileName: string, contractName: string): Hex {
  fileName = fileName.replace('.', '_')
  return fs
    .readFileSync(`./test/integration/build/test_integration_contracts_${fileName}_${contractName}.bin`)
    .toString() as Hex
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
