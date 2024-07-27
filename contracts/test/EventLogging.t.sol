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

    function generateSig(uint256 programId, uint256 chapterIndex, uint256 submissionId, address recipient)
        public
        returns (bytes memory)
    {
        string[] memory inputs = new string[](6);
        inputs[0] = "node";
        inputs[1] = "./tools/sig-gen.js";
        inputs[2] = vm.toString(programId);
        inputs[3] = vm.toString(chapterIndex);
        inputs[4] = vm.toString(submissionId);
        inputs[5] = vm.toString(recipient);
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
}
