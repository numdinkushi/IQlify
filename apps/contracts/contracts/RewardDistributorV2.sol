// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract RewardDistributorV2 is Ownable, ReentrancyGuard, EIP712 {
    using ECDSA for bytes32;

    // EIP-712 config
    // Domain name/version must be stable across client and server
    string public constant NAME = "IQlifyRewardDistributor";
    string public constant VERSION = "2";

    // Typed data hash for claim struct (computed in constructor for clarity)
    bytes32 public immutable CLAIM_TYPEHASH;

    // Authorized off-chain signer
    address public signer;

    // Replay protection per user
    mapping(address => mapping(uint256 => bool)) public usedNonce;

    event RewardClaimed(
        address indexed user,
        uint256 amount,
        uint256 nonce,
        bytes32 referralTag
    );
    event SignerUpdated(address newSigner);

    constructor(address _signer) EIP712(NAME, VERSION) Ownable(msg.sender) {
        CLAIM_TYPEHASH = keccak256(
            bytes(
                "Claim(address user,uint256 amount,uint256 nonce,uint256 deadline,bytes32 referralTag)"
            )
        );
        signer = _signer;
        emit SignerUpdated(_signer);
    }

    function setSigner(address _signer) external onlyOwner {
        signer = _signer;
        emit SignerUpdated(_signer);
    }

    // Fund the contract with native CELO
    receive() external payable {}

    function claimWithSignature(
        uint256 amount,
        uint256 nonce,
        uint256 deadline,
        bytes32 referralTag,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        require(block.timestamp <= deadline, "Expired");
        require(amount > 0, "Invalid amount");
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );
        require(!usedNonce[msg.sender][nonce], "Nonce used");

        bytes32 structHash = keccak256(
            abi.encode(
                CLAIM_TYPEHASH,
                msg.sender,
                amount,
                nonce,
                deadline,
                referralTag
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        address recovered = ECDSA.recover(digest, v, r, s);
        require(
            recovered != address(0) && recovered == signer,
            "Bad signature"
        );

        usedNonce[msg.sender][nonce] = true;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Transfer failed");

        emit RewardClaimed(msg.sender, amount, nonce, referralTag);
    }

    function withdraw(
        uint256 amount,
        address payable to
    ) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid recipient");
        require(amount <= address(this).balance, "Insufficient balance");
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Withdraw failed");
    }

    function withdrawAll(address payable to) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid recipient");
        uint256 bal = address(this).balance;
        (bool sent, ) = to.call{value: bal}("");
        require(sent, "Withdraw failed");
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
