// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
/**
 * DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
 * CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
 *
 * CD            CCDCC     BCDC        CCC             CCDC        DCCD     CDCC         D           CC
 * DDC           DCDDD     CDDDC     CDDCC            DCDDD       CCDDC    CCDDDC      DDDDCC     CCCDD
 * DDD           DCDDD     CDDDC     DCDDDCD          DCDDD       CCDDC    CCDDDC      CDDDDDCC  DDDDDD
 * DDD           DCDDD     CDDDC     DCDDDDDD         DCDDD       CCDDC    CCDDDC      CDDDDDDDDDDDDDDD
 * DDD           DCDDD     CDDDC     DCDCDDDCD        DCDDD       CCDDC    CCDDDC      CDDDCCDDDDDDDDDD
 * DDD           DCDDD     CDDDC     DCDCCCDDD        DCDDD       CCDDC    CCDDDC      CDDCCCDDDDDDDDDD
 * DDD           DCDDD     CDDDC     DCDCCCCDDCD      DCDDD       CCDDC    CCDDDC      CDDDDDDC DDDDDDD
 * DDD           DCDDD     CDDDC     DCDCC  DDDDC     DCDDD       CCDDC    CCDDDC      CDDDDC     CCDDD
 * DDD           DCDDD     CDDDC     DCDCC  CCDDD     DCDDD       CCDDC    CCDDDC      CDDDD      DCDDD
 * DDD           DCDDD     CDDDC     DCDCC  DDDDC     DCDDD       CCDDC    CCDDDC      CDDDC      DCDDD
 * DDD           DCDDD     CDDDC     DCDCC CDDDDC     DCDDD       CCDDC    CCDDDC      CDDDC      DCDDD
 * DDD   D       DCDDD     DCDDC     DCDCCCCDDCD      DCDDD       CCDDC    CCDDDC      CDDDC      DCDDD
 * DDD CCDDD     DCDDD   CCDDDDC     DCDCDCDDC        DCDDD       CCDDC   DCDDDCC      CDDDC      DCDDD
 * DDDCDDDDC     DCDDD DDDDDDD       DCDCDDDDD        DCDDD       CCDDCCDDDDDDC        CDDDC      DCDDD
 * DDDDDCC       DCDDDDDDDDD         DCDDDDCC         DCDDD       CCDDDDDDDCC          CDDDC      DCDDD
 * DDDDCD        CDDDDDDDC           DCDDDCC          DCDDD       CCDDDDDDC            CDDDC      DCDDD
 * DDDDC         CCDDDDC             DCDDC            DCDDD        CDDDCD              CDDDC      DCDDD
 *  CC             CCC                CDC              CCDD         CCD                CCDC        CDCD
 *
 * CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
 * DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
 */

// https://ludium.world/

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract LDBountyEdu is Initializable {
    string public constant CONTRACT_TYPE = "education";
    string public constant VERSION = "0.1";

    // keccak256(abi.encode(uint256(keccak256("ludium.storage.LDBountyEdu")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant StorageLocation = 0xa419b7f6ee91760ab22b2e802b2afe5f4c2332b9057019e99ee975ac82881300;

    struct LDBountyEduStorage {
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
        mapping(uint256 => mapping(uint256 => bool)) _submitted;
    }

    function _getStorage() private pure returns (LDBountyEduStorage storage $) {
        assembly {
            $.slot := StorageLocation
        }
    }

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    function __LDBountyEdu_init(
        uint256 programId,
        uint256 feeRatio,
        address validator,
        address treasury,
        uint256[2][] memory prizeConfig,
        uint256 start,
        uint256 end
    ) internal onlyInitializing {
        __LDBountyEdu_init_unchained(programId, feeRatio, validator, treasury, prizeConfig, start, end);
    }

    function __LDBountyEdu_init_unchained(
        uint256 programId,
        uint256 feeRatio,
        address validator,
        address treasury,
        uint256[2][] memory prizeConfig,
        uint256 start,
        uint256 end
    ) internal onlyInitializing {
        LDBountyEduStorage storage $ = _getStorage();
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
     * @dev Returns the current validator address.
     */
    function _programId() internal view returns (uint256) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._programId;
    }

    /**
     * @dev Returns the current validator address.
     */
    function _validator() internal view returns (address) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._validator;
    }

    /**
     * @dev Returns the current treasury address.
     */
    function _treasury() internal view returns (address) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._treasury;
    }

    /**
     * @dev Sets a new validator.
     * @param newValidator Address of the new validator
     */
    function _setValidator(address newValidator) internal {
        LDBountyEduStorage storage $ = _getStorage();
        $._validator = newValidator;
    }

    /**
     * @dev Returns the current fee ratio.
     */
    function _feeRatio() internal view returns (uint256) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._feeRatio;
    }

    /**
     * @dev Returns the total number of chapters.
     */
    function _totalChapter() internal view returns (uint256) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._totalChapter;
    }

    /**
     * @dev Returns the start time.
     */
    function _startDate() internal view returns (uint256) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._start;
    }

    /**
     * @dev Returns the end time.
     */
    function _endDate() internal view returns (uint256) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._end;
    }

    /**
     * @dev Returns the reserve for a specific chapter.
     * @param chapterIndex Index of the chapter
     */
    function _reserve(uint256 chapterIndex) internal view returns (uint256) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._reserve[chapterIndex];
    }

    /**
     * @dev Returns the prize for a specific chapter.
     * @param chapterIndex Index of the chapter
     */
    function _prize(uint256 chapterIndex) internal view returns (uint256) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._prize[chapterIndex];
    }

    /**
     * @dev Adds a new chapter.
     * @param reserve Reserve for the new chapter
     * @param prize Prize for the new chapter
     */
    function _addChapter(uint256 reserve, uint256 prize) internal {
        LDBountyEduStorage storage $ = _getStorage();
        uint256 newChapterIndex = $._totalChapter + 1;
        $._reserve[newChapterIndex] = reserve;
        $._prize[newChapterIndex] = prize;
        $._totalChapter = newChapterIndex;
    }

    /**
     * @dev Checks if a specific address has claimed the prize for a specific chapter.
     * @param chapterIndex Index of the chapter
     * @param claimer Address of the claimer
     */
    function _hasClaimed(uint256 chapterIndex, address claimer) internal view returns (bool) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._claimed[chapterIndex][claimer];
    }

    /**
     * @dev Checks if a specific content has claimed the prize for a specific chapter.
     * @param chapterIndex Index of the chapter
     * @param submissionId Id of submission
     */
    function _isSubmitted(uint256 chapterIndex, uint256 submissionId) internal view returns (bool) {
        LDBountyEduStorage storage $ = _getStorage();
        return $._submitted[chapterIndex][submissionId];
    }

    /**
     * @dev Validates the signature for a specific submission.
     * @param programId Id of the program
     * @param chapterIndex Index of the chapter
     * @param submissionId Id of the submission
     * @param recipient Address of the recipient
     * @param sig Signature to validate
     */
    function _sigValidation(
        uint256 programId,
        uint256 chapterIndex,
        uint256 submissionId,
        address recipient,
        bytes memory sig
    ) internal view {
        LDBountyEduStorage storage $ = _getStorage();

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(programId, chapterIndex, submissionId, recipient))
            )
        );
        require(SignatureChecker.isValidSignatureNow($._validator, messageHash, sig), "Invalid signature");
    }

    /**
     * @dev Validates the claim parameters for a specific submission.
     * @param programId Id of the program
     * @param chapterIndex Index of the chapter
     * @param submissionId Id of the submission
     * @param recipient Address of the recipient
     */
    function _claimValidation(uint256 programId, uint256 chapterIndex, uint256 submissionId, address recipient)
        internal
        view
    {
        LDBountyEduStorage storage $ = _getStorage();
        require(chapterIndex > 0 && $._totalChapter >= chapterIndex, "Invalid chapter");
        require(programId == $._programId, "Invalid program id");
        require(!_isSubmitted(chapterIndex, submissionId), "Already submitted");
        require(!_hasClaimed(chapterIndex, recipient), "Already claimed");
        require($._reserve[chapterIndex] >= $._prize[chapterIndex], "Insufficient reserve balance");
    }

    /**
     * @dev Claims the prize for a specific chapter.
     * @param chapterIndex Index of the chapter
     * @param recipient Address of the recipient
     * @param submissionId Id of submission
     */
    function _claim(uint256 chapterIndex, address recipient, uint256 submissionId) internal {
        LDBountyEduStorage storage $ = _getStorage();

        uint256 prize = $._prize[chapterIndex];
        uint256 feeAmount = (prize * $._feeRatio) / 1 ether;
        uint256 recipientAmount = prize - feeAmount;

        $._reserve[chapterIndex] -= $._prize[chapterIndex];
        $._claimed[chapterIndex][recipient] = true;
        $._submitted[chapterIndex][submissionId] = true;

        // Send fee to treasury
        (bool successTreasury,) = payable($._treasury).call{value: feeAmount}("");
        require(successTreasury, "Treasury transfer failed");

        // Send remaining amount to recipient
        (bool successRecipient,) = payable(recipient).call{value: recipientAmount}("");
        require(successRecipient, "Recipient transfer failed");
    }
}
