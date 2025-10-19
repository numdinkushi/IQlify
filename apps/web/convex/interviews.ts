import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new interview session
export const createInterview = mutation({
    args: {
        userId: v.id("users"),
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
        duration: v.number(),
        vapiCallId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const interviewId = await ctx.db.insert("interviews", {
            userId: args.userId,
            type: args.type,
            skillLevel: args.skillLevel,
            interviewType: args.interviewType,
            skills: [], // Will be populated based on interview type
            status: "not_started",
            duration: args.duration,
            startedAt: now,
            vapiCallId: args.vapiCallId,
        });

        return interviewId;
    },
});

// Update interview session
export const updateInterview = mutation({
    args: {
        interviewId: v.id("interviews"),
        status: v.optional(v.union(
            v.literal("not_started"),
            v.literal("in_progress"),
            v.literal("completed"),
            v.literal("failed")
        )),
        score: v.optional(v.number()),
        feedback: v.optional(v.string()),
        earnings: v.optional(v.number()),
        completedAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { interviewId, ...updates } = args;

        // Remove undefined values
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
        );

        await ctx.db.patch(interviewId, cleanUpdates);

        return await ctx.db.get(interviewId);
    },
});

// Get user's interview history
export const getUserInterviews = query({
    args: {
        userId: v.id("users"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const interviews = await ctx.db
            .query("interviews")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(args.limit || 10);

        return interviews;
    },
});

// Get interview statistics for a user
export const getUserInterviewStats = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const interviews = await ctx.db
            .query("interviews")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const completedInterviews = interviews.filter(i => i.status === "completed" && i.score !== undefined);

        const totalInterviews = completedInterviews.length;
        const averageScore = totalInterviews > 0
            ? completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / totalInterviews
            : 0;

        const totalEarnings = completedInterviews.reduce((sum, i) => sum + (i.earnings || 0), 0);

        // Calculate current streak
        const sortedInterviews = completedInterviews.sort((a, b) => b.completedAt! - a.completedAt!);
        let currentStreak = 0;
        let currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        for (const interview of sortedInterviews) {
            const daysSinceCompletion = (currentTime - interview.completedAt!) / oneDay;
            if (daysSinceCompletion <= 1) {
                currentStreak++;
                currentTime -= oneDay; // Move back one day for next iteration
            } else {
                break;
            }
        }

        // Calculate longest streak (simplified)
        let longestStreak = 0;
        let tempStreak = 0;
        for (let i = 0; i < sortedInterviews.length - 1; i++) {
            const current = sortedInterviews[i];
            const next = sortedInterviews[i + 1];
            const daysBetween = (current.completedAt! - next.completedAt!) / oneDay;

            if (daysBetween <= 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 0;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return {
            totalInterviews,
            averageScore,
            totalEarnings,
            currentStreak,
            longestStreak,
        };
    },
});

// Update user statistics after interview completion
export const updateUserStatsAfterInterview = mutation({
    args: {
        userId: v.id("users"),
        score: v.number(),
        earnings: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        const now = Date.now();
        const updateData: any = {
            lastActiveAt: now,
            totalInterviews: user.totalInterviews + 1,
            totalEarnings: user.totalEarnings + args.earnings,
        };

        // Update streak logic
        const oneDay = 24 * 60 * 60 * 1000;
        const daysSinceLastActive = (now - user.lastActiveAt) / oneDay;

        if (daysSinceLastActive <= 1) {
            // Continuing streak
            updateData.currentStreak = user.currentStreak + 1;
        } else {
            // New streak
            updateData.currentStreak = 1;
        }

        // Update longest streak
        updateData.longestStreak = Math.max(user.longestStreak, updateData.currentStreak);

        await ctx.db.patch(args.userId, updateData);

        return await ctx.db.get(args.userId);
    },
});

// Get interview by ID
export const getInterview = query({
    args: {
        interviewId: v.id("interviews"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.interviewId);
    },
});

// Get active interview for user
export const getActiveInterview = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const activeInterview = await ctx.db
            .query("interviews")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("status"), "in_progress"))
            .first();

        return activeInterview;
    },
});
