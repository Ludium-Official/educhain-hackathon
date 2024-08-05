// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EduProgram.sol";
import "./TestBase.t.sol";

contract Claim is Test, TestBase {
    function test_Claim() public {
        bytes memory sig = generateSig(1, 1, user1, mission1PrizeAmount);
        uint256 initialBalance = user1.balance;
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig);
        vm.stopPrank();
        uint256 afterBalance = user1.balance;
        uint256 feeAmount = (mission1PrizeAmount * feeRatio) / 1 ether;
        uint256 recipientAmount = mission1PrizeAmount - feeAmount;

        assertEq(afterBalance - initialBalance, recipientAmount);
        assertEq(treasury.balance, feeAmount);
    }

    function test_Revert_Sender() public {
        bytes memory sig = generateSig(1, 1, user1, mission1PrizeAmount);
        vm.startPrank(user2);
        vm.expectRevert("Must be requested by the approved recipient address");
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig);
        vm.stopPrank();
    }

    function test_Revert_ProgramId() public {
        bytes memory sig = generateSig(2, 1, user1, mission1PrizeAmount);
        vm.startPrank(user1);
        vm.expectRevert("Invalid program id");
        ILD_EduProgram(program).claim(2, 1, user1, mission1PrizeAmount, sig);
        vm.stopPrank();
    }

    function test_Revert_MissionIndex() public {
        bytes memory sig = generateSig(1, 4, user1, mission1PrizeAmount);
        vm.startPrank(user1);
        vm.expectRevert("Invalid mission");
        ILD_EduProgram(program).claim(1, 4, user1, mission1PrizeAmount, sig);
        vm.stopPrank();
    }

    function test_Revert_Recipient() public {
        bytes memory sig = generateSig(1, 1, user1, mission1PrizeAmount);
        vm.startPrank(user2);
        vm.expectRevert("Invalid signature");
        ILD_EduProgram(program).claim(1, 1, user2, mission1PrizeAmount, sig);
        vm.stopPrank();
    }

    function test_Revert_Mission() public {
        bytes memory sig = generateSig(1, 1, user1, mission1PrizeAmount);
        vm.startPrank(user1);
        vm.expectRevert("Invalid signature");
        ILD_EduProgram(program).claim(1, 2, user1, mission1PrizeAmount, sig);
        vm.stopPrank();
    }

    function test_Revert_ClaimTwiceWithSameRecipient() public {
        bytes memory sig1 = generateSig(1, 1, user1, mission1PrizeAmount);
        bytes memory sig2 = generateSig(1, 1, user1, mission1PrizeAmount);
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig1);
        vm.expectRevert("Already claimed recipient");
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig2);
        vm.stopPrank();
    }

    function test_Revert_InsufficientPrize() public {
        bytes memory sig1 = generateSig(1, 1, user1, mission1PrizeAmount);
        bytes memory sig2 = generateSig(1, 1, user2, mission1PrizeAmount);
        bytes memory sig3 = generateSig(1, 1, user3, mission1PrizeAmount);

        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig1);
        vm.stopPrank();

        vm.startPrank(user2);
        ILD_EduProgram(program).claim(1, 1, user2, mission1PrizeAmount, sig2);
        vm.stopPrank();

        vm.startPrank(user3);
        vm.expectRevert("Insufficient prize balance");
        ILD_EduProgram(program).claim(1, 1, user3, mission1PrizeAmount, sig3);
        vm.stopPrank();
    }
}
