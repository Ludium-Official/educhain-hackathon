// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../extensions/EduBounty.sol";

interface ILD_EduProgram {
    // View functions
    function programId() external view returns (uint256);
    function programDuration() external view returns (uint256[2] memory);
    function feeRatio() external view returns (uint256);
    function treasury() external view returns (address);
    function auditor(uint256 missionNumber) external view returns (address);
    function totalMissions() external view returns (uint256);
    function reserve() external view returns (uint256);
    function prize(uint256 missionNumber) external view returns (uint256);

    // Write functions
    function deposit() external payable;
    function claim(uint256 programId_, uint256 missionNumber, address recipient, uint256 amount, bytes memory sig)
        external;

    // Manager functions
    function addManager(address newManager) external;
    function removeManager(address manager) external;
    function addMission(address auditor_, uint256 prize_) external;
    function addPrize(uint256 missionNumber, uint256 amount) external;
    function addMissionWithDeposit(address auditor_) external payable;
    function addPrizeWithDeposit(uint256 missionNumber) external payable;
    function setAuditor(uint256 missionNumber, address newAuditor) external;

    // Owner functions
    function withdraw() external;

    // Initialize function
    function initialize(
        address initialOwner,
        address[] memory managers_,
        uint256 programId_,
        uint256 feeRatio_,
        address treasury_,
        EduBounty.PrizeConfig[] memory prizeConfig,
        uint256 start,
        uint256 end,
        address eventLogger_
    ) external payable;
}
