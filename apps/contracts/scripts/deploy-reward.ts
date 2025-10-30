/*
  Deployment/migration helper for RewardDistributor.

  Env vars:
  - SECRET_STRING: preimage string to hash with keccak256
  - SECRET_HASH: bytes32 hash (if you prefer to pass directly)
  - PREV_REWARD_ADDRESS: optional previous RewardDistributor address to sweep
  - SAFE_WALLET_PK: optional private key to use for sweeping/funding (defaults to deployer)
  - FUND_VALUE: optional ether value to fund new contract (e.g., "1.0")
*/

import "dotenv/config";
import hre from "hardhat";

async function main() {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const secretString = process.env.SECRET_STRING;
    const secretHashEnv = process.env.SECRET_HASH;
    if (!secretString && !secretHashEnv) {
        throw new Error("Set SECRET_STRING or SECRET_HASH in .env");
    }

    const computedHash = secretString
        ? ethers.keccak256(ethers.toUtf8Bytes(secretString))
        : (secretHashEnv as `0x${string}`);

    // Optional: use a distinct wallet for sweeping/funding
    const safePk = process.env.SAFE_WALLET_PK;
    const sweepSigner = safePk
        ? new ethers.Wallet(safePk, deployer.provider)
        : deployer;

    console.log("Deployer:", await deployer.getAddress());
    console.log("Sweeper:", await sweepSigner.getAddress());
    console.log("Secret hash:", computedHash);

    // 1) Optionally sweep previous deployment
    const prevAddr = process.env.PREV_REWARD_ADDRESS;
    if (prevAddr) {
        console.log("Sweeping previous contract:", prevAddr);
        const prev = await ethers.getContractAt(
            "RewardDistributor",
            prevAddr,
            sweepSigner
        );
        // Withdraw everything to the sweeper address
        const to = await sweepSigner.getAddress();
        const tx = await prev.withdrawAll(to);
        console.log("withdrawAll tx:", tx.hash);
        await tx.wait();
        console.log("Previous funds withdrawn to:", to);
    }

    // 2) Deploy new RewardDistributor
    console.log("Deploying RewardDistributor...");
    const Factory = await ethers.getContractFactory("RewardDistributor", deployer);
    const contract = await Factory.deploy(computedHash);
    const receipt = await contract.waitForDeployment();
    const newAddress = await contract.getAddress();
    console.log("RewardDistributor deployed:", newAddress);

    // 3) Optionally fund new contract
    const fundValue = process.env.FUND_VALUE;
    if (fundValue) {
        console.log("Funding new contract with:", fundValue, "ETH/CELO");
        const tx = await sweepSigner.sendTransaction({
            to: newAddress,
            value: ethers.parseEther(fundValue),
        });
        console.log("fund tx:", tx.hash);
        await tx.wait();
        console.log("Funded", newAddress);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});


