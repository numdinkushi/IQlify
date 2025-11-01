/*
  Deployment/migration helper for RewardDistributorV2 (EIP-712 signer based).

  Env vars:
  - SIGNER_ADDRESS: address whose private key signs claim authorizations
  - PREV_REWARD_ADDRESS: optional previous RewardDistributor/RewardDistributorV2 to sweep
  - SAFE_WALLET_PK: optional private key to use for sweeping/funding (defaults to deployer)
  - FUND_VALUE: optional native value to fund new contract (e.g., "1.0")
*/

import "dotenv/config";
import hre from "hardhat";

async function main() {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const signerAddress = process.env.SIGNER_ADDRESS;
    if (!signerAddress) throw new Error("SIGNER_ADDRESS required");

    const safePk = process.env.SAFE_WALLET_PK;
    const sweepSigner = safePk
        ? new ethers.Wallet(safePk, deployer.provider)
        : deployer;

    console.log("Deployer:", await deployer.getAddress());
    console.log("Sweeper:", await sweepSigner.getAddress());
    console.log("Signer:", signerAddress);

    const prevAddr = process.env.PREV_REWARD_ADDRESS;
    if (prevAddr) {
        console.log("Sweeping previous contract:", prevAddr);
        const prev = await ethers.getContractAt("RewardDistributor", prevAddr, sweepSigner).catch(async () => {
            return ethers.getContractAt("RewardDistributorV2", prevAddr, sweepSigner);
        });
        const to = await sweepSigner.getAddress();
        const tx = await prev.withdrawAll(to);
        console.log("withdrawAll tx:", tx.hash);
        await tx.wait();
        console.log("Previous funds withdrawn to:", to);
    }

    console.log("Deploying RewardDistributorV2...");
    const Factory = await ethers.getContractFactory("RewardDistributorV2", deployer);
    const contract = await Factory.deploy(signerAddress);
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    console.log("RewardDistributorV2 deployed:", address);

    const fundValue = process.env.FUND_VALUE;
    if (fundValue) {
        console.log("Funding new contract with:", fundValue);
        const tx = await sweepSigner.sendTransaction({ to: address, value: ethers.parseEther(fundValue) });
        console.log("fund tx:", tx.hash);
        await tx.wait();
        console.log("Funded", address);
    }
}

main().catch((e) => { console.error(e); process.exit(1); });


