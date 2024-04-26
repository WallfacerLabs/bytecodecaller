// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FriendWhoWantsMangoes, MangoSeller } from "./FruitMarket.sol";

contract MangoPriceEstimator {
    function estimateExpenses(address friend, address seller) public pure returns (uint256) {
        uint256 mangoesToBuy = FriendWhoWantsMangoes(friend).askHowManyMangoes();
        return MangoSeller(seller).askForMangoesPrice(mangoesToBuy);
    }
}
