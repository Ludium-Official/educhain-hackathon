// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EventLogger.sol";
import "./TestBase.t.sol";

contract EventLogging is Test, TestBase {
    function test_MakeProgram() public {
        vm.startPrank(user1);
        vm.expectEmit(true, false, true, true);
        emit ProgramCreated(2, address(0), user1, 1722076816, 1832676816);
        factory.createProgram{value: reserveAmount}(2, managers(), prizeConfig(), 1722076816, 1832676816);
        vm.stopPrank();
    }

    function test_Claim() public {
        bytes memory sig = generateSig(1, 1, user1, mission1PrizeAmount);
        uint256 initialBalance = user1.balance;
        vm.startPrank(user1);
        vm.expectEmit(true, true, true, false);
        emit PrizeClaimed(1, 1, user1, 0, 0);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig);
        vm.stopPrank();
        uint256 afterBalance = user1.balance;
        uint256 feeAmount = (mission1PrizeAmount * feeRatio) / 1 ether;
        uint256 recipientAmount = mission1PrizeAmount - feeAmount;

        assertEq(afterBalance - initialBalance, recipientAmount);
        assertEq(treasury.balance, feeAmount);
    }

    function test_Revert_UnauthorizedCall_ProgramCreated() public {
        vm.startPrank(user1);
        address eventLoggerAddr = factory.eventLogger();
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, user1));
        ILD_EventLogger(eventLoggerAddr).logProgramCreated(2, user1, user1, 1722076816, 1832676816);
        vm.stopPrank();
    }

    function test_Revert_UnauthorizedCall_Claim() public {
        vm.startPrank(user1);
        address eventLoggerAddr = factory.eventLogger();
        vm.expectRevert("Caller is not a valid program");
        ILD_EventLogger(eventLoggerAddr).logPrizeClaimed(1, 1, user1, mission1PrizeAmount, mission1PrizeAmount);
        vm.stopPrank();
    }

    function test_AddMission() public {
        vm.startPrank(deployer);
        vm.expectEmit(true, true, true, true);
        emit MissionAdded(1, 4, mission4PrizeAmount * 2);
        ILD_EduProgram(program).addMission(auditor, mission4PrizeAmount * 2);
        vm.stopPrank();
    }

    function test_AddPrize() public {
        vm.startPrank(deployer);
        vm.expectEmit(true, true, true, true);
        emit PrizeAdded(1, 1, mission1PrizeAmount * 2, mission1PrizeAmount * 4);
        ILD_EduProgram(program).addPrize(1, mission1PrizeAmount * 2);
        vm.stopPrank();
    }

    function test_ChageAuditor() public {
        vm.startPrank(deployer);
        vm.expectEmit(true, true, true, true);
        emit AuditorChanged(1, 1, auditor, newAuditor);
        ILD_EduProgram(program).setAuditor(1, newAuditor);
        vm.stopPrank();
    }

    function test_Withdraw() public {
        vm.warp(1832676817);
        vm.startPrank(deployer);
        vm.expectEmit(true, true, false, true);
        emit Withdraw(1, reserveAmount);
        ILD_EduProgram(program).withdraw();
        vm.stopPrank();
    }
}
