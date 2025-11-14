import { NextRequest, NextResponse } from "next/server";
import { Wallet } from "ethers";

// Server-only: requires SIGNER_PRIVATE_KEY in env
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY as string;
const REWARD_CONTRACT_ADDRESS = process.env.REWARD_CONTRACT_ADDRESS as string;
const REWARD_CHAIN_ID = Number(process.env.REWARD_CHAIN_ID || 42220);

export async function POST(req: NextRequest) {
    try {
        if (!SIGNER_PRIVATE_KEY) {
            return NextResponse.json({ error: "Missing SIGNER_PRIVATE_KEY" }, { status: 500 });
        }
        if (!REWARD_CONTRACT_ADDRESS) {
            return NextResponse.json({ error: "Missing REWARD_CONTRACT_ADDRESS" }, { status: 500 });
        }

        const body = await req.json();
        console.log("[sign] body:", body);
        const { user, amount, nonce, deadline, referralTag } = body as {
            user: string;
            amount: string | number;
            nonce: number;
            deadline: number;
            referralTag: string;
        };

        const userAddr = user as string;
        if (!userAddr) {
            console.log("[sign] missing user");
            return NextResponse.json({ error: "Missing user" }, { status: 400 });
        }
        let amountBn: bigint;
        try { amountBn = BigInt(amount); } catch {
            console.log("[sign] invalid amount:", amount);
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }
        const referralTagBytes32 = (referralTag || "0x".padEnd(66, '0')) as `0x${string}`;
        if (typeof nonce !== 'number' || typeof deadline !== 'number') {
            console.log("[sign] invalid nonce/deadline:", { nonce, deadline });
            return NextResponse.json({ error: "Invalid nonce/deadline" }, { status: 400 });
        }

        const domain = {
            name: "IQlifyRewardDistributor",
            version: "2",
            chainId: REWARD_CHAIN_ID,
            verifyingContract: REWARD_CONTRACT_ADDRESS,
        } as const;

        const types = {
            Claim: [
                { name: "user", type: "address" },
                { name: "amount", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" },
                { name: "referralTag", type: "bytes32" },
            ],
        };

        const value = {
            user: userAddr,
            amount: amountBn,
            nonce,
            deadline,
            referralTag: referralTagBytes32,
        };

        const signer = new Wallet(SIGNER_PRIVATE_KEY);
        // ethers v6 typed-data signing
        const signature = await signer.signTypedData(domain, types, value) as `0x${string}`;
        const r = signature.slice(0, 66) as `0x${string}`; // 32 bytes
        const s = ("0x" + signature.slice(66, 130)) as `0x${string}`; // next 32 bytes
        const v = parseInt(signature.slice(130, 132), 16);

        console.log("[sign] success v,r,s:", v, r, s);
        // Only return the signature parts to avoid BigInt serialization issues
        return NextResponse.json({ v, r, s });
    } catch (e: any) {
        console.error("[sign] error:", e?.message, e?.stack);
        return NextResponse.json({ error: e?.message || "failed" }, { status: 400 });
    }
}


