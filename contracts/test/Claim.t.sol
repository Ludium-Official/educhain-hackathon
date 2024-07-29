// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";
import "../src/interfaces/ILD_EduProgram.sol";

contract Claim is Test {
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
        string[] memory inputs = new string[](6);
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
            payable(factory.createProgram{value: 120000000000000000}(1, validator, prizeConfig, 1722076816, 1722676816));
    }

    function test_Claim() public {
        bytes memory sig = generateSig(1, 1, user1);
        uint256 initialBalance = user1.balance;
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, sig);
        vm.stopPrank();
        uint256 afterBalance = user1.balance;
        uint256 feeAmount = (10000000000000000 * 50000000000000000) / 1 ether;
        uint256 recipientAmount = 10000000000000000 - feeAmount;

        assertEq(afterBalance - initialBalance, recipientAmount);
        assertEq(treasury.balance, feeAmount);
    }

    function test_Revert_Sender() public {
        bytes memory sig = generateSig(1, 1, user1);
        vm.startPrank(user2);
        vm.expectRevert("Must be requested by the approved recipient address");
        ILD_EduProgram(program).claim(1, 1, user1, sig);
        vm.stopPrank();
    }

    function test_Revert_ProgramId() public {
        bytes memory sig = generateSig(2, 1, user1);
        vm.startPrank(user1);
        vm.expectRevert("Invalid program id");
        ILD_EduProgram(program).claim(2, 1, user1, sig);
        vm.stopPrank();
    }

    function test_Revert_ChapterIndex() public {
        bytes memory sig = generateSig(1, 4, user1);
        vm.startPrank(user1);
        vm.expectRevert("Invalid chapter");
        ILD_EduProgram(program).claim(1, 4, user1, sig);
        vm.stopPrank();
    }

    function test_Revert_Recipient() public {
        bytes memory sig = generateSig(1, 1, user1);
        vm.startPrank(user2);
        vm.expectRevert("Invalid signature");
        ILD_EduProgram(program).claim(1, 1, user2, sig);
        vm.stopPrank();
    }

    function test_Revert_Chapter() public {
        bytes memory sig = generateSig(1, 1, user1);
        vm.startPrank(user1);
        vm.expectRevert("Invalid signature");
        ILD_EduProgram(program).claim(1, 2, user1, sig);
        vm.stopPrank();
    }

    function test_Revert_ClaimTwiceWithSameRecipient() public {
        bytes memory sig1 = generateSig(1, 1, user1);
        bytes memory sig2 = generateSig(1, 1, user1);
        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, sig1);
        vm.expectRevert("Already claimed recipient");
        ILD_EduProgram(program).claim(1, 1, user1, sig2);
        vm.stopPrank();
    }

    function test_Revert_InsufficientReserve() public {
        bytes memory sig1 = generateSig(1, 1, user1);
        bytes memory sig2 = generateSig(1, 1, user2);
        bytes memory sig3 = generateSig(1, 1, user3);

        vm.startPrank(user1);
        ILD_EduProgram(program).claim(1, 1, user1, sig1);
        vm.stopPrank();

        vm.startPrank(user2);
        ILD_EduProgram(program).claim(1, 1, user2, sig2);
        vm.stopPrank();

        vm.startPrank(user3);
        vm.expectRevert("Insufficient reserve balance");
        ILD_EduProgram(program).claim(1, 1, user3, sig3);
        vm.stopPrank();
    }
}
