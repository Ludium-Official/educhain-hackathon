// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILD_EduProgram {
    function initialize(
        address initialOwner,
        uint256 programId_,
        uint256 feeRatio_,
        address validator_,
        address treasury_,
        uint256[2][] memory prizeConfig,
        uint256 start,
        uint256 end,
        address eventLogger_
    ) external;

    function programId() external view returns (uint256);
    function programDuration() external view returns (uint256[2] memory);
    function feeRatio() external view returns (uint256);
    function treasury() external view returns (address);
    function validator() external view returns (address);
    function totalChapter() external view returns (uint256);
    function reserveAndPrize(uint256 chapterIndex) external view returns (uint256[2] memory);

    function claim(uint256 programId_, uint256 chapterIndex, address recipient, bytes memory sig) external;
    function withdraw() external;
    function addChapter(uint256 reserve, uint256 prize) external payable;
    function setValidator(address newValidator_) external;

    receive() external payable;
}
