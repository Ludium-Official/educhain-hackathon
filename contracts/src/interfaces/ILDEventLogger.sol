// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILDEventLogger {
    // Events
    event ProgramCreated(
        uint256 indexed programId, address indexed programAddress, address indexed owner, uint256 start, uint256 end
    );
    event PrizeClaimed(
        uint256 indexed programId,
        uint256 indexed chapterIndex,
        address indexed recipient,
        uint256 reserve,
        uint256 amount
    );
    event ChapterAdded(uint256 indexed programId, uint256 indexed newChapterIndex, uint256 reserve, uint256 prize);
    event ValidatorChanged(address indexed oldValidator, address indexed newValidator);
    event Withdraw(uint256 indexed programId, uint256 amount);

    // Functions
    function addProgram(uint256 programId, address programAddress, address owner, uint256 start, uint256 end)
        external;
    function logPrizeClaimed(
        uint256 programId,
        uint256 chapterIndex,
        address recipient,
        uint256 reserve,
        uint256 amount
    ) external;
    function logChapterAdded(uint256 programId, uint256 newChapterIndex, uint256 reserve, uint256 prize) external;
    function logValidatorChanged(address oldValidator, address newValidator) external;
    function logWithdraw(uint256 programId, uint256 amount) external;
}
