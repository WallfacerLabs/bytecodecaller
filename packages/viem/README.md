# Bytecode Caller - viem extension

### *Simple yet powerful multicall successor*

## About

Bytecode Caller viem extension provides an easy way to use the Bytecode Caller in your viem client.

For information about the Bytecode Caller itself, please refer to the [Bytecode Caller](../core/README.md) documentation.

### Installation

yarn

```
yarn add @bytecodecaller/viem
```

npm
```
npm install @bytecodecaller/viem
```

## Example use

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

### Extend your viem client

```typescript
  const client = createPublicClient({
    transport: http('https://mainnet.base.org/'),
  }).extend(callBytecodeExtension)
```

or if you use more extensions:

```typescript
  const client = createPublicClient({
    transport: http('https://mainnet.base.org/'),
  }).extend((client) => ({
    otherExtension,
    ...callBytecodeExtension(client),
  }))
```

### Execute the call

```typescript
  import { bytecode as mangoPriceReaderBytecode, abi as mangoPriceReaderAbi } from 'build/MangoPriceReader.sol/MangoPriceReader.json'

  const friendContractAddress = '0xE930Eb2004e09f6492F49f58A2F35C0B1382c68C'
  const sellerContractAddress = '0x2d5b56ee345698c000061B81755eB5E70eA8DEa1'

  const result = await client.callBytecode({
      bytecode: mangoPriceReaderBytecode,
      abi: mangoPriceReaderAbi,
      method: 'estimateExpenses',
      args: [friendContractAddress, sellerContractAddress],
    })
```

## License

[MIT](LICENSE.md) License
