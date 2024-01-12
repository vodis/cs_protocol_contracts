// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { LibDiamond } from "../../libraries/LibDiamond.sol";
import { IERC173 } from "../../interfaces/IERC173.sol";

contract OwnershipFacet is IERC173 {
    function transferOwnership(address _newOwner) external override {
        LibDiamond.enforceIsContractOwner();
        require(_newOwner != address(0x0), "OF: null address error");
        LibDiamond.setContractOwner(_newOwner);
    }

    function owner() external view override returns (address owner_) {
        owner_ = LibDiamond.contractOwner();
    }
}
