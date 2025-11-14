# Testing Checklist - MiniPay Reward Claims

## Prerequisites Checklist

### ✅ Code Setup (Already Done)
- [x] Wagmi configuration with Celo/Alfajores chains
- [x] Dynamic chain ID detection
- [x] MiniPay test chain ID normalization
- [x] Environment-aware configuration
- [x] Chain switching logic

### ⚠️ Missing Requirements to Test

## 1. Smart Contract Deployment to Alfajores

**Status:** ❌ Not Deployed

You need to deploy a `RewardDistributorV2` contract to Alfajores testnet.

### Steps:

```bash
cd apps/contracts

# 1. Create .env file
cat > .env << 'EOF'
PRIVATE_KEY=0x_YOUR_TESTNET_PRIVATE_KEY
SIGNER_ADDRESS=0x_YOUR_SIGNER_ADDRESS
FUND_VALUE=1.0
EOF

# 2. Get a testnet wallet
# - Create or import a wallet in MetaMask
# - Get testnet CELO from https://faucet.celo.org
# - Get testnet tokens for your wallet

# 3. Create a signer wallet (can be same as deployer)
# - Generate or import a wallet
# - Save the address as SIGNER_ADDRESS
# - Save the private key for SIGNER_PRIVATE_KEY in web/.env.local

# 4. Compile contracts
pnpm install
pnpm compile

# 5. Deploy to Alfajores
npx hardhat run scripts/deploy-reward-v2.ts --network alfajores

# 6. Save the deployed contract address
# Copy the "RewardDistributorV2 deployed: 0x..." address
```

**Required:** Contract address from step 6

## 2. Web App Environment Configuration

**Status:** ❌ Environment Not Configured

You need to create `apps/web/.env.local` with the deployed contract details.

### Steps:

```bash
cd apps/web

# Create .env.local file
cat > .env.local << 'EOF'
# Testnet Configuration for MiniPay Testing
NODE_ENV=development

# Use Alfajores testnet
NEXT_PUBLIC_USE_TESTNET=true

# Contract address from deployment step 1
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=0x_DEPLOYED_CONTRACT_ADDRESS

# Server-side signing
REWARD_CONTRACT_ADDRESS=0x_DEPLOYED_CONTRACT_ADDRESS
REWARD_CHAIN_ID=44787

# Signer private key (must match SIGNER_ADDRESS from deployment)
SIGNER_PRIVATE_KEY=0x_YOUR_SIGNER_PRIVATE_KEY
EOF
```

**Required:** 
- Deployed contract address
- Signer private key

## 3. Contract Funding

**Status:** ❌ Contract Needs Funding

Your contract needs to hold CELO tokens to pay out rewards.

### Steps:

1. If you used `FUND_VALUE=1.0` during deployment, this is done
2. If not, send testnet CELO to the contract address
3. Get testnet CELO from https://faucet.celo.org

**Required:** Contract balance > 0

## 4. MiniPay Setup

**Status:** ⚠️ Need to Verify

### Verify:
- [ ] MiniPay app installed and set up
- [ ] MiniPay in test mode (or production if testing production)
- [ ] Can connect wallet to the web app
- [ ] Can complete an interview in the app
- [ ] Interview completion creates earnings > 0

## 5. Testing Flow

Once everything is set up:

1. Start the web app:
   ```bash
   cd apps/web
   pnpm dev
   ```

2. Open in MiniPay
   - Load your local dev server or deployed test URL
   - Connect wallet (should auto-detect)
   - Verify chain detection logs in console

3. Complete an interview
   - Go through the interview flow
   - Ensure you get a completion with earnings > 0

4. Claim rewards
   - Click "Claim Rewards" button
   - Approve any network switch if prompted
   - Approve transaction in MiniPay
   - Wait for confirmation

5. Verify
   - Check transaction on Alfajores explorer
   - Verify contract balance decreased
   - Verify your wallet balance increased

## Quick Start Script

To save time, here's what you need to create:

### For Contract Deployment (`apps/contracts/.env`):
```
PRIVATE_KEY=0x_YOUR_TESTNET_DEPLOYER_KEY
SIGNER_ADDRESS=0x_YOUR_SIGNER_ADDRESS
FUND_VALUE=1.0
```

### For Web App (`apps/web/.env.local`):
```
NODE_ENV=development
NEXT_PUBLIC_USE_TESTNET=true
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=0x_DEPLOYED_ADDRESS
REWARD_CONTRACT_ADDRESS=0x_DEPLOYED_ADDRESS
REWARD_CHAIN_ID=44787
SIGNER_PRIVATE_KEY=0x_SIGNER_KEY
```

## Common Issues

### "SIGNER_ADDRESS required"
- Add `SIGNER_ADDRESS` to `apps/contracts/.env`
- This should be the address you control (for signing claim messages)

### "Missing SIGNER_PRIVATE_KEY"
- Add `SIGNER_PRIVATE_KEY` to `apps/web/.env.local`
- This should be the private key for the `SIGNER_ADDRESS`

### Contract not found on Alfajores
- Verify contract address is correct
- Check Alfajores explorer: https://alfajores.celoscan.io
- Ensure contract was deployed to Alfajores, not mainnet

### Transaction reverts
- Check contract has sufficient balance
- Verify signer address matches
- Check chain ID is correct (should be 44787 for Alfajores)

## Next Steps

1. **Deploy contract to Alfajores** (if not done)
2. **Create web app .env.local** with contract details
3. **Fund the contract** with testnet CELO
4. **Test in MiniPay** following the testing flow above

Once all checkboxes are checked, you're ready to test!

