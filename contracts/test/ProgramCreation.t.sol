// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LDBountyFactory.sol";

contract ProgramCreation is Test {
    uint256 sepoliaFork;
    LDBountyFactory public factory;
    address public deployer = 0xeA4a5BA5b31D585116D6921A859F0c39707771B3;
    address public user1 = 0x1b2829d7c70ec264A6Ddb768fbF0CBbDe7f3ED83;
    address public user2 = 0x23614BA53Ef1cD835B7aaa0167413bc22c9B98cc;
    uint256[2][] prizeConfig;

    function setUp() public {
        sepoliaFork = vm.createSelectFork("https://ethereum-sepolia-rpc.publicnode.com");
        prizeConfig = new uint256[2][](3);
        prizeConfig[0] = [uint256(100000000000000000), uint256(10000000000000000)];
        prizeConfig[1] = [uint256(200000000000000000), uint256(20000000000000000)];
        prizeConfig[2] = [uint256(300000000000000000), uint256(30000000000000000)];
        vm.deal(user1, 10 ether);
        vm.startPrank(deployer);
        LDBounty bounty = new LDBounty();
        factory = new LDBountyFactory(address(bounty), 50000000000000000, deployer);
        vm.stopPrank();
    }

    function test_MakeProgram() public {
        vm.startPrank(user1);
        factory.createProgram{value: 600000000000000000}(1, user1, prizeConfig, 1722076816, 1832676816);
        vm.stopPrank();
    }

    function test_Revert_InsufficientAmount() public {
        vm.startPrank(user1);
        vm.expectRevert("Balance is less than the total reserve amount");
        factory.createProgram{value: 500000000000000000}(1, user1, prizeConfig, 1722076816, 1832676816);
        vm.stopPrank();
    }

    function test_Revert_InvalidTime() public {
        vm.startPrank(user1);
        vm.expectRevert("End date must be after start date");
        factory.createProgram{value: 600000000000000000}(1, user1, prizeConfig, 1832676816, 1722076816);
        vm.stopPrank();
    }

    function test_Revert_ExpiredTime() public {
        vm.startPrank(user1);
        vm.expectRevert("End date must be in the future");
        factory.createProgram{value: 600000000000000000}(1, user1, prizeConfig, 1722076816, 1722076820);
        vm.stopPrank();
    }

    function test_Revert_ZeroAddressValidator() public {
        vm.startPrank(user1);
        vm.expectRevert("Validator address cannot be the zero address");
        factory.createProgram{value: 600000000000000000}(1, address(0), prizeConfig, 1722076816, 1832676816);
        vm.stopPrank();
    }

    function test_Revert_MakeTwice() public {
        vm.startPrank(user1);
        factory.createProgram{value: 600000000000000000}(1, user1, prizeConfig, 1722076816, 1832676816);
        vm.expectRevert("Already created program");
        factory.createProgram{value: 600000000000000000}(1, user1, prizeConfig, 1722076816, 1832676816);
        vm.stopPrank();
    }
}
