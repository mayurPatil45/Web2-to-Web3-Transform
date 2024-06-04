// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ContentOwnership {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function transferTo(address _newOwner) public {
        require(msg.sender == owner, "Only the owner can transfer ownership.");
        owner = _newOwner;
    }
}