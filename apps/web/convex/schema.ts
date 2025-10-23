import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
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
        totalEarnings: v.number(),
        currentStreak: v.number(),
        longestStreak: v.number(),
        totalInterviews: v.number(),
        rank: v.number(),
        createdAt: v.number(),
        lastActiveAt: v.number(),
    })
        .index("by_wallet", ["walletAddress"])
        .index("by_phone", ["phoneNumber"])
        .index("by_rank", ["rank"]),

    challenges: defineTable({
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
        participants: v.number(),
        startDate: v.number(),
        endDate: v.number(),
        status: v.union(
            v.literal("upcoming"),
            v.literal("active"),
            v.literal("completed")
        ),
        skills: v.array(v.string()),
    })
        .index("by_type", ["type"])
        .index("by_skill_level", ["skillLevel"])
        .index("by_status", ["status"]),

    interviews: defineTable({
        userId: v.id("users"),
        challengeId: v.optional(v.id("challenges")),
        type: v.union(
            v.literal("mock"),
            v.literal("live"),
            v.literal("assessment")
        ),
        skillLevel: v.optional(v.union(
            v.literal("beginner"),
            v.literal("intermediate"),
            v.literal("advanced")
        )),
        interviewType: v.optional(v.union(
            v.literal("technical"),
            v.literal("soft_skills"),
            v.literal("behavioral"),
            v.literal("system_design")
        )),
        skills: v.array(v.string()),
        status: v.union(
            v.literal("not_started"),
            v.literal("in_progress"),
            v.literal("grading"),
            v.literal("completed"),
            v.literal("failed")
        ),
        score: v.optional(v.number()),
        feedback: v.optional(v.string()),
        duration: v.number(),
        startedAt: v.number(),
        completedAt: v.optional(v.number()),
        earnings: v.optional(v.number()),
        vapiCallId: v.optional(v.string()),
    })
        .index("by_user", ["userId"])
        .index("by_challenge", ["challengeId"])
        .index("by_status", ["status"]),

    transactions: defineTable({
        userId: v.id("users"),
        type: v.union(
            v.literal("earned"),
            v.literal("spent"),
            v.literal("withdrawn")
        ),
        amount: v.number(),
        currency: v.union(
            v.literal("celo"),
            v.literal("cUSD"),
            v.literal("USDC"),
            v.literal("USDT"),
            v.literal("badge"),
            v.literal("xp")
        ),
        description: v.string(),
        timestamp: v.number(),
        challengeId: v.optional(v.id("challenges")),
        interviewId: v.optional(v.id("interviews")),
    })
        .index("by_user", ["userId"])
        .index("by_type", ["type"])
        .index("by_timestamp", ["timestamp"]),
});
