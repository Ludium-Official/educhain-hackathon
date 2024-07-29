// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";

contract Deploy is Script {
    // test coverage bypassing
    function test() public {}

    function run() public {
        vm.startBroadcast(0x05c190619e57f47a402dab4386a8ee87de0421e8e43dd1caed522bf44d6d4121);
        LD_EduProgram eduProgram = new LD_EduProgram();
        new LD_ProgramFactory(
            address(eduProgram), 50000000000000000, payable(address(0x1acDF5aa05372de83EEA17a2df300A0f1731317B))
        );
        vm.stopBroadcast();
        // do something...
    }
}
