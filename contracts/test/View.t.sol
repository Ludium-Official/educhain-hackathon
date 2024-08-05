// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EduProgram.sol";
import "./TestBase.t.sol";

contract View is Test, TestBase {
    function test_ProgramId() public view {
        assertEq(ILD_EduProgram(program).programId(), 1);
    }

    function test_ProgramDuration() public view {
        uint256[2] memory duration = ILD_EduProgram(program).programDuration();
        assertEq(duration[0], 1722076816);
        assertEq(duration[1], 1832676816);
    }

    function test_FeeRatio() public view {
        assertEq(ILD_EduProgram(program).feeRatio(), feeRatio);
    }

    function test_Treasury() public view {
        assertEq(ILD_EduProgram(program).treasury(), treasury);
    }

    function test_Auditor() public view {
        assertEq(ILD_EduProgram(program).auditor(1), auditor);
        assertEq(ILD_EduProgram(program).auditor(2), auditor);
        assertEq(ILD_EduProgram(program).auditor(3), auditor);
    }

    function test_TotalMissions() public view {
        assertEq(ILD_EduProgram(program).totalMissions(), 3);
    }

    function test_ReserveAndPrize() public view {
        uint256 prize1 = ILD_EduProgram(program).prize(1);
        assertEq(prize1, mission1PrizeAmount * 2);

        uint256 prize2 = ILD_EduProgram(program).prize(2);
        assertEq(prize2, mission2PrizeAmount * 2);

        uint256 prize3 = ILD_EduProgram(program).prize(3);
        assertEq(prize3, mission3PrizeAmount * 2);

        uint256 reserve = ILD_EduProgram(program).reserve();
        assertEq(reserve, reserveAmount - prize1 - prize2 - prize3);
    }

    function test_UpgradeProxy() public {
        // upgrade to new impl.
        vm.startPrank(deployer);
        LD_EduProgram newProgramImpl = new LD_EduProgram();
        UUPSUpgradeable(program).upgradeToAndCall(address(newProgramImpl), "");
        vm.stopPrank();

        // view
        test_ProgramId();
        test_ProgramDuration();
        test_FeeRatio();
        test_Treasury();
        test_Auditor();
        test_ReserveAndPrize();
    }
}
