export const REWARD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS || "0x0B38E0A867f97Fea1F39488c3ee022E3DD486F12";

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


