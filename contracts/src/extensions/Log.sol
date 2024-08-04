// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/ILD_EventLogger.sol";

contract Log is Initializable {
    // keccak256(abi.encode(uint256(keccak256("ludium.storage.Log")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant LDLogStorageLocation = 0x0e975ef586bbae5d130e43abe105a5db164c2ce040370295e9a748cab6e3c600;

    struct LDLogStorage {
        address _logger;
    }

    function _getLDLogStorage() private pure returns (LDLogStorage storage $) {
        assembly {
            $.slot := LDLogStorageLocation
        }
    }

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    function __Log_init(address loggerAddress) internal onlyInitializing {
        __Log_init_unchained(loggerAddress);
    }

    function __Log_init_unchained(address loggerAddress) internal onlyInitializing {
        LDLogStorage storage $ = _getLDLogStorage();
        $._logger = loggerAddress;
    }

    function _logPrizeClaimed(
        uint256 programId,
        uint256 missionNumber,
        address recipient,
        uint256 prize,
        uint256 amount
    ) internal {
        LDLogStorage storage $ = _getLDLogStorage();
        ILD_EventLogger($._logger).logPrizeClaimed(programId, missionNumber, recipient, prize, amount);
    }

    function _logMissionAdded(uint256 programId, uint256 newMissionNumber, uint256 prize) internal {
        LDLogStorage storage $ = _getLDLogStorage();
        ILD_EventLogger($._logger).logMissionAdded(programId, newMissionNumber, prize);
    }

    function _logPrizeAdded(uint256 programId, uint256 missionNumber, uint256 amount, uint256 prize) internal {
        LDLogStorage storage $ = _getLDLogStorage();
        ILD_EventLogger($._logger).logPrizeAdded(programId, missionNumber, amount, prize);
    }

    function _logAuditorChanged(uint256 programId, uint256 missionNumber, address oldAuditor, address newAuditor)
        internal
    {
        LDLogStorage storage $ = _getLDLogStorage();
        ILD_EventLogger($._logger).logAuditorChanged(programId, missionNumber, oldAuditor, newAuditor);
    }

    function _logWithdraw(uint256 programId, uint256 amount) internal {
        LDLogStorage storage $ = _getLDLogStorage();
        ILD_EventLogger($._logger).logWithdraw(programId, amount);
    }
}
