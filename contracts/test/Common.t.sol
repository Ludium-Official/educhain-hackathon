// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EduProgram.sol";
import "./TestBase.t.sol";

contract Common is Test, TestBase {
    function test_deposit() public {
        uint256 preBal = ILD_EduProgram(program).reserve();
        vm.startPrank(manager1);
        ILD_EduProgram(program).deposit{value: mission1PrizeAmount}();
        vm.stopPrank();
        uint256 postBal = ILD_EduProgram(program).reserve();
        assertEq(preBal, postBal - mission1PrizeAmount);
    }

    function test_Revert_SendEther_ToProxy() public {
        vm.startPrank(user1);
        (bool success, bytes memory data) = payable(program).call{value: 0.1 ether}("");

        assertEq(success, false);
        assertEq(data, abi.encodeWithSignature("Error(string)", "To add contract balance, use the deposit()"));
        vm.stopPrank();
    }

    function test_Revert_SendEther_ToFactory() public {
        vm.startPrank(user1);
        (bool success, bytes memory data) = payable(factory).call{value: 0.1 ether}("");

        assertEq(success, false);
        assertEq(data, abi.encodeWithSignature("Error(string)", "Ether not accepted directly"));
        vm.stopPrank();
    }
}
