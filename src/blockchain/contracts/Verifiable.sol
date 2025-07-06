// SPDX-License-Identifier: MIT
// Hedera Testnet
// Contract Address: 0x42dc444aa142f78a8de8c7304bbbcd5b6581fe32

pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
