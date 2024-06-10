# Bytecode Caller

### *Simple yet powerful multicall successor*

## About

- 💡 **Lightweight** - 0 external dependencies
- 🧹 **Clean use** - create your queries with a smart-contract language of choice
- ⛓️ **Interdependent queries** - get data dependent on other call results in a single call
- 🚀 **No limits** - works on every EVM based chain, on every block in time


## TL;DR

BytecodeCaller simulates a deployment of any reading contract allowing you to create any set of codependent calls using one RPC call.

## Overview

Bytecode Caller allows you to compose any number of dependant on each other calls using e.g. Solidity. In the following example there is a smart contract *FriendWhoWantsMangoes* and *MangoSeller*. If you want to know the total price, first you need to call *askHowManyMangoes* on *FriendWhoWantsMangoes*, and then take the result and call *askForMangoesPrice* on *MangoSeller* with it. Normally, using usual RPC call or calls via Multisig, in this scenario you would need 2 separate calls.

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

Another, more advanced, real life example. Imagine, you need a set of tuples, consisting of symbols of the assets listed on a lending market and their prices posted onchain, by the oracle used by this lending protocol. An example described set of data could look like this: `[['DAI', 1e8], ['WETH', 3700e8], ['wstETH', 4200e8]]`. In this example we are going to use Sparklend V1 as a lending market to fetch data from. In order to assemble this data without the bytecode caller, at least 2 calls are needed.
1. Fetch a list of all assets (``)
```typescript
const assetAddresses = await sparklendPool.getReservesList()
```
2. Fetch all symbols of all assets and fetch all prices using a multicall (`for`)
```typescript
const multicallCalls = []
for (const assetAddress of assetAddresses) {
  multicallCalls.push({
    target: assetAddress
    callData: erc20Interface.encodeFunctionData('symbol')
  })
  multicallCalls.push({
    target: sparklendOracleAddress
    callData: oracleInterface.encodeFunctionData('getAssetPrice', [assetAddress])
  })
}
const results = await multicall.aggregate(multicallCalls)
```
Note, that it's impossible to squash these two calls into one, because the results of the first call determine both the target addresses and arguments of the second call.

With bytecodecaller this could be squashed into a single call.
The query contract could look like this:
```solidity
contract NonDeployableDataQueryContract {
    struct PriceRecord {
      string symbol;
      uint256 price;
    }

    function fetchData(address pool, address oracle) public view returns (PriceRecord[] memory priceRecords) {
        address[] memory assetAddresses = IPool(pool).getReservesList();
        priceRecords = new PriceRecord[](assetAddresses.length);

        for (uint256 i = 0; i < assetAddresses.length; i++) {
          priceRecords[i] = PriceRecord({
            symbol: IERC20(assetAddresses[i]).symbol(),
            price: IOracle(oracle).getAssetPrice(assetAddresses[i])
          });
        }
    }
}
```
In this case the whole operation will be executed with just one RPC call
### Multicall vs BytecodeCaller

There are 2 huge differences between using Multicall and our library

- when using Multicall, you need to wait for a response to use it in the next call

- you can't use Multicall for blocks from before Multicall was deployed

Let's consider the following examples when BytecodeCaller makes life even easier than Multicall

- passing arguments in read functions

#### Multicall

In the following example we want to calculate the amount of DAI that user can get by withdrawing half of their shares from SavingsDai.

```solidity
contract SavingsDai is IERC4626 {
  mapping (address => uint256) public balanceOf;
  function previewRedeem(uint256 shares);
}
```
When you use Multicall, first you need to ask for user's balance, then you can call previewRedeem with divided by half balance.

```typescript
  const userBalance = callMulticall(IERC4626, 'balanceOf', userAddress);
  const redeemedAmount = callMulticall(IERC4626, 'previewRedeem', userBalance/2); // redeemedAmount will be loaded in the second multicall's call
```

![image](./docs/image/Multicall-sequence.png)

#### BytecodeCaller

With BytecodeCaller you can get all the information in a single call, in the same block.

```solidity
contract SavingsDaiReader {
  function read(address userAddress) public returns(UserData) {
    uint256 balance = savingsDai.balanceOf(userAddress);
    uint256 redeemedAmount = savingsDai.previewRedeem(balance / 2);
    return UserData({balance, redeemedAmount});
  }
}
```

```typescript
const { balance, redeemedAmount } = callBytecodecaller(SavingsDaiReader, 'read', userAddress);
```

![image](./docs/image/Bytecodecaller-sequence.png)


### Installation

yarn

```
yarn add @bytecodecaller/core
```

npm
```
npm install @bytecodecaller/core
```

### Use with viem

For the use with viem, we highly recommend using the dedicated [viem extension](./packages/viem/README.md). If you'd prefer to use Bytecode Caller directly, follow the instructions below.

```typescript
  import { bytecode as mangoPriceReaderBytecode, abi as mangoPriceReaderAbi } from 'build/MangoPriceReader.sol/MangoPriceReader.json'

  const friendContractAddress = '0xE930Eb2004e09f6492F49f58A2F35C0B1382c68C'
  const sellerContractAddress = '0x2d5b56ee345698c000061B81755eB5E70eA8DEa1'

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
  import { bytecode as mangoPriceReaderBytecode, abi as mangoPriceReaderAbi } from 'build/MangoPriceReader.sol/MangoPriceReader.json'

  const friendContractAddress = '0xE930Eb2004e09f6492F49f58A2F35C0B1382c68C'
  const sellerContractAddress = '0x2d5b56ee345698c000061B81755eB5E70eA8DEa1'

  const MangoPriceReaderInterface = new Interface(mangoPriceReaderAbi)

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
