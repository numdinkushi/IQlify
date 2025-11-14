"use client";

import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useSendTransaction, useChainId } from "wagmi";
import { encodeFunctionData, parseUnits, decodeEventLog } from "viem";
import { REWARD_ABI, REWARD_CONTRACT_ADDRESS, REWARD_CHAIN_ID } from "@/lib/rewards-contract";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Divvi = require("@divvi/referral-sdk") as any;
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { isValidAddress } from "@/lib/app-utils";

// Defaults from env for Divvi - with validation
const DIVVI_CONSUMER_RAW = process.env.NEXT_PUBLIC_DIVVI_CONSUMER_ADDRESS || "";
const DIVVI_CONSUMER = DIVVI_CONSUMER_RAW && isValidAddress(DIVVI_CONSUMER_RAW)
    ? (DIVVI_CONSUMER_RAW as `0x${string}`)
    : "" as `0x${string}` | "";

const DIVVI_PROVIDERS_RAW = (process.env.NEXT_PUBLIC_DIVVI_PROVIDERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const DIVVI_PROVIDERS = DIVVI_PROVIDERS_RAW
    .filter((addr) => isValidAddress(addr))
    .map((addr) => addr as `0x${string}`);

// Log invalid addresses for debugging
if (DIVVI_CONSUMER_RAW && !DIVVI_CONSUMER) {
    console.warn("[Divvi] Invalid consumer address:", DIVVI_CONSUMER_RAW);
}
const invalidProviders = DIVVI_PROVIDERS_RAW.filter((addr) => !isValidAddress(addr));
if (invalidProviders.length > 0) {
    console.warn("[Divvi] Invalid provider addresses filtered out:", invalidProviders);
}

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
    const chainId = useChainId();
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

            // 3) Divvi referral tag (optional - skip if Divvi not configured)
            // Using Divvi SDK v2: getReferralTag() instead of getDataSuffix()
            let referralTag = undefined;
            let shouldSubmitToDivvi = false;
            try {
                // Check for both v1 (getDataSuffix) and v2 (getReferralTag) methods for compatibility
                const hasGetReferralTag = Divvi && typeof Divvi.getReferralTag === 'function';
                const hasGetDataSuffix = Divvi && typeof Divvi.getDataSuffix === 'function';

                if (hasGetReferralTag || hasGetDataSuffix) {
                    // Validate and filter addresses
                    const rawConsumer = (args.consumer as any) || DIVVI_CONSUMER;
                    const rawProviders = (args.providers as any) || DIVVI_PROVIDERS;

                    // Validate consumer address
                    const divviConsumer = rawConsumer && isValidAddress(rawConsumer)
                        ? rawConsumer
                        : undefined;

                    // Validate and filter provider addresses
                    const divviProviders = Array.isArray(rawProviders)
                        ? rawProviders.filter((addr: any) => addr && isValidAddress(addr))
                        : undefined;


                    // Providers are optional - Divvi tracking works with just consumer address
                    if (divviConsumer || (divviProviders && divviProviders.length > 0)) {
                        // Prefer v2 API (getReferralTag) which requires user address
                        if (hasGetReferralTag) {
                            const tagParams: any = {
                                user: address, // Required in v2: the user address making the transaction
                            };
                            // Consumer is required for Divvi tracking
                            if (divviConsumer) tagParams.consumer = divviConsumer;
                            // Providers are optional - only include if valid addresses exist
                            if (divviProviders && divviProviders.length > 0) tagParams.providers = divviProviders;

                            referralTag = Divvi.getReferralTag(tagParams);
                        } else if (hasGetDataSuffix) {
                            // Fallback to v1 API for backward compatibility
                            const tagParams: any = {};
                            if (divviConsumer) tagParams.consumer = divviConsumer;
                            if (divviProviders && divviProviders.length > 0) tagParams.providers = divviProviders;

                            referralTag = Divvi.getDataSuffix(tagParams);
                        }

                        // Validate tag format
                        if (referralTag && typeof referralTag === 'string' && referralTag.length > 0) {
                            shouldSubmitToDivvi = true;
                        } else {
                            referralTag = undefined;
                        }
                    }
                }
            } catch (e) {
                // Silently fail - Divvi is optional
                referralTag = undefined;
            }

            // Combine callData with referral tag if valid
            // callData already has "0x" prefix, tag should be hex without "0x"
            let combinedData: `0x${string}`;
            if (referralTag && shouldSubmitToDivvi) {
                const tagHex = referralTag.startsWith("0x") ? referralTag.slice(2) : referralTag;
                combinedData = (callData + tagHex) as `0x${string}`;
            } else {
                combinedData = callData as `0x${string}`;
            }

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

            // 4) send tx via MiniPay (when available) or standard wallet
            // MiniPay Integration: When running in MiniPay, sendTransactionAsync automatically uses MiniPay's
            // injected Ethereum provider (window.ethereum.isMiniPay), ensuring all payments go through MiniPay
            // as required by the Celo MiniPay Hackathon requirements.
            // 
            // IMPORTANT: For MiniPay test mode, we must use the ACTUAL wallet chain ID (11142220 or 11144787)
            // instead of the normalized one (42220 or 44787). Wagmi needs the actual chain ID that MiniPay is on.
            // The normalization is only for validation/comparison, not for the transaction itself.
            // 
            // Note: value is 0 because the user is NOT sending CELO to the contract.
            // The contract will send the reward amount to the user via an internal transfer.
            // This is why MetaMask/CeloScan show 0 CELO - they show the transaction value (what's sent TO the contract),
            // not what the contract sends back. The actual reward is sent by the contract in claimWithSignature().

            // Use the actual chain ID from the wallet (not normalized) for the transaction
            // This ensures MiniPay test mode (11142220) works correctly with wagmi
            const txChainId = chainId || args.chainId;

            const hash = await sendTransactionAsync({
                to: REWARD_CONTRACT_ADDRESS as `0x${string}`,
                data: combinedData,
                value: BigInt(0), // Transaction value is 0 - contract sends reward via internal transfer
                chainId: txChainId, // Use actual wallet chain ID (supports MiniPay test mode 11142220)
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

            // 6) notify Divvi (optional - only if referral tag was successfully generated)
            let divviSubmissionResult = null;
            if (shouldSubmitToDivvi) {
                try {
                    if (Divvi && typeof Divvi.submitReferral === 'function') {
                        // Use the actual chain ID for Divvi submission (same as transaction)
                        divviSubmissionResult = await Divvi.submitReferral({
                            txHash: hash,
                            chainId: txChainId
                        });
                    }
                } catch (e) {
                    // Log error but don't fail the claim - Divvi submission is non-critical
                    console.error("[claim] Divvi referral submission error (non-critical):", e);
                    divviSubmissionResult = { error: e instanceof Error ? e.message : String(e) };
                }
            }

            // Return hash, claimed amount, and Divvi tracking info for UI display
            return {
                hash,
                claimedAmountCelo,
                divviTracking: {
                    enabled: shouldSubmitToDivvi,
                    tagGenerated: !!referralTag,
                    submitted: divviSubmissionResult !== null && !divviSubmissionResult?.error,
                    submissionResult: divviSubmissionResult,
                }
            };
        } finally {
            setLoading(false);
        }
    }, [address, publicClient, sendTransactionAsync, markClaimed, chainId]);

    return { claim, loading };
}


