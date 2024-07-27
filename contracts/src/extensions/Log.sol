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

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/ILDEventLogger.sol";

contract Log is Initializable {
    // keccak256(abi.encode(uint256(keccak256("ludium.storage.Log")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant StorageLocation = 0x0e975ef586bbae5d130e43abe105a5db164c2ce040370295e9a748cab6e3c600;

    struct LDLogStorage {
        address _logger;
    }

    function _getLogStorage() private pure returns (LDLogStorage storage $) {
        assembly {
            $.slot := StorageLocation
        }
    }

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    function __Log_init(address loggerAddress) internal onlyInitializing {
        __Log_init_unchained(loggerAddress);
    }

    function __Log_init_unchained(address loggerAddress) internal onlyInitializing {
        LDLogStorage storage $ = _getLogStorage();
        $._logger = loggerAddress;
    }

    function _logPrizeClaimed(
        uint256 programId,
        uint256 chapterIndex,
        address recipient,
        uint256 reserve,
        uint256 amount
    ) internal {
        LDLogStorage storage $ = _getLogStorage();
        ILDEventLogger($._logger).logPrizeClaimed(programId, chapterIndex, recipient, reserve, amount);
    }

    function _logChapterAdded(uint256 programId, uint256 newChapterIndex, uint256 reserve, uint256 prize) internal {
        LDLogStorage storage $ = _getLogStorage();
        ILDEventLogger($._logger).logChapterAdded(programId, newChapterIndex, reserve, prize);
    }

    function _logValidatorChanged(address oldValidator, address newValidator) internal {
        LDLogStorage storage $ = _getLogStorage();
        ILDEventLogger($._logger).logValidatorChanged(oldValidator, newValidator);
    }

    function _logWithdraw(uint256 programId, uint256 amount) internal {
        LDLogStorage storage $ = _getLogStorage();
        ILDEventLogger($._logger).logWithdraw(programId, amount);
    }
}
