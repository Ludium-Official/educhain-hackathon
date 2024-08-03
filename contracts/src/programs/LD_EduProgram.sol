// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../extensions/EduBounty.sol";
import "../extensions/Log.sol";
import "../interfaces/ILD_EduProgram.sol";

contract LD_EduProgram is
    UUPSUpgradeable,
    OwnableUpgradeable,
    EIP712Upgradeable,
    ReentrancyGuard,
    EduBounty,
    Log,
    ILD_EduProgram
{
    string public constant DOMAIN_NAME = "Ludium";
    string public constant VERSION = "0.1";

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
        __EduBounty_init(programId_, feeRatio_, validator_, treasury_, prizeConfig, start, end);
        __Log_init(eventLogger_);
        __EIP712_init(DOMAIN_NAME, VERSION);
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

    function claim(uint256 programId_, uint256 chapterIndex, address recipient, bytes memory sig)
        external
        nonReentrant
    {
        _claimValidation(programId_, chapterIndex, recipient);

        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Claim(uint256 programId,uint256 chapterIndex,address recipient)"),
                programId_,
                chapterIndex,
                recipient
            )
        );
        _sigValidation(_hashTypedDataV4(structHash), sig);

        (uint256 remain, uint256 prize) = _claim(chapterIndex, recipient);

        _logPrizeClaimed(programId_, chapterIndex, recipient, remain, prize);
    }

    // =========================== Only Owner =========================== //

    function _authorizeUpgrade(address newImplement) internal override onlyOwner {}

    function withdraw() external onlyOwner {
        uint256 amount = _withdraw(msg.sender);

        _logWithdraw(_programId(), amount);
    }

    function addChapter(uint256 reserve, uint256 prize) external payable onlyOwner {
        require(msg.value >= reserve, "Insufficient balance");
        uint256 newChapterIndex = _addChapter(reserve, prize);

        _logChapterAdded(_programId(), newChapterIndex, reserve, prize);
    }

    function setValidator(address newValidator_) external onlyOwner {
        address oldValidator = _validator();
        address newValidator = _setValidator(newValidator_);

        _logValidatorChanged(oldValidator, newValidator);
    }
}
