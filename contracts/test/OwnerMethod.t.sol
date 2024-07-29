// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EduProgram.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract OwnerMethod is Test {
    uint256 sepoliaFork;
    LD_ProgramFactory public factory;
    address payable public program;
    address public deployer = 0xeA4a5BA5b31D585116D6921A859F0c39707771B3;

    address public user1 = 0x1b2829d7c70ec264A6Ddb768fbF0CBbDe7f3ED83;
    address public user2 = 0x23614BA53Ef1cD835B7aaa0167413bc22c9B98cc;
    address public user3 = 0x68572F95e6901acd9f839eCed70987Cc1A4bb3De;
    address public treasury = 0x5589813A8d30A454D2269134693B426c91670de3;

    address public validator = 0x37D734F42f4F861b2591b7cEAA1e261b7F12d550;

    address public eventlogger = 0x2E41aEb0Ff18ADF2F439E8B9C21eBE7C94333Abd;

    uint256[2][] prizeConfig;

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
        vm.deal(user1, 10 ether);
        vm.startPrank(deployer);
        LD_EduProgram programImpl = new LD_EduProgram();
        factory = new LD_ProgramFactory(address(programImpl), 50000000000000000, treasury);
        prizeConfig = new uint256[2][](3);
        prizeConfig[0] = [uint256(20000000000000000), uint256(10000000000000000)];
        prizeConfig[1] = [uint256(40000000000000000), uint256(20000000000000000)];
        prizeConfig[2] = [uint256(60000000000000000), uint256(30000000000000000)];
        program =
            payable(factory.createProgram{value: 120000000000000000}(1, validator, prizeConfig, 1722076816, 1722676816));
    }

    function test_AddChapter() public {
        // add chapter
        vm.startPrank(deployer);
        ILD_EduProgram(program).addChapter{value: 80000000000000000}(80000000000000000, 40000000000000000);
        vm.stopPrank();

        // claim chapter4
        vm.startPrank(user1);
        bytes memory sig = generateSig(1, 4, user1);
        uint256 initialBalance = user1.balance;
        ILD_EduProgram(program).claim(1, 4, user1, sig);
        vm.stopPrank();

        // balance check
        uint256 afterBalance = user1.balance;
        uint256 feeAmount = (40000000000000000 * 50000000000000000) / 1 ether;
        uint256 recipientAmount = 40000000000000000 - feeAmount;

        assertEq(afterBalance - initialBalance, recipientAmount);
        assertEq(treasury.balance, feeAmount);
    }

    function test_Revert_AddChapter_Insufficient() public {
        // add chapter
        vm.startPrank(deployer);
        vm.expectRevert("Insufficient balance");
        ILD_EduProgram(program).addChapter{value: 70000000000000000}(80000000000000000, 40000000000000000);
        vm.stopPrank();
    }

    function test_Withdraw() public {
        bytes memory sig = generateSig(1, 1, user1);
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, sig);
        vm.stopPrank();

        uint256 beforeBalance = deployer.balance;
        vm.warp(1832676817);
        vm.startPrank(deployer);
        ILD_EduProgram(program).withdraw();
        vm.stopPrank();
        uint256 afterBalance = deployer.balance;
        assertEq(afterBalance - beforeBalance, 120000000000000000 - 10000000000000000);
    }

    function test_Revert_WithdrawBeforeEnd() public {
        vm.startPrank(deployer);
        vm.expectRevert("Withdrawals can only be made after the program has ended");
        ILD_EduProgram(program).withdraw();
        vm.stopPrank();
    }

    function test_UpgradeProxy() public {
        // claim
        bytes memory sig = generateSig(1, 1, user1);
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, sig);
        vm.stopPrank();

        // upgrade to new impl.
        vm.startPrank(deployer);
        LD_EduProgram newProgramImpl = new LD_EduProgram();
        UUPSUpgradeable(program).upgradeToAndCall(address(newProgramImpl), "");
        vm.stopPrank();

        // check claim
        vm.startPrank(user1);
        vm.expectRevert("Already claimed recipient");
        ILD_EduProgram(program).claim(1, 1, user1, sig);
        vm.stopPrank();
    }
}
