// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
