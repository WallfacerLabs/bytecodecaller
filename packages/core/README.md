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

Contract that you want to read:

```solidity
contract Array {
    uint256[] arr;

    constructor() {
        arr.push(1);
        arr.push(2);
        arr.push(3);
    }

    function get(uint256 _index) public view returns (uint256) {
        return arr[_index];
    }

    function length() public view returns (uint256) {
        return arr.length;
    }
}
```

Query contract to use:

```solidity
contract ArrayReader {
    function read(IArray array) public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](array.length());
        for (uint256 i = 0; i < array.length(); i++) {
            result[i] = array.get(i);
        }
        return result;
    }
}
```

### Use with ethers 6

```typescript
  const ArrayReaderInterface = new Interface([
    'function read(address) view returns (uint256[])',
  ])

  const callData = ArrayReaderInterface.encodeFunctionData('read', [Array.address])
  const bytecodeCallerData = createDataForBytecode(ArrayReader.bytecode, callData)

  const result = await provider.call({
    to: null,
    data: bytecodeCallerData,
  })

  const decodedResult = ArrayReaderInterface.decodeFunctionResult('read', result)
```

### Use with viem

```typescript
    const abi = parseAbi(['function read(address) external view returns (uint256[])'])
    const callData = encodeFunctionData({
      abi,
      functionName: 'read',
      args: [client.contracts.Array.address],
    })

    const byteCodeCallerData = createDataForBytecode(contract.bytecode, callData)
    const result = await client.call({
      to: null,
      data: byteCodeCallerData,
    })

    const decodedResult = decodeFunctionResult({
      abi,
      functionName: 'read',
      data: result.data!,
    })
```

## License

[MIT](LICENSE.md) License
