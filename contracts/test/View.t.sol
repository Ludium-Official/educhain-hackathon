// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EduProgram.sol";

contract View is Test {
    uint256 sepoliaFork;
    LD_ProgramFactory public factory;
    address payable public program;
    address public deployer = 0xeA4a5BA5b31D585116D6921A859F0c39707771B3;

    address public user1 = 0x1b2829d7c70ec264A6Ddb768fbF0CBbDe7f3ED83;
    address public user2 = 0x23614BA53Ef1cD835B7aaa0167413bc22c9B98cc;
    address public user3 = 0x68572F95e6901acd9f839eCed70987Cc1A4bb3De;
    address public treasury = 0x5589813A8d30A454D2269134693B426c91670de3;

    address public validator = 0x37D734F42f4F861b2591b7cEAA1e261b7F12d550;

    function generateSig(uint256 programId, uint256 chapterIndex, address recipient) public returns (bytes memory) {
        string[] memory inputs = new string[](5);
        inputs[0] = "node";
        inputs[1] = "./tools/sig-gen.js";
        inputs[2] = vm.toString(programId);
        inputs[3] = vm.toString(chapterIndex);
        inputs[4] = vm.toString(recipient);
        bytes memory sig = vm.ffi(inputs);

        return sig;
    }

    function setUp() public {
        sepoliaFork = vm.createSelectFork("https://ethereum-sepolia-rpc.publicnode.com");
        vm.startPrank(deployer);
        LD_EduProgram programImpl = new LD_EduProgram();
        factory = new LD_ProgramFactory(address(programImpl), 50000000000000000, treasury);
        uint256[2][] memory prizeConfig = new uint256[2][](3);
        prizeConfig[0] = [uint256(20000000000000000), uint256(10000000000000000)];
        prizeConfig[1] = [uint256(40000000000000000), uint256(20000000000000000)];
        prizeConfig[2] = [uint256(60000000000000000), uint256(30000000000000000)];
        program =
            payable(factory.createProgram{value: 120000000000000000}(1, validator, prizeConfig, 1722076816, 1832676816));
    }

    function test_ProgramId() public view {
        assertEq(ILD_EduProgram(program).programId(), 1);
    }

    function test_ProgramDuration() public view {
        uint256[2] memory duration = ILD_EduProgram(program).programDuration();
        assertEq(duration[0], 1722076816);
        assertEq(duration[1], 1832676816);
    }

    function test_FeeRatio() public view {
        assertEq(ILD_EduProgram(program).feeRatio(), 50000000000000000);
    }

    function test_Treasury() public view {
        assertEq(ILD_EduProgram(program).treasury(), 0x5589813A8d30A454D2269134693B426c91670de3);
    }

    function test_Validator() public view {
        assertEq(ILD_EduProgram(program).validator(), validator);
    }

    function test_TotalChapter() public view {
        assertEq(ILD_EduProgram(program).totalChapter(), 3);
    }

    function test_ReserveAndPrize() public view {
        uint256[2] memory prize1 = ILD_EduProgram(program).reserveAndPrize(1);
        assertEq(prize1[0], 20000000000000000);
        assertEq(prize1[1], 10000000000000000);

        uint256[2] memory prize2 = ILD_EduProgram(program).reserveAndPrize(2);
        assertEq(prize2[0], 40000000000000000);
        assertEq(prize2[1], 20000000000000000);

        uint256[2] memory prize3 = ILD_EduProgram(program).reserveAndPrize(3);
        assertEq(prize3[0], 60000000000000000);
        assertEq(prize3[1], 30000000000000000);
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
        test_Validator();
        test_ReserveAndPrize();
        test_Validator();
    }
}
