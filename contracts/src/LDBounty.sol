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

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./bounty/LDBountyEdu.sol";

/**
 *  @title Ludium bounty contract factory
 *  @notice A new proxy is created every time a program(bounty) is generated.
 */
contract LDBounty is OwnableUpgradeable, LDBountyEdu {
    function initialize(
        address initialOwner,
        uint256 programId_,
        uint256 feeRatio_,
        address validator_,
        address treasury_,
        uint256[2][] memory prizeConfig,
        uint256 start,
        uint256 end
    ) public initializer {
        __Ownable_init(initialOwner);
        __LDBountyEdu_init(programId_, feeRatio_, validator_, treasury_, prizeConfig, start, end);

        // [Todo] event emit
    }

    // =========================== View =========================== //

    function programId() public view returns (uint256) {
        return _programId();
    }

    function programDuration() public view returns (uint256[2] memory) {
        return [_startDate(), _endDate()];
    }

    function feeRatio() public view returns (uint256) {
        return _feeRatio();
    }

    function treasury() public view returns (address) {
        return _treasury();
    }

    function validator() public view returns (address) {
        return _validator();
    }

    function totalChapter() public view returns (uint256) {
        return _totalChapter();
    }

    function reserveAndPrize(uint256 chapterIndex) public view returns (uint256[2] memory) {
        return [_reserve(chapterIndex), _prize(chapterIndex)];
    }

    // =========================== Write =========================== //

    function claim(uint256 programId_, uint256 chapterIndex, uint256 submissionId, address recipient, bytes memory sig)
        external
    {
        require(recipient == msg.sender);

        _claimValidation(programId_, chapterIndex, submissionId, recipient);
        _sigValidation(programId_, chapterIndex, submissionId, recipient, sig);

        _claim(chapterIndex, recipient, submissionId);

        // [Todo] event emit
    }

    // =========================== Only Owner =========================== //

    function addChapter(uint256 reserve, uint256 prize) external onlyOwner {
        _addChapter(reserve, prize);

        // [Todo] event emit
    }

    function setValidator(address newValidator) external onlyOwner {
        _setValidator(newValidator);

        // [Todo] event emit
    }
}
