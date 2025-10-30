"use client";

import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { encodeFunctionData, parseUnits, decodeEventLog } from "viem";
import { REWARD_ABI, REWARD_CONTRACT_ADDRESS } from "@/lib/rewards-contract";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Divvi = require("@divvi/referral-sdk") as any;
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Defaults from env for Divvi
const DIVVI_CONSUMER = (process.env.NEXT_PUBLIC_DIVVI_CONSUMER_ADDRESS || "") as `0x${string}` | "";
const DIVVI_PROVIDERS = (process.env.NEXT_PUBLIC_DIVVI_PROVIDERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as `0x${string}`[];

type ClaimArgs = {
    interviewId: string;
    amountCelo: string; // decimal CELO value from frontend calc
    nonce: number;
    deadline: number; // unix seconds
    referralTag?: `0x${string}`;
    consumer?: `0x${string}`; // Divvi consumer address
    providers?: `0x${string}`[];
    chainId: number;
};

export function useClaimReward() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { sendTransactionAsync } = useSendTransaction();
    const markClaimed = useMutation(api.interviews.markInterviewClaimed);

    const [loading, setLoading] = useState(false);

    const claim = useCallback(async (args: ClaimArgs) => {
        if (!address) throw new Error("Wallet not connected");
        setLoading(true);
        try {
            console.log("[claim] start", args);
            const amountWei = parseUnits(args.amountCelo, 18);
            const payload = {
                user: address,
                amount: amountWei.toString(),
                nonce: args.nonce,
                deadline: args.deadline,
                referralTag: (args.referralTag || "0x0000000000000000000000000000000000000000000000000000000000000000") as `0x${string}`,
            };

            // 1) ask server to sign
            const signRes = await fetch("/api/rewards/sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }).then((r) => r.json());
            if (signRes?.error) throw new Error(signRes.error);
            const { v, r, s } = signRes as { v: number; r: `0x${string}`; s: `0x${string}`; };

            // 2) encode claimWithSignature
            const callData = encodeFunctionData({
                abi: REWARD_ABI as any,
                functionName: "claimWithSignature",
                args: [amountWei, BigInt(args.nonce), BigInt(args.deadline), payload.referralTag, v, r, s],
            });

            // 3) Divvi data suffix (optional - skip if Divvi not configured)
            let suffix = undefined;
            try {
                if (Divvi && typeof Divvi.getDataSuffix === 'function') {
                    const divviConsumer = (args.consumer as any) || (DIVVI_CONSUMER || undefined);
                    const divviProviders = (args.providers as any) || (DIVVI_PROVIDERS.length ? (DIVVI_PROVIDERS as any) : undefined);

                    if (divviConsumer || divviProviders) {
                        suffix = Divvi.getDataSuffix({
                            consumer: divviConsumer,
                            providers: divviProviders,
                        });
                    }
                } else {
                    console.log("[claim] Divvi SDK not available or getDataSuffix not a function, skipping");
                }
            } catch (e) {
                console.log("[claim] Divvi prefix generation failed, continuing without:", e);
            }

            const combinedData = suffix ? (callData + (suffix.startsWith("0x") ? suffix.slice(2) : suffix)) as `0x${string}` : (callData as `0x${string}`);
            console.log("[claim] Divvi suffix status:", { hasSuffix: !!suffix, suffix });
            console.log("[claim] sending tx", { to: REWARD_CONTRACT_ADDRESS, chainId: args.chainId, dataLen: combinedData.length });

            // 4) send tx
            const hash = await sendTransactionAsync({
                to: REWARD_CONTRACT_ADDRESS as `0x${string}`,
                data: combinedData,
                value: BigInt(0), // No CELO value sent, contract will send the reward
                chainId: args.chainId,
            });
            console.log("[claim] tx hash", hash);

            if (!publicClient) throw new Error("No public client");

            // Wait for transaction receipt with timeout
            console.log("[claim] waiting for transaction receipt...");
            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
                timeout: 120000 // 2 minutes timeout
            });
            console.log("[claim] receipt received:", receipt);

            // Check if transaction was successful
            if (receipt.status !== "success") throw new Error("Claim tx failed");

            // Log the logs to verify if RewardClaimed event was emitted
            console.log("[claim] transaction logs:", receipt.logs);

            // Decode RewardClaimed event from logs
            const rewardClaimedEvent = {
                "anonymous": false,
                "inputs": [
                    { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
                    { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
                    { "indexed": false, "internalType": "uint256", "name": "nonce", "type": "uint256" },
                    { "indexed": false, "internalType": "bytes32", "name": "referralTag", "type": "bytes32" }
                ],
                "name": "RewardClaimed",
                "type": "event"
            };

            // Find the RewardClaimed event in the logs
            try {
                for (const log of receipt.logs) {
                    try {
                        const decoded = decodeEventLog({
                            abi: [rewardClaimedEvent],
                            data: log.data,
                            topics: log.topics,
                        });
                        console.log("[claim] ✅ RewardClaimed event decoded:", decoded);
                        console.log("[claim] Reward amount claimed:", amountWei.toString(), "wei");
                        if (decoded.args && Array.isArray(decoded.args)) {
                            console.log("[claim] User who claimed:", (decoded.args as any)[0]);
                        }
                    } catch (e) {
                        // Not the RewardClaimed event, try next log
                    }
                }
            } catch (e) {
                console.log("[claim] ⚠️ Could not decode events from logs:", e);
            }

            // 5) mark claimed in Convex
            await markClaimed({ interviewId: args.interviewId as any, txHash: hash });
            console.log("[claim] marked claimed in Convex");

            // 6) notify Divvi (optional)
            try {
                if (Divvi && typeof Divvi.submitReferral === 'function') {
                    await Divvi.submitReferral({ txHash: hash, chainId: args.chainId });
                    console.log("[claim] Divvi referral submitted");
                } else {
                    console.log("[claim] Divvi SDK not available for referral submission, skipping");
                }
            } catch (e) {
                console.log("[claim] Divvi referral submission error (non-critical):", e);
            }

            return hash;
        } finally {
            setLoading(false);
        }
    }, [address, publicClient, sendTransactionAsync, markClaimed]);

    return { claim, loading };
}


