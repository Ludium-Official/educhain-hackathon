// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EventLogger.sol";

contract EventLogging is Test {
    uint256 sepoliaFork;
    LD_ProgramFactory public factory;
    address payable public program;
    address public deployer = 0xeA4a5BA5b31D585116D6921A859F0c39707771B3;

    address public user1 = 0x1b2829d7c70ec264A6Ddb768fbF0CBbDe7f3ED83;
    address public user2 = 0x23614BA53Ef1cD835B7aaa0167413bc22c9B98cc;
    address public user3 = 0x68572F95e6901acd9f839eCed70987Cc1A4bb3De;
    address public treasury = 0x5589813A8d30A454D2269134693B426c91670de3;

    address public validator = 0x37D734F42f4F861b2591b7cEAA1e261b7F12d550;
    address public newValidator = 0x6336e2146Eb04F38e0b8C4cd7E346DE0b604cF91;

    address public eventlogger = 0x2E41aEb0Ff18ADF2F439E8B9C21eBE7C94333Abd;

    uint256[2][] prizeConfig;

    event ProgramCreated(
        uint256 indexed programId, address indexed programAddress, address indexed owner, uint256 start, uint256 end
    );
    event PrizeClaimed(
        uint256 indexed programId,
        uint256 indexed chapterIndex,
        address indexed recipient,
        uint256 reserve,
        uint256 amount
    );
    event ChapterAdded(uint256 indexed programId, uint256 indexed newChapterIndex, uint256 reserve, uint256 prize);
    event ValidatorChanged(address indexed oldValidator, address indexed newValidator);
    event Withdraw(uint256 indexed programId, uint256 amount);

    function generateSig(uint256 programId, uint256 chapterIndex, address recipient) public returns (bytes memory) {
        string[] memory inputs = new string[](7);
        inputs[0] = "node";
        inputs[1] = "./tools/sig-gen.js";
        inputs[2] = vm.toString(block.chainid);
        inputs[3] = vm.toString(program);
        inputs[4] = vm.toString(programId);
        inputs[5] = vm.toString(chapterIndex);
        inputs[6] = vm.toString(recipient);
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
            payable(factory.createProgram{value: 120000000000000000}(1, validator, prizeConfig, 1722076816, 1832676816));
    }

    function test_MakeProgram() public {
        vm.startPrank(user1);
        vm.expectEmit(true, false, true, true);
        emit ProgramCreated(2, address(0), user1, 1722076816, 1832676816);
        factory.createProgram{value: 600000000000000000}(2, validator, prizeConfig, 1722076816, 1832676816);
        vm.stopPrank();
    }

    function test_Claim() public {
        bytes memory sig = generateSig(1, 1, user1);
        uint256 initialBalance = user1.balance;
        vm.startPrank(user1);
        vm.expectEmit(true, true, true, false);
        emit PrizeClaimed(1, 1, user1, 0, 0);
        ILD_EduProgram(program).claim(1, 1, user1, sig);
        vm.stopPrank();
        uint256 afterBalance = user1.balance;
        uint256 feeAmount = (10000000000000000 * 50000000000000000) / 1 ether;
        uint256 recipientAmount = 10000000000000000 - feeAmount;

        assertEq(afterBalance - initialBalance, recipientAmount);
        assertEq(treasury.balance, feeAmount);
    }

    function test_AddChapter() public {
        vm.startPrank(deployer);
        vm.expectEmit(true, true, true, true);
        emit ChapterAdded(1, 4, 80000000000000000, 40000000000000000);
        ILD_EduProgram(program).addChapter{value: 80000000000000000}(80000000000000000, 40000000000000000);
        vm.stopPrank();
    }

    function test_ChageValidator() public {
        vm.startPrank(deployer);
        vm.expectEmit(true, true, true, true);
        emit ValidatorChanged(validator, newValidator);
        ILD_EduProgram(program).setValidator(newValidator);
        vm.stopPrank();
    }

    function test_Withdraw() public {
        vm.warp(1832676817);
        vm.startPrank(deployer);
        vm.expectEmit(true, true, false, true);
        emit Withdraw(1, 120000000000000000);
        ILD_EduProgram(program).withdraw();
        vm.stopPrank();
    }
}
