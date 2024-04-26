// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Array {
    uint256[] public arr;

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
