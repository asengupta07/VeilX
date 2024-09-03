//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract VeilXEcosys {
    address public owner;

    event RewardDistributed(address recipient, uint256 amount);

    event FundsReceived(address sender, uint256 amount);

    constructor() payable {
        owner = msg.sender;
    }

    function distributeReward(
        address payable recipient,
        uint256 amount
    ) external {
        require(
            address(this).balance >= amount,
            "Not enough funds in contract"
        );
        recipient.transfer(amount);
        emit RewardDistributed(recipient, amount);
    }

    function receiveFunds() external payable {
        require(msg.value > 0, "Send some ETH to deposit");
        emit FundsReceived(msg.sender, msg.value);
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
