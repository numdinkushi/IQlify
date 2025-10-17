import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all challenges
export const getChallenges = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("challenges").collect();
    },
});

// Get challenges by type
export const getChallengesByType = query({
    args: {
        type: v.union(
            v.literal("daily"),
            v.literal("weekly"),
            v.literal("monthly"),
            v.literal("custom")
        )
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("challenges")
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .collect();
    },
});

// Get active challenges
export const getActiveChallenges = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("challenges")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();
    },
});

// Create a new challenge
export const createChallenge = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        type: v.union(
            v.literal("daily"),
            v.literal("weekly"),
            v.literal("monthly"),
            v.literal("custom")
        ),
        skillLevel: v.union(
            v.literal("beginner"),
            v.literal("intermediate"),
            v.literal("advanced")
        ),
        entryFee: v.number(),
        prizePool: v.number(),
        duration: v.number(), // in hours
        skills: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const endDate = now + (args.duration * 60 * 60 * 1000); // Convert hours to milliseconds

        const challengeId = await ctx.db.insert("challenges", {
            title: args.title,
            description: args.description,
            type: args.type,
            skillLevel: args.skillLevel,
            entryFee: args.entryFee,
            prizePool: args.prizePool,
            participants: 0,
            startDate: now,
            endDate: endDate,
            status: "upcoming",
            skills: args.skills,
        });

        return challengeId;
    },
});

// Join a challenge
export const joinChallenge = mutation({
    args: {
        challengeId: v.id("challenges"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const challenge = await ctx.db.get(args.challengeId);
        if (!challenge) throw new Error("Challenge not found");

        // Update participant count
        await ctx.db.patch(args.challengeId, {
            participants: challenge.participants + 1,
            status: challenge.participants === 0 ? "active" : challenge.status,
        });

        // Create transaction record for entry fee
        await ctx.db.insert("transactions", {
            userId: args.userId,
            type: "spent",
            amount: challenge.entryFee,
            currency: "celo",
            description: `Joined challenge: ${challenge.title}`,
            timestamp: Date.now(),
            challengeId: args.challengeId,
        });

        return args.challengeId;
    },
});
