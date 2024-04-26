<br/>

<p align="center">
  <h1>Bytecode Caller</h1>
  </a>
</p>

<p align="center">
  Simple yet powerful multicall successor
<p>

<br>

## About

- 💡 **Lightweight** - 0 external dependencies
- 🧹 **Clean use** - create your queries with a smart-contract language of choice
- ⛓️ **Interdependent queries** - get data dependent on other call results in a single call
- 🚀 **No limits** - works on every EVM based chain, on every block in time

## Overview

Bytecode Caller allows you to compose any number of dependant on each other calls using e.g. Solidity. In the following example there is a smart contract *FriendWhoWantsMangoes* and *MangoSeller*. If you want to know the price, first you need to call *askHowManyMangoes* on *FriendWhoWantsMangoes*, and then take the result and call *askForMangoesPrice* on *MangoSeller* with it. Normally, using usual RPC call or calls via Multisig, in this scenario you would need 2 separate calls. 

Bytecode Caller allows you to make it in one call. Simply, you will need to write MangoPriceReader smart contract and pass its compiled bytecode to **createDataForBytecode** as in example below. 

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

```typescript
  import { bytecode } from 'build/MangoPriceReader.sol/MangoPriceReader.json'

  const friendContractAddress = '0xE930Eb2004e09f6492F49f58A2F35C0B1382c68C'
  const sellerContractAddress = '0x2d5b56ee345698c000061B81755eB5E70eA8DEa1'

  const abi = parseAbi(['function estimateExpenses(address, address) external view returns (uint256)'])
  const callData = encodeFunctionData({
    abi,
    functionName: 'read',
    args: [friendContractAddress, sellerContractAddress],
  })

  const byteCodeCallerData = createDataForBytecode(bytecode, callData)
  const result = await client.call({
    to: null,
    data: byteCodeCallerData,
  })

  const decodedResult = decodeFunctionResult({
    abi,
    functionName: 'estimateExpenses',
    data: result.data!,
  })
```

### Use with ethers 6

```typescript
  import { bytecode } from 'build/MangoPriceReader.sol/MangoPriceReader.json'

  const friendContractAddress = '0xE930Eb2004e09f6492F49f58A2F35C0B1382c68C'
  const sellerContractAddress = '0x2d5b56ee345698c000061B81755eB5E70eA8DEa1'

  const PriceReaderInterface = new Interface([
    'function estimateExpenses(address, address) external view returns (uint256)',
  ])

  const callData = PriceReaderInterface.encodeFunctionData('read', [friendContractAddress, sellerContractAddress])
  const bytecodeCallerData = createDataForBytecode(bytecode, callData)

  const result = await provider.call({
    to: null,
    data: bytecodeCallerData,
  })

  const decodedResult = PriceReaderInterface.decodeFunctionResult('estimateExpenses', result)
```

## License

[MIT](LICENSE.md) License