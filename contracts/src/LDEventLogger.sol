// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ILDEventLogger.sol";

contract LDEventLogger is Ownable, ILDEventLogger {
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
    function addProgram(uint256 programId, address programAddress, address owner, uint256 start, uint256 end)
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
     * @param reserve Reserve amount
     * @param amount Claimed amount
     */
    function logPrizeClaimed(
        uint256 programId,
        uint256 chapterIndex,
        address recipient,
        uint256 reserve,
        uint256 amount
    ) external onlyProgram {
        emit PrizeClaimed(programId, chapterIndex, recipient, reserve, amount);
    }

    /**
     * @dev Emits the ChapterAdded event.
     * @param programId Id of the program
     * @param newChapterIndex Index of the new chapter
     * @param reserve Reserve amount
     * @param prize Prize amount
     */
    function logChapterAdded(uint256 programId, uint256 newChapterIndex, uint256 reserve, uint256 prize)
        external
        onlyProgram
    {
        emit ChapterAdded(programId, newChapterIndex, reserve, prize);
    }

    /**
     * @dev Emits the ValidatorChanged event.
     * @param oldValidator Address of the old validator
     * @param newValidator Address of the new validator
     */
    function logValidatorChanged(address oldValidator, address newValidator) external onlyProgram {
        emit ValidatorChanged(oldValidator, newValidator);
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
