// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./bounty/LDBountyEdu.sol";
import "./extensions/Log.sol";
import "./interfaces/ILDBounty.sol";

contract LDBounty is UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuard, LDBountyEdu, Log, ILDBounty {
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
    ) public initializer {
        __Ownable_init(initialOwner);
        __LDBountyEdu_init(programId_, feeRatio_, validator_, treasury_, prizeConfig, start, end);
        __Log_init(eventLogger_);
    }

    receive() external payable {}

    // =========================== View =========================== //

    function programId() public view returns (uint256) {
        return _programId();
    }

    function programDuration() public view returns (uint256[2] memory) {
        return [_startDate(), _endDate()];
    }

    function feeRatio() public view returns (uint256) {
        return _feeRatio();
    }

    function treasury() public view returns (address) {
        return _treasury();
    }

    function validator() public view returns (address) {
        return _validator();
    }

    function totalChapter() public view returns (uint256) {
        return _totalChapter();
    }

    function reserveAndPrize(uint256 chapterIndex) public view returns (uint256[2] memory) {
        return [_reserve(chapterIndex), _prize(chapterIndex)];
    }

    // =========================== Write =========================== //

    function claim(uint256 programId_, uint256 chapterIndex, uint256 submissionId, address recipient, bytes memory sig)
        external
        nonReentrant
    {
        _claimValidation(programId_, chapterIndex, submissionId, recipient);
        _sigValidation(programId_, chapterIndex, submissionId, recipient, sig);

        (uint256 remain, uint256 prize) = _claim(chapterIndex, recipient, submissionId);

        _logPrizeClaimed(programId_, chapterIndex, recipient, remain, prize);
    }

    // =========================== Only Owner =========================== //

    function _authorizeUpgrade(address newImplement) internal override onlyOwner {}

    function withdraw() external onlyOwner {
        uint256 amount = _withdraw(msg.sender);

        _logWithdraw(_programId(), amount);
    }

    function addChapter(uint256 reserve, uint256 prize) external onlyOwner {
        uint256 newChapterIndex = _addChapter(reserve, prize);

        _logChapterAdded(_programId(), newChapterIndex, reserve, prize);
    }

    function setValidator(address newValidator_) external onlyOwner {
        address oldValidator = _validator();
        address newValidator = _setValidator(newValidator_);

        _logValidatorChanged(oldValidator, newValidator);
    }
}