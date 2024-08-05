// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../extensions/Auth.sol";
import "../extensions/EduBounty.sol";
import "../extensions/Log.sol";
import "../interfaces/ILD_EduProgram.sol";

contract LD_EduProgram is UUPSUpgradeable, EIP712Upgradeable, ReentrancyGuard, Auth, EduBounty, Log, ILD_EduProgram {
    string public constant DOMAIN_NAME = "Ludium";
    string public constant VERSION = "0.1";

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
    ) public payable initializer {
        __Auth_init(initialOwner, managers_);
        __EduBounty_init(programId_, feeRatio_, treasury_, msg.value, prizeConfig, start, end);
        __Log_init(eventLogger_);
        __EIP712_init(DOMAIN_NAME, VERSION);
    }

    receive() external payable {
        revert("To add contract balance, use the deposit()");
    }

    // =========================== View =========================== //

    function programId() external view returns (uint256) {
        return _programId();
    }

    function programDuration() external view returns (uint256[2] memory) {
        return [_startDate(), _endDate()];
    }

    function feeRatio() external view returns (uint256) {
        return _feeRatio();
    }

    function treasury() external view returns (address) {
        return _treasury();
    }

    function auditor(uint256 missionNumber) external view returns (address) {
        return _auditor(missionNumber);
    }

    function totalMissions() external view returns (uint256) {
        return _totalMissions();
    }

    function reserve() external view returns (uint256) {
        return _reserve();
    }

    function prize(uint256 missionNumber) external view returns (uint256) {
        return _prize(missionNumber);
    }

    // =========================== Write =========================== //

    function deposit() external payable {
        _deposit(msg.value);
    }

    function claim(uint256 programId_, uint256 missionNumber, address recipient, uint256 amount, bytes memory sig)
        external
        nonReentrant
    {
        _claimValidation(programId_, missionNumber, recipient, amount);

        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Claim(uint256 programId,uint256 missionNumber,address recipient,uint256 amount)"),
                programId_,
                missionNumber,
                recipient,
                amount
            )
        );
        _sigValidation(missionNumber, _hashTypedDataV4(structHash), sig);

        (uint256 remain, uint256 recipientAmount) = _claim(missionNumber, recipient, amount);

        _logPrizeClaimed(programId_, missionNumber, recipient, remain, recipientAmount);
    }

    // =========================== Manager =========================== //

    /**
     * @dev Adds a new manager to the program.
     * @param newManager The address of the new manager to be added.
     */
    function addManager(address newManager) external ownerOrManager {
        _addManager(newManager);
    }

    /**
     * @dev Removes an existing manager from the program.
     * @param manager The address of the manager to be removed.
     */
    function removeManager(address manager) external ownerOrManager {
        _removeManager(manager);
    }

    function addMission(address auditor_, uint256 prize_) external ownerOrManager {
        require(_reserve() >= prize_, "Insufficient balance");
        uint256 newMissionNumber = _addMission(auditor_, prize_);

        _logMissionAdded(_programId(), newMissionNumber, prize_);
    }

    function addPrize(uint256 missionNumber, uint256 amount) external ownerOrManager {
        uint256 updatedPrize = _addPrize(missionNumber, amount);

        _logPrizeAdded(_programId(), missionNumber, amount, updatedPrize);
    }

    function addMissionWithDeposit(address auditor_) external payable ownerOrManager {
        require(msg.value > 0, "Invalid amount");
        _deposit(msg.value);
        uint256 newMissionNumber = _addMission(auditor_, msg.value);

        _logMissionAdded(_programId(), newMissionNumber, msg.value);
    }

    function addPrizeWithDeposit(uint256 missionNumber) external payable ownerOrManager {
        require(msg.value > 0, "Invalid amount");
        _deposit(msg.value);
        uint256 updatedPrize = _addPrize(missionNumber, msg.value);

        _logPrizeAdded(_programId(), missionNumber, msg.value, updatedPrize);
    }

    function setAuditor(uint256 missionNumber, address newAuditor_) external ownerOrManager {
        address oldValidator = _auditor(missionNumber);
        address newAuditor = _setAuditor(missionNumber, newAuditor_);

        _logAuditorChanged(_programId(), missionNumber, oldValidator, newAuditor);
    }

    // =========================== Owner =========================== //

    function withdraw() external onlyOwner {
        uint256 amount = _withdraw(msg.sender);

        _logWithdraw(_programId(), amount);
    }

    // =========================== Internal =========================== //

    function _authorizeUpgrade(address newImplement) internal override onlyOwner {}
}
