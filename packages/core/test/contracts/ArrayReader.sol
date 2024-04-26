// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IArray {
    function get(uint256 _index) external view returns (uint256);
    function length() external view returns (uint256);
}

contract ArrayReader {
    function read(IArray array) public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](array.length());
        for (uint256 i = 0; i < array.length(); i++) {
            result[i] = array.get(i);
        }
        return result;
    }
}
