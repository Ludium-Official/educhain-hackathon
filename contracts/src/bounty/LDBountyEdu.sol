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
contract LDBountyEdu {
    // do something..
    string public constant CONTRACT_TYPE = "education";
    string public constant VERSION = "0.1";

    // 슬롯 위치

    // validator: 상금 수령 서명 유효성 검사에서만 활용
    // owner: 컨트랙트 업데이트 및 withdraw, ... 권한

    // struct 결정
    // 챕터 할당량, 보상 금액,
    // 챕터는 프로그램에 따라 한개 일 수도, 여러개 일 수도?

    // view 함수
    // 총 챕터가 몇 개인가?
    // 챕터당 보상이 얼마인가?
    // 챕터 보상 할당량이 얼마 남았는가?
}
