// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./programs/LD_EduProgram.sol";
import "./LD_EventLogger.sol";
import "./interfaces/ILD_EventLogger.sol";
import "./interfaces/ILD_EduProgram.sol";
import "./extensions/EduBounty.sol";

contract LD_ProgramFactory {
    address public immutable implementation;
    address public immutable eventLogger;
    address public immutable treasury;
    uint256 public immutable feeRatio;

    event EventLogger(address indexed eventLogger);

    constructor(address _implementation, uint256 _feeRatio, address _treasury) {
        implementation = _implementation;
        eventLogger = address(new LD_EventLogger(address(this)));
        feeRatio = _feeRatio;
        treasury = _treasury;

        emit EventLogger(eventLogger);
    }

    receive() external payable {
        revert("Ether not accepted directly");
    }

    function createProgram(
        uint256 programId,
        address[] memory managers,
        EduBounty.PrizeConfig[] memory prizeConfig,
        uint256 start,
        uint256 end
    ) external payable returns (address) {
        uint256 totalPrize = 0;
        for (uint256 i = 0; i < prizeConfig.length; i++) {
            totalPrize += prizeConfig[i].prize;
        }
        require(msg.value >= totalPrize, "Balance is less than the total reserve amount");

        ERC1967Proxy proxy = new ERC1967Proxy(implementation, "");
        ILD_EduProgram(address(proxy)).initialize{value: msg.value}(
            msg.sender, managers, programId, feeRatio, treasury, prizeConfig, start, end, eventLogger
        );

        // ILD_EduProgram(address(proxy)).deposit();
        ILD_EventLogger(eventLogger).logProgramCreated(programId, address(proxy), msg.sender, start, end);

        return address(proxy);
    }
}
