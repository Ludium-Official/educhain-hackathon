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
    // do something..
    string public constant CONTRACT_TYPE = "education";
    string public constant VERSION = "0.1";

    // keccak256(abi.encode(uint256(keccak256("ludium.storage.LDBountyEdu")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant StorageLocation = 0xa419b7f6ee91760ab22b2e802b2afe5f4c2332b9057019e99ee975ac82881300;

    struct LDBountyEduStorage {
        address _owner;
        address _validator;
        uint256 _feeRatio;
        uint256 _totalChapter;
        mapping(uint256 => uint256) _reserve;
        mapping(uint256 => uint256) _prize;
        mapping(uint256 => mapping(address => bool)) _claimed;
    }

    function _getStorage() private pure returns (LDBountyEduStorage storage $) {
        assembly {
            $.slot := StorageLocation
        }
    }

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    function __LDBountyEdu_init(uint256 feeRatio, address owner, address validator, uint256[2][] memory chapterOption)
        internal
        onlyInitializing
    {
        __LDBountyEdu_init_unchained(feeRatio, owner, validator, chapterOption);
    }

    function __LDBountyEdu_init_unchained(
        uint256 feeRatio,
        address owner,
        address validator,
        uint256[2][] memory chapterOption
    ) internal onlyInitializing {
        LDBountyEduStorage storage $ = _getStorage();
        $._owner = owner;
        $._validator = validator;
        $._feeRatio = feeRatio;
        $._totalChapter = chapterOption.length;

        for (uint256 i = 0; i < chapterOption.length; i++) {
            uint256 chapterIndex = i + 1;
            $._reserve[chapterIndex] = chapterOption[i][0];
            $._prize[chapterIndex] = chapterOption[i][1];
        }
    }
}
