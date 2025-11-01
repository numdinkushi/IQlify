// Use different contract addresses based on environment
const getRewardContractAddress = () => {
    // If explicitly set, use that
    if (process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS) {
        return process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS;
    }

    // Default to mainnet address
    return "0x0B38E0A867f97Fea1F39488c3ee022E3DD486F12";
};

export const REWARD_CONTRACT_ADDRESS = getRewardContractAddress();

// Get the chain ID based on environment
export const getRewardChainId = (): number => {
    // If explicitly set, use that
    if (process.env.NEXT_PUBLIC_REWARD_CHAIN_ID) {
        return parseInt(process.env.NEXT_PUBLIC_REWARD_CHAIN_ID, 10);
    }

    // Only use Alfajores if explicitly requested via NEXT_PUBLIC_USE_TESTNET
    if (process.env.NEXT_PUBLIC_USE_TESTNET === 'true') {
        return 44787; // Alfajores testnet
    }

    // Default to mainnet (production and development)
    return 42220; // Celo mainnet
};

export const REWARD_CHAIN_ID = getRewardChainId();

// Helper to normalize MiniPay test chain IDs
// MiniPay test environment uses chain IDs like 11142220 (which should map to mainnet 42220)
export const normalizeChainId = (chainId: number): number => {
    // MiniPay test mode mainnet: 11142220 -> 42220
    if (chainId === 11142220) {
        console.log('[rewards] Detected MiniPay test mainnet chain ID:', chainId, 'normalized to:', 42220);
        return 42220;
    }

    // MiniPay test mode Alfajores: 11144787 -> 44787
    if (chainId === 11144787) {
        console.log('[rewards] Detected MiniPay test Alfajores chain ID:', chainId, 'normalized to:', 44787);
        return 44787;
    }

    return chainId;
};

export const REWARD_ABI = [
    {
        inputs: [
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "bytes32", name: "referralTag", type: "bytes32" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "claimWithSignature",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getContractBalance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];


