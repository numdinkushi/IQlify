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
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        profileImage: v.optional(v.string()),
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
            // Update existing user - only update fields that are provided
            const updateData: any = {
                lastActiveAt: now,
            };

            if (args.phoneNumber !== undefined) updateData.phoneNumber = args.phoneNumber;
            if (args.email !== undefined) updateData.email = args.email;
            if (args.firstName !== undefined) updateData.firstName = args.firstName;
            if (args.lastName !== undefined) updateData.lastName = args.lastName;
            if (args.profileImage !== undefined) updateData.profileImage = args.profileImage;
            if (args.skillLevel !== undefined) updateData.skillLevel = args.skillLevel;

            await ctx.db.patch(existingUser._id, updateData);
            return existingUser._id;
        } else {
            // Create new user
            const userId = await ctx.db.insert("users", {
                walletAddress: args.walletAddress,
                phoneNumber: args.phoneNumber,
                email: args.email,
                firstName: args.firstName,
                lastName: args.lastName,
                profileImage: args.profileImage,
                skillLevel: args.skillLevel,
                totalEarnings: 0,
                currentStreak: 0,
                longestStreak: 0,
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
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        const newLongestStreak = Math.max(user.longestStreak, args.newStreak);

        await ctx.db.patch(args.userId, {
            currentStreak: args.newStreak,
            longestStreak: newLongestStreak,
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

// Update user profile
export const updateUserProfile = mutation({
    args: {
        userId: v.id("users"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        email: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        profileImage: v.optional(v.string()),
        skillLevel: v.optional(v.union(
            v.literal("beginner"),
            v.literal("intermediate"),
            v.literal("advanced")
        )),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        const updateData: any = {
            lastActiveAt: Date.now(),
        };

        if (args.firstName !== undefined) updateData.firstName = args.firstName;
        if (args.lastName !== undefined) updateData.lastName = args.lastName;
        if (args.email !== undefined) updateData.email = args.email;
        if (args.phoneNumber !== undefined) updateData.phoneNumber = args.phoneNumber;
        if (args.profileImage !== undefined) updateData.profileImage = args.profileImage;
        if (args.skillLevel !== undefined) updateData.skillLevel = args.skillLevel;

        await ctx.db.patch(args.userId, updateData);
        return await ctx.db.get(args.userId);
    },
});
