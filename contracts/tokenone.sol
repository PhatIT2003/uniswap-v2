// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20A is ERC20 {
    constructor(uint256 initialSupply) public {
        _mint(msg.sender, initialSupply);
    }

    function name() public pure returns (string memory) {
        return "TokenOne";
    }

    function symbol() public pure returns (string memory) {
        return "TKO";
    }

    function decimals() public pure returns (uint8) {
        return 18;
    }
}
