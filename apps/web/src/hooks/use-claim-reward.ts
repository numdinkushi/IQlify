"use client";

import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { encodeFunctionData, parseUnits, decodeEventLog } from "viem";
import { REWARD_ABI, REWARD_CONTRACT_ADDRESS, REWARD_CHAIN_ID } from "@/lib/rewards-contract";
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
            let shouldSubmitToDivvi = false;
            try {
                if (Divvi && typeof Divvi.getDataSuffix === 'function') {
                    const divviConsumer = (args.consumer as any) || (DIVVI_CONSUMER || undefined);
                    const divviProviders = (args.providers as any) || (DIVVI_PROVIDERS.length ? (DIVVI_PROVIDERS as any) : undefined);

                    if (divviConsumer || divviProviders) {
                        suffix = Divvi.getDataSuffix({
                            consumer: divviConsumer,
                            providers: divviProviders,
                        });

                        // Validate suffix format
                        if (suffix && typeof suffix === 'string' && suffix.length > 0) {
                            shouldSubmitToDivvi = true;
                            console.log("[claim] Divvi suffix generated successfully");
                        } else {
                            console.log("[claim] Divvi suffix is invalid, skipping Divvi integration");
                            suffix = undefined;
                        }
                    } else {
                        console.log("[claim] Divvi consumer/providers not configured, skipping");
                    }
                } else {
                    console.log("[claim] Divvi SDK not available or getDataSuffix not a function, skipping");
                }
            } catch (e) {
                console.log("[claim] Divvi suffix generation failed, continuing without:", e);
                suffix = undefined;
            }

            // Combine callData with suffix if valid
            // callData already has "0x" prefix, suffix should be hex without "0x"
            let combinedData: `0x${string}`;
            if (suffix && shouldSubmitToDivvi) {
                const suffixHex = suffix.startsWith("0x") ? suffix.slice(2) : suffix;
                combinedData = (callData + suffixHex) as `0x${string}`;
            } else {
                combinedData = callData as `0x${string}`;
            }

            console.log("[claim] Divvi suffix status:", {
                hasSuffix: !!suffix && shouldSubmitToDivvi,
                suffixLength: suffix ? suffix.length : 0,
                shouldSubmitToDivvi
            });
            console.log("[claim] sending tx", {
                to: REWARD_CONTRACT_ADDRESS,
                chainId: args.chainId,
                dataLen: combinedData.length,
                amountCelo: args.amountCelo,
                amountWei: amountWei.toString()
            });

            // Validate amount is not zero
            if (amountWei === BigInt(0)) {
                throw new Error("Cannot claim zero amount. Please check the earnings value.");
            }

            // 4) send tx
            // Note: value is 0 because the user is NOT sending CELO to the contract.
            // The contract will send the reward amount to the user via an internal transfer.
            // This is why MetaMask/CeloScan show 0 CELO - they show the transaction value (what's sent TO the contract),
            // not what the contract sends back. The actual reward is sent by the contract in claimWithSignature().
            const hash = await sendTransactionAsync({
                to: REWARD_CONTRACT_ADDRESS as `0x${string}`,
                data: combinedData,
                value: BigInt(0), // Transaction value is 0 - contract sends reward via internal transfer
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

            // Find the RewardClaimed event in the logs and extract the actual amount
            let claimedAmountWei = amountWei; // Default to requested amount
            try {
                for (const log of receipt.logs) {
                    try {
                        const decoded = decodeEventLog({
                            abi: [rewardClaimedEvent],
                            data: log.data,
                            topics: log.topics,
                        });
                        console.log("[claim] ✅ RewardClaimed event decoded:", decoded);

                        // Extract the actual amount from the event
                        if (decoded.args && Array.isArray(decoded.args) && decoded.args.length >= 2) {
                            claimedAmountWei = BigInt(decoded.args[1] as string | bigint);
                            console.log("[claim] Reward amount claimed:", claimedAmountWei.toString(), "wei");
                            console.log("[claim] Reward amount claimed:", (Number(claimedAmountWei) / 1e18).toFixed(6), "CELO");
                            console.log("[claim] User who claimed:", (decoded.args as any)[0]);
                        } else {
                            console.log("[claim] Reward amount claimed:", amountWei.toString(), "wei");
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

            // Return the claimed amount in CELO for UI display
            const claimedAmountCelo = (Number(claimedAmountWei) / 1e18).toFixed(6);

            // Verify the internal transfer by checking if RewardClaimed event was emitted
            // Note: The actual CELO transfer happens as an internal transaction, not visible
            // in the main "Transactions" tab on CeloScan. Check "Internal Transactions" tab.
            console.log("[claim] ✅ Claim successful!");
            console.log("[claim] Amount claimed:", claimedAmountCelo, "CELO");
            console.log("[claim] Transaction hash:", hash);
            console.log("[claim] ⚠️ Note: CeloScan 'Transactions' tab shows 0 CELO because you're not sending CELO to the contract.");
            console.log("[claim] ⚠️ The contract sends CELO to you via internal transfer. Check 'Internal Transactions' tab on CeloScan.");

            // 6) notify Divvi (optional - only if suffix was successfully generated)
            if (shouldSubmitToDivvi) {
                try {
                    if (Divvi && typeof Divvi.submitReferral === 'function') {
                        await Divvi.submitReferral({ txHash: hash, chainId: args.chainId });
                        console.log("[claim] Divvi referral submitted successfully");
                    } else {
                        console.log("[claim] Divvi SDK not available for referral submission, skipping");
                    }
                } catch (e) {
                    // Log error but don't fail the claim - Divvi submission is non-critical
                    console.log("[claim] Divvi referral submission error (non-critical):", e);
                }
            } else {
                console.log("[claim] Skipping Divvi referral submission (suffix not generated or invalid)");
            }

            // Return hash and claimed amount for UI display
            return { hash, claimedAmountCelo };
        } finally {
            setLoading(false);
        }
    }, [address, publicClient, sendTransactionAsync, markClaimed]);

    return { claim, loading };
}


