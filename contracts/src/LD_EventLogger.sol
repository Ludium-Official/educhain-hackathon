// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ILD_EventLogger.sol";

contract LD_EventLogger is Ownable, ILD_EventLogger {
    mapping(address => bool) isProgram;

    constructor(address factoryAddress) Ownable(factoryAddress) {}

    /**
     * @dev Modifier to check if the caller is a valid program.
     */
    modifier onlyProgram() {
        require(isProgram[msg.sender], "Caller is not a valid program");
        _;
    }

    /**
     * @dev Adds a program address to the isProgram mapping.
     * @param programId Id of the program
     * @param programAddress Address of the program
     * @param owner Address of the owner
     * @param start Start time of the program
     * @param end End time of the program
     */
    function logProgramCreated(uint256 programId, address programAddress, address owner, uint256 start, uint256 end)
        external
        onlyOwner
    {
        isProgram[programAddress] = true;
        emit ProgramCreated(programId, programAddress, owner, start, end);
    }

    /**
     * @dev Emits the PrizeClaimed event.
     * @param programId Id of the program
     * @param chapterIndex Index of the chapter
     * @param recipient Address of the recipient
     * @param prize Remained prize amount
     * @param amount Claimed amount
     */
    function logPrizeClaimed(uint256 programId, uint256 chapterIndex, address recipient, uint256 prize, uint256 amount)
        external
        onlyProgram
    {
        emit PrizeClaimed(programId, chapterIndex, recipient, prize, amount);
    }

    /**
     * @dev Emits the ChapterAdded event.
     * @param programId Id of the program
     * @param newMissionNumber Index of the new Mission
     * @param prize Prize amount
     */
    function logMissionAdded(uint256 programId, uint256 newMissionNumber, uint256 prize) external onlyProgram {
        emit MissionAdded(programId, newMissionNumber, prize);
    }

    /**
     * @dev Emits the PrizeAdded event.
     * @param programId Id of the program
     * @param missionNumber Index of the new Mission
     * @param amount Added amount
     * @param prize Updated prize amount
     */
    function logPrizeAdded(uint256 programId, uint256 missionNumber, uint256 amount, uint256 prize)
        external
        onlyProgram
    {
        emit PrizeAdded(programId, missionNumber, amount, prize);
    }

    /**
     * @dev Emits the AuditorChanged event.
     * @param oldAuditor Address of the old auditor
     * @param newAuditor Address of the new auditor
     */
    function logAuditorChanged(uint256 programId, uint256 missionNumber, address oldAuditor, address newAuditor)
        external
        onlyProgram
    {
        emit AuditorChanged(programId, missionNumber, oldAuditor, newAuditor);
    }

    /**
     * @dev Emits the Withdraw event.
     * @param programId Id of the program
     * @param amount Withdrawn amount
     */
    function logWithdraw(uint256 programId, uint256 amount) external onlyProgram {
        emit Withdraw(programId, amount);
    }
}
