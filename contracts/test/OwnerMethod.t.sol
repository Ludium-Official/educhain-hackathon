// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EduProgram.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./TestBase.t.sol";

contract OwnerMethod is Test, TestBase {
    function test_AddMission() public {
        // add mission
        uint256 preBal = ILD_EduProgram(program).reserve();
        vm.startPrank(manager1);
        ILD_EduProgram(program).addMission(auditor, mission4PrizeAmount * 2);
        vm.stopPrank();
        uint256 postBal = ILD_EduProgram(program).reserve();
        assertEq(preBal, postBal + mission4PrizeAmount * 2);

        // claim mission4
        vm.startPrank(user1);
        bytes memory sig = generateSig(1, 4, user1, mission4PrizeAmount);
        uint256 initialBalance = user1.balance;
        ILD_EduProgram(program).claim(1, 4, user1, mission4PrizeAmount, sig);
        vm.stopPrank();

        // balance check
        uint256 afterBalance = user1.balance;
        uint256 feeAmount = (mission4PrizeAmount * feeRatio) / 1 ether;
        uint256 recipientAmount = mission4PrizeAmount - feeAmount;

        assertEq(afterBalance - initialBalance, recipientAmount);
        assertEq(treasury.balance, feeAmount);
    }

    function test_AddMissionWithDeposit() public {
        // add mission
        uint256 preBal = ILD_EduProgram(program).reserve();
        vm.startPrank(manager1);
        ILD_EduProgram(program).addMissionWithDeposit{value: mission4PrizeAmount * 2}(auditor);
        vm.stopPrank();
        uint256 postBal = ILD_EduProgram(program).reserve();
        assertEq(preBal, postBal);

        // claim mission4
        vm.startPrank(user1);
        bytes memory sig = generateSig(1, 4, user1, mission4PrizeAmount);
        uint256 initialBalance = user1.balance;
        ILD_EduProgram(program).claim(1, 4, user1, mission4PrizeAmount, sig);
        vm.stopPrank();

        // balance check
        uint256 afterBalance = user1.balance;
        uint256 feeAmount = (mission4PrizeAmount * feeRatio) / 1 ether;
        uint256 recipientAmount = mission4PrizeAmount - feeAmount;

        assertEq(afterBalance - initialBalance, recipientAmount);
        assertEq(treasury.balance, feeAmount);
    }

    function test_AddPrize() public {
        // claim mission1 by user1
        vm.startPrank(user1);
        bytes memory sig1 = generateSig(1, 1, user1, mission1PrizeAmount);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig1);
        vm.stopPrank();

        // claim mission1 by user2
        vm.startPrank(user2);
        bytes memory sig2 = generateSig(1, 1, user2, mission1PrizeAmount);
        ILD_EduProgram(program).claim(1, 1, user2, mission1PrizeAmount, sig2);
        vm.stopPrank();

        // expect revert, insufficient prize
        vm.startPrank(user3);
        bytes memory sig3 = generateSig(1, 1, user3, mission1PrizeAmount);
        vm.expectRevert("Insufficient prize balance");
        ILD_EduProgram(program).claim(1, 1, user3, mission1PrizeAmount, sig3);
        vm.stopPrank();

        // add prize
        uint256 preBal = ILD_EduProgram(program).reserve();
        vm.startPrank(manager1);
        ILD_EduProgram(program).addPrize(1, mission1PrizeAmount);
        vm.stopPrank();
        uint256 postBal = ILD_EduProgram(program).reserve();
        assertEq(preBal, postBal + mission1PrizeAmount);

        // expect success
        vm.startPrank(user3);
        ILD_EduProgram(program).claim(1, 1, user3, mission1PrizeAmount, sig3);
        vm.stopPrank();
    }

    function test_AddPrizeWithDeposit() public {
        // claim mission1 by user1
        vm.startPrank(user1);
        bytes memory sig1 = generateSig(1, 1, user1, mission1PrizeAmount);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig1);
        vm.stopPrank();

        // claim mission1 by user2
        vm.startPrank(user2);
        bytes memory sig2 = generateSig(1, 1, user2, mission1PrizeAmount);
        ILD_EduProgram(program).claim(1, 1, user2, mission1PrizeAmount, sig2);
        vm.stopPrank();

        // expect revert, insufficient prize
        vm.startPrank(user3);
        bytes memory sig3 = generateSig(1, 1, user3, mission1PrizeAmount);
        vm.expectRevert("Insufficient prize balance");
        ILD_EduProgram(program).claim(1, 1, user3, mission1PrizeAmount, sig3);
        vm.stopPrank();

        // add prize
        uint256 preBal = ILD_EduProgram(program).reserve();
        vm.startPrank(manager1);
        ILD_EduProgram(program).addPrizeWithDeposit{value: mission1PrizeAmount}(1);
        vm.stopPrank();
        uint256 postBal = ILD_EduProgram(program).reserve();
        assertEq(preBal, postBal);

        // expect success
        vm.startPrank(user3);
        ILD_EduProgram(program).claim(1, 1, user3, mission1PrizeAmount, sig3);
        vm.stopPrank();
    }

    function test_Revert_AddMission_InsufficientReserve() public {
        // add chapter
        vm.startPrank(manager1);
        vm.expectRevert("Insufficient balance");
        ILD_EduProgram(program).addMission(auditor, type(uint256).max);
        vm.stopPrank();
    }

    function test_Withdraw() public {
        bytes memory sig = generateSig(1, 1, user1, mission1PrizeAmount);
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig);
        vm.stopPrank();

        uint256 beforeBalance = deployer.balance;
        vm.warp(1832676817);
        vm.startPrank(deployer);
        ILD_EduProgram(program).withdraw();
        vm.stopPrank();
        uint256 afterBalance = deployer.balance;
        assertEq(afterBalance - beforeBalance, reserveAmount - mission1PrizeAmount);
    }

    function test_Revert_Withdraw() public {
        bytes memory sig = generateSig(1, 1, user1, mission1PrizeAmount);
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig);
        vm.stopPrank();

        vm.warp(1832676817);
        vm.startPrank(manager1);
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, manager1));
        ILD_EduProgram(program).withdraw();
        vm.stopPrank();
    }

    function test_Revert_WithdrawBeforeEnd() public {
        vm.startPrank(deployer);
        vm.expectRevert("Withdrawals can only be made after the program has ended");
        ILD_EduProgram(program).withdraw();
        vm.stopPrank();
    }

    function test_UpgradeProxy() public {
        // claim
        bytes memory sig = generateSig(1, 1, user1, mission1PrizeAmount);
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig);
        vm.stopPrank();

        // upgrade to new impl.
        vm.startPrank(deployer);
        LD_EduProgram newProgramImpl = new LD_EduProgram();
        UUPSUpgradeable(program).upgradeToAndCall(address(newProgramImpl), "");
        vm.stopPrank();

        // check claim
        vm.startPrank(user1);
        vm.expectRevert("Already claimed recipient");
        ILD_EduProgram(program).claim(1, 1, user1, mission1PrizeAmount, sig);
        vm.stopPrank();
    }

    function test_AddManager() public {
        // deployer adds user1
        vm.startPrank(deployer);
        ILD_EduProgram(program).addManager(user1);
        vm.stopPrank();

        // Check if user1 can now perform manager actions
        vm.startPrank(user1);
        ILD_EduProgram(program).addManager(user2);
        vm.stopPrank();

        // Check if user2 can now perform manager actions
        vm.startPrank(user2);
        ILD_EduProgram(program).removeManager(manager1); // user2 removes manager1
        vm.stopPrank();

        // Check if manager1 is indeed removed
        vm.startPrank(manager1);
        vm.expectRevert("Caller is not the owner or a manager");
        ILD_EduProgram(program).removeManager(manager2);
        vm.stopPrank();
    }

    function test_RemoveManager() public {
        // manager1 removes manager2
        vm.startPrank(manager1);
        ILD_EduProgram(program).removeManager(manager2);
        vm.stopPrank();

        // Check if manager2 is indeed removed
        vm.startPrank(manager2);
        vm.expectRevert("Caller is not the owner or a manager");
        ILD_EduProgram(program).addManager(user1); // manager2 tries to add user1
        vm.stopPrank();
    }

    function test_UnauthorizedManagerActions() public {
        // user1 attempts to add a manager
        vm.startPrank(user1);
        vm.expectRevert("Caller is not the owner or a manager");
        ILD_EduProgram(program).addManager(user2);
        vm.stopPrank();

        // user2 attempts to remove a manager
        vm.startPrank(user2);
        vm.expectRevert("Caller is not the owner or a manager");
        ILD_EduProgram(program).removeManager(user1);
        vm.stopPrank();
    }

    function test_AddExistingManager() public {
        vm.startPrank(manager1);
        vm.expectRevert("Address is already a manager");
        ILD_EduProgram(program).addManager(manager2);
        vm.stopPrank();
    }

    function test_RemoveNonExistingManager() public {
        vm.startPrank(manager1);
        vm.expectRevert("Address is not a manager");
        ILD_EduProgram(program).removeManager(user1);
        vm.stopPrank();
    }
}
