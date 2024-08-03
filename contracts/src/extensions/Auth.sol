// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/ILD_EventLogger.sol";

contract Auth is Initializable, OwnableUpgradeable {
    // keccak256(abi.encode(uint256(keccak256("ludium.storage.Auth")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant AuthStorageLocation = 0x25356884ea9c0509adfee9d52910fb991c17b97bcf188e7ea542bef5b2da9600;

    struct AuthStorage {
        address[] _managers;
        mapping(address => bool) _isManager;
    }

    function _getLogStorage() private pure returns (AuthStorage storage $) {
        assembly {
            $.slot := AuthStorageLocation
        }
    }

    /**
     * @dev Initializes the contract by setting a `initialOwner` and `managers`.
     */
    function __Auth_init(address initialOwner, address[] memory managers) internal onlyInitializing {
        super.__Ownable_init(initialOwner);
        __Auth_init_unchained(managers);
    }

    function __Auth_init_unchained(address[] memory managers) internal onlyInitializing {
        AuthStorage storage $ = _getLogStorage();
        for (uint256 i = 0; i < managers.length; i++) {
            if (!$._isManager[managers[i]]) {
                $._managers.push(managers[i]);
                $._isManager[managers[i]] = true;
            }
        }
    }

    /**
     * @dev Modifier to make a function callable only by the owner or a manager.
     */
    modifier ownerOrManager() {
        AuthStorage storage $ = _getLogStorage();
        require(owner() == msg.sender || $._isManager[msg.sender], "Caller is not the owner or a manager");
        _;
    }

    /**
     * @dev Adds a new manager.
     */
    function _addManager(address newManager) internal {
        AuthStorage storage $ = _getLogStorage();
        require(!$._isManager[newManager], "Address is already a manager");
        $._managers.push(newManager);
        $._isManager[newManager] = true;
    }

    /**
     * @dev Removes an existing manager.
     */
    function _removeManager(address manager) internal {
        AuthStorage storage $ = _getLogStorage();
        require($._isManager[manager], "Address is not a manager");

        // Remove manager from the array
        for (uint256 i = 0; i < $._managers.length; i++) {
            if ($._managers[i] == manager) {
                $._managers[i] = $._managers[$._managers.length - 1];
                $._managers.pop();
                break;
            }
        }

        // Remove manager from the mapping
        $._isManager[manager] = false;
    }
}
