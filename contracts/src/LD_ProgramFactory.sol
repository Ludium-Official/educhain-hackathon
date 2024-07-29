// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./programs/LD_EduProgram.sol";
import "./LD_EventLogger.sol";
import "./interfaces/ILD_EventLogger.sol";

contract LD_ProgramFactory {
    address public immutable implementation;
    address public immutable eventLogger;
    address public immutable treasury;
    uint256 public immutable feeRatio;
    mapping(uint256 => bool) created;

    event EventLogger(address indexed eventLogger);

    constructor(address _implementation, uint256 _feeRatio, address _treasury) {
        implementation = _implementation;
        eventLogger = address(new LD_EventLogger(address(this)));
        feeRatio = _feeRatio;
        treasury = _treasury;

        emit EventLogger(eventLogger);
    }

    function createProgram(
        uint256 programId,
        address validator,
        uint256[2][] memory prizeConfig,
        uint256 start,
        uint256 end
    ) external payable returns (address) {
        require(validator != address(0), "Validator address cannot be the zero address");
        require(!created[programId], "Already created program");
        uint256 totalReserve = 0;
        for (uint256 i = 0; i < prizeConfig.length; i++) {
            totalReserve += prizeConfig[i][0];
        }
        require(msg.value >= totalReserve, "Balance is less than the total reserve amount");

        bytes memory initializeData = abi.encodeWithSelector(
            LD_EduProgram.initialize.selector,
            msg.sender,
            programId,
            feeRatio,
            validator,
            treasury,
            prizeConfig,
            start,
            end,
            eventLogger
        );

        ERC1967Proxy proxy = new ERC1967Proxy(implementation, initializeData);
        created[programId] = true;

        (bool success,) = address(proxy).call{value: msg.value}("");
        require(success, "Failed to send Ether to proxy");
        ILD_EventLogger(eventLogger).addProgram(programId, address(proxy), msg.sender, start, end);

        return address(proxy);
    }
}
