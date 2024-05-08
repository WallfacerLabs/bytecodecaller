# Bytecode Caller

### *Simple yet powerful multicall successor*

## About

- 💡 **Lightweight** - 0 external dependencies
- 🧹 **Clean use** - create your queries with a smart-contract language of choice
- ⛓️ **Interdependent queries** - get data dependent on other call results in a single call
- 🚀 **No limits** - works on every EVM based chain, on every block in time


## TL;DR

BytecodeCaller pretends to deploy any reading contract allowing you to create any set of calls.

## Overview

Bytecode Caller allows you to compose any number of dependant on each other calls using e.g. Solidity. In the following example there is a smart contract *FriendWhoWantsMangoes* and *MangoSeller*. If you want to know the price, first you need to call *askHowManyMangoes* on *FriendWhoWantsMangoes*, and then take the result and call *askForMangoesPrice* on *MangoSeller* with it. Normally, using usual RPC call or calls via Multisig, in this scenario you would need 2 separate calls. 

Bytecode Caller allows you to make it in one call. Simply, you will need to write MangoPriceReader smart contract and pass its compiled bytecode to **getBytecodeCallerData** as in example below. 

**Note:** There is no need to deploy the MangoPriceReader. 

Contract that you want to read:

```solidity
contract FriendWhoWantsMangoes {
    function askHowManyMangoes() external pure returns(uint256) {
        return 10;
    }
}

contract MangoSeller {
    function askForMangoesPrice(uint256 numberOfMangoes) external pure returns(uint256) {
        return numberOfMangoes * 20;
    }
}
```

Query contract to use: *(No need to deploy this smart contract)*

```solidity
contract MangoPriceReader {
    function estimateExpenses(address friend, address seller) public pure returns (uint256) {
        uint256 mangoesToBuy = FriendWhoWantsMangoes(friend).askHowManyMangoes();
        return MangoSeller(seller).askForMangoesPrice(mangoesToBuy);
    }
}
```


### Use with viem

For the use with viem, we highly recommend using the dedicated [viem extension](./packages/viem/README.md). If you'd prefer to use Bytecode Caller directly, follow the instructions below.

```typescript
  import { bytecode as mangoPriceReaderBytecode } from 'build/MangoPriceReader.sol/MangoPriceReader.json'

  const friendContractAddress = '0xE930Eb2004e09f6492F49f58A2F35C0B1382c68C'
  const sellerContractAddress = '0x2d5b56ee345698c000061B81755eB5E70eA8DEa1'

  const mangoPriceReaderAbi = parseAbi(['function estimateExpenses(address, address) external view returns (uint256)'])
  const callData = encodeFunctionData({
    abi: mangoPriceReaderAbi,
    functionName: 'estimateExpenses',
    args: [friendContractAddress, sellerContractAddress],
  })

  const byteCodeCallerData = getBytecodeCallerData(mangoPriceReaderBytecode, callData)
  const result = await client.call({
    to: null,
    data: byteCodeCallerData,
  })

  const decodedResult = decodeFunctionResult({
    abi: mangoPriceReaderAbi,
    functionName: 'estimateExpenses',
    data: result.data!,
  })
```

### Use with ethers 6

```typescript
  import { bytecode as mangoPriceReaderBytecode } from 'build/MangoPriceReader.sol/MangoPriceReader.json'

  const friendContractAddress = '0xE930Eb2004e09f6492F49f58A2F35C0B1382c68C'
  const sellerContractAddress = '0x2d5b56ee345698c000061B81755eB5E70eA8DEa1'

  const MangoPriceReaderInterface = new Interface([
    'function estimateExpenses(address, address) external view returns (uint256)',
  ])

  const callData = MangoPriceReaderInterface.encodeFunctionData('estimateExpenses', [friendContractAddress, sellerContractAddress])
  const bytecodeCallerData = getBytecodeCallerData(mangoPriceReaderBytecode, callData)

  const result = await provider.call({
    to: null,
    data: bytecodeCallerData,
  })

  const decodedResult = MangoPriceReaderInterface.decodeFunctionResult('estimateExpenses', result)
```

## License

[MIT](LICENSE.md) License
