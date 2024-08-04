// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract EduBounty is Initializable {
    // keccak256(abi.encode(uint256(keccak256("ludium.storage.EduBounty")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant EduBountyStorageLocation =
        0xcd3e4d0b2227a4a3c69cdd698e5f185ac8bc5894ee60a71c2625ee6a02b4cd00;

    struct PrizeConfig {
        address auditor;
        uint256 prize;
    }

    struct EduBountyStorage {
        uint256 _programId;
        address _treasury;
        uint256 _feeRatio;
        uint256 _totalMissions;
        uint256 _reserve;
        uint256 _start;
        uint256 _end;
        mapping(uint256 => address) _auditor;
        mapping(uint256 => uint256) _prize;
        mapping(uint256 => mapping(address => bool)) _claimed;
    }

    function _getEduBountyStorage() private pure returns (EduBountyStorage storage $) {
        assembly {
            $.slot := EduBountyStorageLocation
        }
    }

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    function __EduBounty_init(
        uint256 programId,
        uint256 feeRatio,
        address treasury,
        uint256 initialReserve,
        PrizeConfig[] memory prizeConfig,
        uint256 start,
        uint256 end
    ) internal onlyInitializing {
        __EduBounty_init_unchained(programId, feeRatio, treasury, initialReserve, prizeConfig, start, end);
    }

    function __EduBounty_init_unchained(
        uint256 programId,
        uint256 feeRatio,
        address treasury,
        uint256 initialReserve,
        PrizeConfig[] memory prizeConfig,
        uint256 start,
        uint256 end
    ) internal onlyInitializing {
        require(end > start, "End date must be after start date");
        require(end > block.timestamp, "End date must be in the future");

        EduBountyStorage storage $ = _getEduBountyStorage();
        $._programId = programId;
        $._treasury = treasury;
        $._feeRatio = feeRatio;
        $._start = start;
        $._end = end;
        $._reserve = initialReserve;

        for (uint256 i = 0; i < prizeConfig.length; i++) {
            _addMission(prizeConfig[i].auditor, prizeConfig[i].prize);
        }
    }

    // =========================== View =========================== //

    /**
     * @dev Returns the current program id.
     */
    function _programId() internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._programId;
    }

    /**
     * @dev Returns the current validator address.
     */
    function _auditor(uint256 missionNumber) internal view returns (address) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._auditor[missionNumber];
    }

    /**
     * @dev Returns the current treasury address.
     */
    function _treasury() internal view returns (address) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._treasury;
    }

    /**
     * @dev Returns the current fee ratio.
     */
    function _feeRatio() internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._feeRatio;
    }

    /**
     * @dev Returns the total number of missions.
     */
    function _totalMissions() internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._totalMissions;
    }

    /**
     * @dev Returns the start time.
     */
    function _startDate() internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._start;
    }

    /**
     * @dev Returns the end time.
     */
    function _endDate() internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._end;
    }

    /**
     * @dev Returns the reserve for a specific mission.
     * @return reserve Reserve of program.
     */
    function _reserve() internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._reserve;
    }

    /**
     * @dev Returns the prize for a specific mission.
     * @param missionNumber Index of the mission
     */
    function _prize(uint256 missionNumber) internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._prize[missionNumber];
    }

    // =========================== Validation =========================== //

    /**
     * @dev Checks if a specific address has claimed the prize for a specific mission.
     * @param missionNumber Index of the mission
     * @param claimer Address of the claimer
     */
    function _hasClaimed(uint256 missionNumber, address claimer) internal view returns (bool) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._claimed[missionNumber][claimer];
    }

    /**
     * @dev Validates the claim parameters for a specific submission.
     * @param programId Id of the program
     * @param missionNumber Index of the mission
     * @param recipient Address of the recipient
     */
    function _claimValidation(uint256 programId, uint256 missionNumber, address recipient, uint256 amount)
        internal
        view
    {
        EduBountyStorage storage $ = _getEduBountyStorage();
        require(block.timestamp >= $._start && block.timestamp <= $._end, "Program is not within its active period");
        require(recipient == msg.sender, "Must be requested by the approved recipient address");
        require(programId == $._programId, "Invalid program id");
        require(missionNumber > 0 && $._totalMissions >= missionNumber, "Invalid mission");
        require(!_hasClaimed(missionNumber, recipient), "Already claimed recipient");
        require($._prize[missionNumber] >= amount, "Insufficient prize balance");
    }

    /**
     * @dev Validates the signature for a specific submission.
     * @param digestHash bytes32: _hashTypedDataV4
     * @param sig Signature to validate
     */
    function _sigValidation(uint256 missionNumber, bytes32 digestHash, bytes memory sig) internal view {
        // uint256 programId, uint256 missionNumber, address recipient,
        EduBountyStorage storage $ = _getEduBountyStorage();
        require(SignatureChecker.isValidSignatureNow($._auditor[missionNumber], digestHash, sig), "Invalid signature");
    }

    // =========================== Write =========================== //

    /**
     * @dev Sets a new validator.
     * @param missionNumber Index of mission
     * @param newAuditor Address of the new validator
     */
    function _setAuditor(uint256 missionNumber, address newAuditor) internal returns (address) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        $._auditor[missionNumber] = newAuditor;

        return newAuditor;
    }

    /**
     * @dev deposit contract balance in reserve
     * @param amount amount of deposit
     * @return reserve reserve of specific mission
     */
    function _deposit(uint256 amount) internal returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        $._reserve += amount;

        return $._reserve;
    }

    /**
     * @dev withdraw contract balance
     * @notice Withdrawals can only be made after the program has ended
     * @param recipient address to receive
     */
    function _withdraw(address recipient) internal returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        require($._end <= block.timestamp, "Withdrawals can only be made after the program has ended");
        uint256 contractBalance = address(this).balance;
        (bool success,) = payable(recipient).call{value: contractBalance}("");
        require(success, "Transfer to recipient failed");

        return contractBalance;
    }

    /**
     * @dev Adds a new mission.
     * @param prize Prize for the new mission
     * @param auditor Auditor for the new mission
     */
    function _addMission(address auditor, uint256 prize) internal returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        require($._reserve >= prize, "Insufficient reserve");
        uint256 newMissionNumber = $._totalMissions + 1;
        $._reserve -= prize;
        $._prize[newMissionNumber] = prize;
        $._auditor[newMissionNumber] = auditor;
        $._totalMissions = newMissionNumber;

        return newMissionNumber;
    }

    /**
     * @dev deposit contract balance in specific mission
     * @param missionNumber index of mission
     * @param amount amount of deposit
     * @return prize prize of specific mission
     */
    function _addPrize(uint256 missionNumber, uint256 amount) internal returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        require(missionNumber > 0 && $._totalMissions >= missionNumber, "Invalid missionNumber");
        require($._reserve >= amount, "Insufficient reserve");
        $._prize[missionNumber] += amount;
        $._reserve -= amount;

        return $._prize[missionNumber];
    }

    /**
     * @dev Claims the prize for a specific mission.
     * @param missionNumber Index of the mission
     * @param recipient Address of the recipient
     */
    function _claim(uint256 missionNumber, address recipient, uint256 amount) internal returns (uint256, uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();

        uint256 feeAmount = (amount * $._feeRatio) / 1 ether;
        uint256 recipientAmount = amount - feeAmount;

        $._prize[missionNumber] -= amount;
        $._claimed[missionNumber][recipient] = true;

        // Send fee to treasury
        (bool successTreasury,) = payable($._treasury).call{value: feeAmount}("");
        require(successTreasury, "Treasury transfer failed");

        // Send remaining amount to recipient
        (bool successRecipient,) = payable(recipient).call{value: recipientAmount}("");
        require(successRecipient, "Recipient transfer failed");

        return ($._prize[missionNumber], recipientAmount);
    }
}
