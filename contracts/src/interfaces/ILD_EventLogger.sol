// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILD_EventLogger {
    // Events
    event ProgramCreated(
        uint256 indexed programId, address indexed programAddress, address indexed owner, uint256 start, uint256 end
    );
    event PrizeClaimed(
        uint256 indexed programId,
        uint256 indexed missionNumber,
        address indexed recipient,
        uint256 prize,
        uint256 amount
    );
    event MissionAdded(uint256 indexed programId, uint256 indexed newMissionNumber, uint256 prize);
    event PrizeAdded(uint256 indexed programId, uint256 indexed missionNumber, uint256 amount, uint256 prize);
    event AuditorChanged(
        uint256 indexed programId, uint256 indexed missionNumber, address oldAuditor, address newAuditor
    );
    event Withdraw(uint256 indexed programId, uint256 amount);

    // Functions
    function logProgramCreated(uint256 programId, address programAddress, address owner, uint256 start, uint256 end)
        external;
    function logPrizeClaimed(uint256 programId, uint256 missionNumber, address recipient, uint256 prize, uint256 amount)
        external;
    function logMissionAdded(uint256 programId, uint256 newMissionNumber, uint256 prize) external;
    function logPrizeAdded(uint256 programId, uint256 missionNumber, uint256 amount, uint256 prize) external;
    function logAuditorChanged(uint256 programId, uint256 missionNumber, address oldAuditor, address newAuditor)
        external;
    function logWithdraw(uint256 programId, uint256 amount) external;
}
