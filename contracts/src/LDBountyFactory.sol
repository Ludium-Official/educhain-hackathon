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

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./LDBounty.sol";
import "./LDEventLogger.sol";
import "./interfaces/ILDEventLogger.sol";

contract LDBountyFactory {
    address public immutable implementation;
    address public immutable eventLogger;
    address public immutable treasury;
    uint256 public immutable feeRatio;
    mapping(uint256 => bool) created;

    event EventLogger(address indexed eventLogger);

    constructor(address _implementation, uint256 _feeRatio, address _treasury) {
        implementation = _implementation;
        eventLogger = address(new LDEventLogger(address(this)));
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
            LDBounty.initialize.selector,
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
        ILDEventLogger(eventLogger).addProgram(programId, address(proxy), msg.sender, start, end);

        return address(proxy);
    }
}
