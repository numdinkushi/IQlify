import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get user by wallet address
export const getUserByWallet = query({
    args: { walletAddress: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
            .first();
    },
});

// Create or update user
export const upsertUser = mutation({
    args: {
        walletAddress: v.string(),
        phoneNumber: v.optional(v.string()),
        email: v.optional(v.string()),
        fullName: v.optional(v.string()),
        skillLevel: v.union(
            v.literal("beginner"),
            v.literal("intermediate"),
            v.literal("advanced")
        ),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
            .first();

        const now = Date.now();

        if (existingUser) {
            // Update existing user
            await ctx.db.patch(existingUser._id, {
                phoneNumber: args.phoneNumber,
                email: args.email,
                fullName: args.fullName,
                skillLevel: args.skillLevel,
                lastActiveAt: now,
            });
            return existingUser._id;
        } else {
            // Create new user
            const userId = await ctx.db.insert("users", {
                walletAddress: args.walletAddress,
                phoneNumber: args.phoneNumber,
                email: args.email,
                fullName: args.fullName,
                skillLevel: args.skillLevel,
                totalEarnings: 0,
                currentStreak: 0,
                totalInterviews: 0,
                rank: 0,
                createdAt: now,
                lastActiveAt: now,
            });
            return userId;
        }
    },
});

// Update user streak
export const updateStreak = mutation({
    args: { userId: v.id("users"), newStreak: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            currentStreak: args.newStreak,
            lastActiveAt: Date.now(),
        });
    },
});

// Update user earnings
export const updateEarnings = mutation({
    args: {
        userId: v.id("users"),
        amount: v.number(),
        currency: v.union(
            v.literal("celo"),
            v.literal("cUSD"),
            v.literal("USDC"),
            v.literal("USDT"),
            v.literal("badge"),
            v.literal("xp")
        ),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        // Update total earnings (convert to CELO equivalent)
        const earningsInCelo = args.currency === "celo" ? args.amount : args.amount * 0.1; // Simple conversion
        const newTotalEarnings = user.totalEarnings + earningsInCelo;

        await ctx.db.patch(args.userId, {
            totalEarnings: newTotalEarnings,
        });

        // Create transaction record
        await ctx.db.insert("transactions", {
            userId: args.userId,
            type: "earned",
            amount: args.amount,
            currency: args.currency,
            description: `Earned ${args.amount} ${args.currency.toUpperCase()}`,
            timestamp: Date.now(),
        });
    },
});
