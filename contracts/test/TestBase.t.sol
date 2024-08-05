// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../src/LD_ProgramFactory.sol";
import "../src/programs/LD_EduProgram.sol";

contract TestBase is Test {
    uint256 sepoliaFork;

    LD_ProgramFactory public factory;
    LD_EduProgram public programImpl;
    address payable public program;

    address public deployer = 0xeA4a5BA5b31D585116D6921A859F0c39707771B3;
    address public manager1 = 0x10737C446a26fFB758183F7ac4b34028cc1DF816;
    address public manager2 = 0x11bfea2a083f06148137f52f023D7D3fdD12F3fb;

    address public auditor = 0x37D734F42f4F861b2591b7cEAA1e261b7F12d550;
    address public newAuditor = 0x6336e2146Eb04F38e0b8C4cd7E346DE0b604cF91;

    address public user1 = 0x1b2829d7c70ec264A6Ddb768fbF0CBbDe7f3ED83;
    address public user2 = 0x23614BA53Ef1cD835B7aaa0167413bc22c9B98cc;
    address public user3 = 0x68572F95e6901acd9f839eCed70987Cc1A4bb3De;
    address public treasury = 0x5589813A8d30A454D2269134693B426c91670de3;

    uint256 public mission1PrizeAmount = 100000000000000000;
    uint256 public mission2PrizeAmount = 200000000000000000;
    uint256 public mission3PrizeAmount = 300000000000000000;
    uint256 public mission4PrizeAmount = 400000000000000000;
    uint256 public reserveAmount = 2000000000000000000;

    uint256 public feeRatio = 50000000000000000;

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
    event MissionAdded(uint256 indexed programId, uint256 indexed newMissionNumber, uint256 prize);
    event PrizeAdded(uint256 indexed programId, uint256 indexed missionNumber, uint256 amount, uint256 prize);
    event AuditorChanged(
        uint256 indexed programId, uint256 indexed missionNumber, address oldAuditor, address newAuditor
    );
    event Withdraw(uint256 indexed programId, uint256 amount);

    event EventLogger(address indexed eventLogger);

    function test() public {}

    function generateSig(uint256 programId, uint256 missionNumber, address recipient, uint256 amount)
        public
        returns (bytes memory)
    {
        string[] memory inputs = new string[](8);
        inputs[0] = "node";
        inputs[1] = "./tools/sig-gen.js";
        inputs[2] = vm.toString(block.chainid);
        inputs[3] = vm.toString(program);
        inputs[4] = vm.toString(programId);
        inputs[5] = vm.toString(missionNumber);
        inputs[6] = vm.toString(recipient);
        inputs[7] = vm.toString(amount);
        bytes memory sig = vm.ffi(inputs);

        return sig;
    }

    function prizeConfig() public view returns (EduBounty.PrizeConfig[] memory) {
        EduBounty.PrizeConfig[] memory tempPrizeConfig = new EduBounty.PrizeConfig[](3);
        tempPrizeConfig[0] = EduBounty.PrizeConfig({auditor: auditor, prize: mission1PrizeAmount * 2});
        tempPrizeConfig[1] = EduBounty.PrizeConfig({auditor: auditor, prize: mission2PrizeAmount * 2});
        tempPrizeConfig[2] = EduBounty.PrizeConfig({auditor: auditor, prize: mission3PrizeAmount * 2});

        return tempPrizeConfig;
    }

    function managers() public view returns (address[] memory managers_) {
        managers_ = new address[](2);
        managers_[0] = manager1;
        managers_[1] = manager2;
    }

    function setUp() public {
        sepoliaFork = vm.createSelectFork("https://ethereum-sepolia-rpc.publicnode.com");
        vm.deal(deployer, 100 ether);
        vm.deal(manager1, 100 ether);
        vm.deal(manager2, 100 ether);
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
        vm.startPrank(deployer);
        programImpl = new LD_EduProgram();
        factory = new LD_ProgramFactory(address(programImpl), feeRatio, treasury);
        program =
            payable(factory.createProgram{value: reserveAmount}(1, managers(), prizeConfig(), 1722076816, 1832676816));
    }
}
