// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";

contract Deploy is Script {
    function test() public {}
    function setUp() public {
        // 스크립트 초기 셋업
    }

    function run() public {
        vm.broadcast();

        // do something...
    }
}
