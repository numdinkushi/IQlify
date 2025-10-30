Environment variables (create apps/contracts/.env):

- PRIVATE_KEY: deployer private key (0x...)
- SAFE_WALLET_PK: optional cold wallet private key for sweeping/funding
- SECRET_STRING: secret preimage string (or use SECRET_HASH instead)
- SECRET_HASH: bytes32 hash of the secret (0x...)
- PREV_REWARD_ADDRESS: optional old RewardDistributor to sweep
- FUND_VALUE: optional CELO to fund new contract (e.g., 1.0)
- CELOSCAN_API_KEY: optional scanner API key

Deploy:

- pnpm --filter hardhat compile
- npx hardhat run scripts/deploy-reward.ts --network alfajores
- or: npx hardhat run scripts/deploy-reward.ts --network celo

Notes:

- If PREV_REWARD_ADDRESS is set and you are the owner, the script will call withdrawAll to the SAFE_WALLET_PK (or deployer) before deploying the new contract.
- If FUND_VALUE is set, the SAFE_WALLET_PK (or deployer) will fund the newly deployed contract.

