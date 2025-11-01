# Testnet Setup for MiniPay Testing

This guide explains how to test reward claims on Alfajores testnet when testing in MiniPay.

## Environment Variables

The app automatically switches between testnet and mainnet based on environment variables:

### For Development/Testnet Testing

Create a `.env.local` file in `apps/web/`:

```bash
# Testnet Configuration
NODE_ENV=development
NEXT_PUBLIC_USE_TESTNET=true

# Alfajores Testnet Contract Address (deploy one first)
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=0x_YOUR_ALFAJORES_CONTRACT_ADDRESS

# Or let it auto-detect based on NODE_ENV or NEXT_PUBLIC_USE_TESTNET
# NEXT_PUBLIC_REWARD_CHAIN_ID=44787

# Server-side signing (must match the contract's signer)
SIGNER_PRIVATE_KEY=0x_YOUR_SIGNER_PRIVATE_KEY
REWARD_CONTRACT_ADDRESS=0x_YOUR_ALFAJORES_CONTRACT_ADDRESS
REWARD_CHAIN_ID=44787
```

### For Production/Mainnet

```bash
# Mainnet Configuration
NODE_ENV=production
# NEXT_PUBLIC_USE_TESTNET= should NOT be set or false

# Celo Mainnet Contract Address
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=0x0B38E0A867f97Fea1F39488c3ee022E3DD486F12

# Or explicitly set if needed
# NEXT_PUBLIC_REWARD_CHAIN_ID=42220

# Server-side signing
SIGNER_PRIVATE_KEY=0x_YOUR_PRODUCTION_SIGNER_PRIVATE_KEY
REWARD_CONTRACT_ADDRESS=0x0B38E0A867f97Fea1F39488c3ee022E3DD486F12
REWARD_CHAIN_ID=42220
```

## How It Works

### Automatic Chain Detection

1. **Development Mode**: When `NODE_ENV=development`, the app defaults to Alfajores (44787)
2. **Testnet Flag**: Setting `NEXT_PUBLIC_USE_TESTNET=true` forces testnet mode even in production builds
3. **Explicit Override**: `NEXT_PUBLIC_REWARD_CHAIN_ID` can be set to explicitly choose the chain
4. **Default**: If none of the above are set, defaults to Celo Mainnet (42220)

### Chain Switching Behavior

- The app checks the current chain ID on reward claim
- If on the wrong chain, shows a warning with "Switch Network" button
- Uses wagmi's `switchChain` with fallback to `window.ethereum.request`
- Automatically detects MiniPay and handles test mode chain IDs

## Deploying to Alfajores Testnet

### 1. Set Up Environment

Create `apps/contracts/.env`:

```bash
PRIVATE_KEY=0x_YOUR_DEPLOYER_PRIVATE_KEY
SIGNER_ADDRESS=0x_SIGNER_ADDRESS
FUND_VALUE=1.0  # Optional: fund contract with test CELO
```

### 2. Deploy Contract

```bash
cd apps/contracts

# Compile contracts
pnpm compile

# Deploy to Alfajores
npx hardhat run scripts/deploy-reward-v2.ts --network alfajores
```

### 3. Update Environment Variables

Copy the deployed contract address to `apps/web/.env.local`:

```bash
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=0x_DEPLOYED_ADDRESS
REWARD_CONTRACT_ADDRESS=0x_DEPLOYED_ADDRESS
```

### 4. Fund the Contract

Get testnet tokens from https://faucet.celo.org and fund your contract:

```bash
# Option 1: Fund during deployment (use FUND_VALUE in contracts/.env)
# Option 2: Fund manually via MetaMask or similar
```

### 5. Test in MiniPay

1. Start dev server: `cd apps/web && pnpm dev`
2. Open in MiniPay test mode
3. Connect wallet (should auto-detect)
4. Complete an interview
5. Claim rewards - should work on Alfajores testnet

## Production Deployment

For production, ensure your environment variables are set to mainnet:

```bash
NODE_ENV=production
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=0x0B38E0A867f97Fea1F39488c3ee022E3DD486F12
REWARD_CONTRACT_ADDRESS=0x0B38E0A867f97Fea1F39488c3ee022E3DD486F12
REWARD_CHAIN_ID=42220
SIGNER_PRIVATE_KEY=0x_PRODUCTION_SIGNER_KEY
```

## Chain IDs Reference

- **Celo Mainnet**: 42220 (0xa4ec)
- **Alfajores Testnet**: 44787 (0xaf0b)
- **MiniPay Test Mainnet**: 11142220 (auto-normalized to 42220)
- **MiniPay Test Alfajores**: 11144787 (auto-normalized to 44787)

## MiniPay Test Chain ID Normalization

MiniPay's test environment uses special chain IDs:
- `11142220` maps to Celo Mainnet (42220)
- `11144787` maps to Alfajores Testnet (44787)

The app automatically normalizes these chain IDs when detected, so you don't need to handle them manually.

## Troubleshooting

### MiniPay Chain Mismatch

If you see chain ID `11142220` or `11144787` in MiniPay:
- These are MiniPay's test environment chain IDs
- They are automatically normalized:
  - `11142220` → `42220` (Celo Mainnet)
  - `11144787` → `44787` (Alfajores Testnet)
- For MiniPay testing, set `NEXT_PUBLIC_USE_TESTNET=true` or `NODE_ENV=development` to use Alfajores
- The normalization handles the chain ID conversion automatically

### Switch Network Fails

1. Ensure the target chain is configured in wagmi (already done for Celo/Alfajores)
2. Check MiniPay settings - may need manual network configuration
3. Try the fallback `window.ethereum.request` (already implemented)

### Contract Not Found

1. Verify contract is deployed on the correct network
2. Check `REWARD_CONTRACT_ADDRESS` matches deployed address
3. Ensure contract is funded with native tokens

## Testing Checklist

- [ ] Contract deployed to Alfajores
- [ ] Environment variables set correctly
- [ ] Contract funded with test tokens
- [ ] Frontend configured for testnet
- [ ] Can connect wallet in MiniPay
- [ ] Can complete interview
- [ ] Can claim rewards
- [ ] Transaction appears on Alfajores explorer

