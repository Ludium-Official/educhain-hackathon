// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract EduBounty is Initializable {
    // keccak256(abi.encode(uint256(keccak256("ludium.storage.EduBounty")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant StorageLocation = 0xcd3e4d0b2227a4a3c69cdd698e5f185ac8bc5894ee60a71c2625ee6a02b4cd00;

    struct EduBountyStorage {
        uint256 _programId;
        address _validator;
        address _treasury;
        uint256 _feeRatio;
        uint256 _totalChapter;
        uint256 _start;
        uint256 _end;
        mapping(uint256 => uint256) _reserve;
        mapping(uint256 => uint256) _prize;
        mapping(uint256 => mapping(address => bool)) _claimed;
    }

    function _getEduBountyStorage() private pure returns (EduBountyStorage storage $) {
        assembly {
            $.slot := StorageLocation
        }
    }

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    function __EduBounty_init(
        uint256 programId,
        uint256 feeRatio,
        address validator,
        address treasury,
        uint256[2][] memory prizeConfig,
        uint256 start,
        uint256 end
    ) internal onlyInitializing {
        __EduBounty_init_unchained(programId, feeRatio, validator, treasury, prizeConfig, start, end);
    }

    function __EduBounty_init_unchained(
        uint256 programId,
        uint256 feeRatio,
        address validator,
        address treasury,
        uint256[2][] memory prizeConfig,
        uint256 start,
        uint256 end
    ) internal onlyInitializing {
        require(end > start, "End date must be after start date");
        require(end > block.timestamp, "End date must be in the future");

        EduBountyStorage storage $ = _getEduBountyStorage();
        $._programId = programId;
        $._validator = validator;
        $._treasury = treasury;
        $._feeRatio = feeRatio;
        $._totalChapter = prizeConfig.length;
        $._start = start;
        $._end = end;

        for (uint256 i = 0; i < prizeConfig.length; i++) {
            uint256 chapterIndex = i + 1;
            $._reserve[chapterIndex] = prizeConfig[i][0];
            $._prize[chapterIndex] = prizeConfig[i][1];
        }
    }

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
    function _validator() internal view returns (address) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._validator;
    }

    /**
     * @dev Returns the current treasury address.
     */
    function _treasury() internal view returns (address) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._treasury;
    }

    /**
     * @dev Sets a new validator.
     * @param newValidator Address of the new validator
     */
    function _setValidator(address newValidator) internal returns (address) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        $._validator = newValidator;

        return newValidator;
    }

    /**
     * @dev Returns the current fee ratio.
     */
    function _feeRatio() internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._feeRatio;
    }

    /**
     * @dev Returns the total number of chapters.
     */
    function _totalChapter() internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._totalChapter;
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
     * @dev Returns the reserve for a specific chapter.
     * @param chapterIndex Index of the chapter
     */
    function _reserve(uint256 chapterIndex) internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._reserve[chapterIndex];
    }

    /**
     * @dev Returns the prize for a specific chapter.
     * @param chapterIndex Index of the chapter
     */
    function _prize(uint256 chapterIndex) internal view returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._prize[chapterIndex];
    }

    /**
     * @dev Adds a new chapter.
     * @param reserve Reserve for the new chapter
     * @param prize Prize for the new chapter
     */
    function _addChapter(uint256 reserve, uint256 prize) internal returns (uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        uint256 newChapterIndex = $._totalChapter + 1;
        $._reserve[newChapterIndex] = reserve;
        $._prize[newChapterIndex] = prize;
        $._totalChapter = newChapterIndex;

        return newChapterIndex;
    }

    /**
     * @dev Checks if a specific address has claimed the prize for a specific chapter.
     * @param chapterIndex Index of the chapter
     * @param claimer Address of the claimer
     */
    function _hasClaimed(uint256 chapterIndex, address claimer) internal view returns (bool) {
        EduBountyStorage storage $ = _getEduBountyStorage();
        return $._claimed[chapterIndex][claimer];
    }

    /**
     * @dev Validates the claim parameters for a specific submission.
     * @param programId Id of the program
     * @param chapterIndex Index of the chapter
     * @param recipient Address of the recipient
     */
    function _claimValidation(uint256 programId, uint256 chapterIndex, address recipient) internal view {
        EduBountyStorage storage $ = _getEduBountyStorage();
        require(block.timestamp >= $._start && block.timestamp <= $._end, "Program is not within its active period");
        require(recipient == msg.sender, "Must be requested by the approved recipient address");
        require(programId == $._programId, "Invalid program id");
        require(chapterIndex > 0 && $._totalChapter >= chapterIndex, "Invalid chapter");
        require(!_hasClaimed(chapterIndex, recipient), "Already claimed recipient");
        require($._reserve[chapterIndex] >= $._prize[chapterIndex], "Insufficient reserve balance");
    }

    /**
     * @dev Validates the signature for a specific submission.
     * @param digestHash bytes32: _hashTypedDataV4
     * @param sig Signature to validate
     */
    function _sigValidation(bytes32 digestHash, bytes memory sig) internal view {
        // uint256 programId, uint256 chapterIndex, address recipient,
        EduBountyStorage storage $ = _getEduBountyStorage();
        require(SignatureChecker.isValidSignatureNow($._validator, digestHash, sig), "Invalid signature");
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
     * @dev Claims the prize for a specific chapter.
     * @param chapterIndex Index of the chapter
     * @param recipient Address of the recipient
     */
    function _claim(uint256 chapterIndex, address recipient) internal returns (uint256, uint256) {
        EduBountyStorage storage $ = _getEduBountyStorage();

        uint256 prize = $._prize[chapterIndex];
        uint256 feeAmount = (prize * $._feeRatio) / 1 ether;
        uint256 recipientAmount = prize - feeAmount;

        $._reserve[chapterIndex] -= $._prize[chapterIndex];
        $._claimed[chapterIndex][recipient] = true;

        // Send fee to treasury
        (bool successTreasury,) = payable($._treasury).call{value: feeAmount}("");
        require(successTreasury, "Treasury transfer failed");

        // Send remaining amount to recipient
        (bool successRecipient,) = payable(recipient).call{value: recipientAmount}("");
        require(successRecipient, "Recipient transfer failed");

        return ($._reserve[chapterIndex], recipientAmount);
    }
}
