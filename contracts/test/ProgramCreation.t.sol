// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EduProgram.sol";
import "./TestBase.t.sol";

contract ProgramCreation is Test, TestBase {
    function test_Constructor() public view {
        assertEq(factory.implementation(), address(programImpl));
        assertEq(factory.feeRatio(), feeRatio);
        assertEq(factory.treasury(), treasury);
    }

    function test_EventLoggerEmission() public {
        LD_EduProgram newProgramImpl = new LD_EduProgram();
        vm.expectEmit(false, false, false, false);
        emit EventLogger(address(0));
        new LD_ProgramFactory(address(newProgramImpl), feeRatio, deployer);
    }

    function test_MakeProgram() public {
        uint256 totalPrize = 0;
        EduBounty.PrizeConfig[] memory tempPrizeConfig = prizeConfig();
        for (uint256 i = 0; i < tempPrizeConfig.length; i++) {
            totalPrize += tempPrizeConfig[i].prize;
        }
        vm.startPrank(user1);
        address proxyAddress =
            factory.createProgram{value: reserveAmount}(2, managers(), prizeConfig(), 1722076816, 1832676816);
        vm.stopPrank();
        assertNotEq(proxyAddress, address(0));
        assertEq(ILD_EduProgram(proxyAddress).reserve(), reserveAmount - totalPrize);
        assertEq(ILD_EduProgram(proxyAddress).prize(1), tempPrizeConfig[0].prize);
        assertEq(ILD_EduProgram(proxyAddress).prize(2), tempPrizeConfig[1].prize);
        assertEq(ILD_EduProgram(proxyAddress).prize(3), tempPrizeConfig[2].prize);
    }

    function test_MakeProgram_AddMissions() public {
        EduBounty.PrizeConfig[] memory empty;
        EduBounty.PrizeConfig[] memory tempPrizeConfig = prizeConfig();

        vm.startPrank(user1);
        address proxyAddress = factory.createProgram{value: reserveAmount}(2, managers(), empty, 1722076816, 1832676816);
        vm.stopPrank();
        assertEq(ILD_EduProgram(proxyAddress).reserve(), reserveAmount);

        vm.startPrank(manager1);
        uint256 totalPrize = 0;
        for (uint256 i = 0; i < tempPrizeConfig.length; i++) {
            totalPrize += tempPrizeConfig[i].prize;
            ILD_EduProgram(proxyAddress).addMission(auditor, tempPrizeConfig[i].prize);
        }
        vm.stopPrank();
        assertEq(ILD_EduProgram(proxyAddress).reserve(), reserveAmount - totalPrize);
        assertEq(ILD_EduProgram(proxyAddress).prize(1), tempPrizeConfig[0].prize);
        assertEq(ILD_EduProgram(proxyAddress).prize(2), tempPrizeConfig[1].prize);
        assertEq(ILD_EduProgram(proxyAddress).prize(3), tempPrizeConfig[2].prize);
    }

    function test_MakeProgram_NoBalance_AddMissions() public {
        EduBounty.PrizeConfig[] memory empty;
        EduBounty.PrizeConfig[] memory tempPrizeConfig = prizeConfig();

        vm.startPrank(user1);
        address proxyAddress = factory.createProgram(2, managers(), empty, 1722076816, 1832676816);
        vm.stopPrank();
        assertEq(ILD_EduProgram(proxyAddress).reserve(), uint256(0));

        vm.startPrank(manager1);
        for (uint256 i = 0; i < tempPrizeConfig.length; i++) {
            ILD_EduProgram(proxyAddress).addMissionWithDeposit{value: tempPrizeConfig[i].prize}(auditor);
        }
        vm.stopPrank();
        assertEq(ILD_EduProgram(proxyAddress).reserve(), uint256(0));
        assertEq(ILD_EduProgram(proxyAddress).prize(1), tempPrizeConfig[0].prize);
        assertEq(ILD_EduProgram(proxyAddress).prize(2), tempPrizeConfig[1].prize);
        assertEq(ILD_EduProgram(proxyAddress).prize(3), tempPrizeConfig[2].prize);
    }

    function test_Revert_InsufficientAmount() public {
        vm.startPrank(user1);
        vm.expectRevert("Balance is less than the total reserve amount");
        factory.createProgram{value: 0}(2, managers(), prizeConfig(), 1722076816, 1832676816);
        vm.stopPrank();
    }

    function test_Revert_InvalidTime() public {
        vm.startPrank(user1);
        vm.expectRevert("End date must be after start date");
        factory.createProgram{value: reserveAmount}(2, managers(), prizeConfig(), 1832676816, 1722076816);
        vm.stopPrank();
    }

    function test_Revert_ExpiredTime() public {
        vm.startPrank(user1);
        vm.expectRevert("End date must be in the future");
        factory.createProgram{value: reserveAmount}(2, managers(), prizeConfig(), 1722076816, 1722076820);
        vm.stopPrank();
    }
}
