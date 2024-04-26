import fs from 'node:fs'

function getContract(fileName: string, contractName: string) {
  fileName = fileName.replace('.', '_')
  return fs.readFileSync(`./test/build/test_contracts_${fileName}_${contractName}.bin`).toString()
}

export const contracts = {
  Array: getContract('Array.sol', 'Array'),
}
