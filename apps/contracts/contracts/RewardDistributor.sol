// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RewardDistributor is Ownable, ReentrancyGuard {
    // Hash of the shared secret used to authorize claims
    bytes32 public secretHash;

    // Tracks used nonces per claimer to prevent replay of the same authorization
    mapping(address => mapping(uint256 => bool)) public usedNonce;

    // Emitted on successful claim; referralTag is optional and can be zero.
    event RewardClaimed(
        address indexed user,
        uint256 amount,
        uint256 nonce,
        bytes32 referralTag
    );

    // Emitted when the secret hash is updated
    event SecretHashUpdated(bytes32 newSecretHash);

    constructor(bytes32 _secretHash) Ownable(msg.sender) {
        secretHash = _secretHash;
    }

    // Update the secret hash if rotation is needed
    function setSecretHash(bytes32 _secretHash) external onlyOwner {
        secretHash = _secretHash;
        emit SecretHashUpdated(_secretHash);
    }

    // Fund the contract with native CELO
    receive() external payable {}

    // Claim pre-calculated rewards. Frontend must pass the agreed secret preimage.
    // The contract verifies keccak256(abi.encodePacked(secret)) == secretHash.
    // nonce provides replay protection per user. referralTag is optional for analytics.
    function claimReward(
        uint256 amount,
        string calldata secret,
        uint256 nonce,
        bytes32 referralTag
    ) external nonReentrant {
        require(amount > 0, "Invalid amount");
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );
        require(!usedNonce[msg.sender][nonce], "Nonce already used");

        // Shared-secret check (simple gate; do not treat as strong auth)
        require(
            keccak256(abi.encodePacked(secret)) == secretHash,
            "Unauthorized"
        );

        usedNonce[msg.sender][nonce] = true;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Transfer failed");

        emit RewardClaimed(msg.sender, amount, nonce, referralTag);
    }

    // Withdraw funds by owner
    function withdraw(
        uint256 amount,
        address payable to
    ) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid recipient");
        require(amount <= address(this).balance, "Insufficient balance");
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Withdraw failed");
    }

    // Full balance withdraw helper
    function withdrawAll(address payable to) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid recipient");
        uint256 bal = address(this).balance;
        (bool sent, ) = to.call{value: bal}("");
        require(sent, "Withdraw failed");
    }

    // View helper for current balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
