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
            v.literal("grading"),
            v.literal("completed"),
            v.literal("failed")
        )),
        score: v.optional(v.number()),
        feedback: v.optional(v.string()),
        earnings: v.optional(v.number()),
        completedAt: v.optional(v.number()),
        vapiCallId: v.optional(v.string()),
        claimed: v.optional(v.boolean()),
        claimedAt: v.optional(v.number()),
        claimTxHash: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { interviewId, ...updates } = args;

        // Get interview before updating to check if it was already completed
        const existingInterview = await ctx.db.get(interviewId);
        if (!existingInterview) {
            throw new Error("Interview not found");
        }

        // Check if interview was already completed (to avoid double-counting)
        const wasAlreadyCompleted = existingInterview.status === "completed" &&
            existingInterview.score !== undefined &&
            existingInterview.earnings !== undefined;

        // If status is being set to "completed" and completedAt is not provided, set it automatically
        if (args.status === "completed" && !args.completedAt && !existingInterview.completedAt) {
            updates.completedAt = Date.now();
        }

        // Remove undefined values
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
        );

        await ctx.db.patch(interviewId, cleanUpdates);

        const updatedInterview = await ctx.db.get(interviewId);
        if (!updatedInterview) {
            throw new Error("Interview not found");
        }

        // If interview was just marked as completed, recalculate user streak and update stats
        // Only update if this is the first time it's being marked as completed
        if (args.status === "completed" && "userId" in updatedInterview && updatedInterview.userId && updatedInterview.completedAt) {
            try {
                const userId = updatedInterview.userId as any;
                const user = await ctx.db.get(userId);
                if (user && "longestStreak" in user) {
                    // Recalculate streak from all completed interviews
                    const { currentStreak, longestStreak } = await calculateStreakFromInterviews(ctx, userId);

                    const updateData: any = {
                        currentStreak,
                        longestStreak: Math.max((user as any).longestStreak, longestStreak),
                        lastActiveAt: Date.now(),
                    };

                    // Only increment counters if this is a new completion
                    if (!wasAlreadyCompleted && args.score !== undefined && args.earnings !== undefined) {
                        updateData.totalInterviews = (user as any).totalInterviews + 1;
                        updateData.totalEarnings = (user as any).totalEarnings + (args.earnings || 0);
                    }

                    await ctx.db.patch(userId, updateData);
                }
            } catch (error) {
                // Log error but don't fail the interview update
                console.error("Failed to update streak after interview completion:", error);
            }
        }

        return updatedInterview;
    },
});

// Mark interview as claimed after successful on-chain claim
export const markInterviewClaimed = mutation({
    args: {
        interviewId: v.id("interviews"),
        txHash: v.string(),
    },
    handler: async (ctx, args) => {
        const interview = await ctx.db.get(args.interviewId);
        if (!interview) throw new Error("Interview not found");
        await ctx.db.patch(args.interviewId, {
            claimed: true,
            claimedAt: Date.now(),
            claimTxHash: args.txHash,
        });
        // Also record a transaction record for wallet tab
        if (interview.userId && interview.earnings) {
            await ctx.db.insert("transactions", {
                userId: interview.userId,
                type: "earned",
                amount: interview.earnings,
                currency: "celo",
                description: "Interview reward claimed",
                timestamp: Date.now(),
                interviewId: args.interviewId,
            });
        }
        return await ctx.db.get(args.interviewId);
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

// Get all interviews for a user with pagination
export const getAllUserInterviews = query({
    args: {
        userId: v.id("users"),
        limit: v.optional(v.number()),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 20;
        let query = ctx.db
            .query("interviews")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc");

        // If cursor is provided, start from there
        if (args.cursor) {
            const cursorInterview = await ctx.db.get(args.cursor as any);
            if (cursorInterview && 'startedAt' in cursorInterview) {
                const startTime = (cursorInterview as any).startedAt as number;
                query = query.filter((q) => q.lt(q.field("startedAt"), startTime));
            }
        }

        const interviews = await query.take(limit);

        // Calculate if there are more results
        const hasMore = interviews.length === limit;

        return {
            interviews,
            nextCursor: hasMore && interviews.length > 0 ? interviews[interviews.length - 1]._id : null,
        };
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

        // Calculate time-based earnings breakdowns (UTC-based)
        const now = Date.now();
        const nowDate = new Date(now);

        // Get start of today (midnight UTC)
        const startOfToday = Date.UTC(
            nowDate.getUTCFullYear(),
            nowDate.getUTCMonth(),
            nowDate.getUTCDate(),
            0, 0, 0, 0
        );

        // Get start of this week (Monday UTC)
        const dayOfWeek = nowDate.getUTCDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust when day is Sunday
        // Create a new date for Monday, handling month boundaries correctly
        const mondayDate = new Date(Date.UTC(
            nowDate.getUTCFullYear(),
            nowDate.getUTCMonth(),
            nowDate.getUTCDate() + diff,
            0, 0, 0, 0
        ));
        const startOfThisWeek = mondayDate.getTime();

        // Get start of this month (UTC)
        const startOfMonth = Date.UTC(
            nowDate.getUTCFullYear(),
            nowDate.getUTCMonth(),
            1,
            0, 0, 0, 0
        );

        let todayEarnings = 0;
        let thisWeekEarnings = 0;
        let thisMonthEarnings = 0;

        for (const interview of completedInterviews) {
            if (!interview.completedAt) continue;

            const earnings = interview.earnings || 0;

            // Compare timestamps directly
            if (interview.completedAt >= startOfToday) {
                todayEarnings += earnings;
            }

            if (interview.completedAt >= startOfThisWeek) {
                thisWeekEarnings += earnings;
            }

            if (interview.completedAt >= startOfMonth) {
                thisMonthEarnings += earnings;
            }
        }

        // Calculate streak using UTC-based logic (same as in updateUserStatsAfterInterview)
        const { currentStreak, longestStreak } = await calculateStreakFromInterviews(ctx, args.userId);

        return {
            totalInterviews,
            averageScore,
            totalEarnings,
            todayEarnings,
            thisWeekEarnings,
            thisMonthEarnings,
            currentStreak,
            longestStreak,
        };
    },
});

// Helper function to calculate streak from completed interviews (UTC-based)
async function calculateStreakFromInterviews(ctx: any, userId: any) {
    // Get all completed interviews for the user
    const interviews = await ctx.db
        .query("interviews")
        .withIndex("by_user", (q: any) => q.eq("userId", userId))
        .filter((q: any) => q.eq(q.field("status"), "completed"))
        .collect();

    // Filter interviews with valid completedAt timestamps
    const completedInterviews = interviews.filter((i: any) => i.completedAt !== undefined && i.completedAt !== null);

    if (completedInterviews.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // Get unique completion dates (UTC, normalized to midnight)
    const completionDates = new Set<number>();
    for (const interview of completedInterviews) {
        const date = new Date(interview.completedAt!);
        // Normalize to UTC midnight
        const utcMidnight = Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        );
        completionDates.add(utcMidnight);
    }

    // Convert to sorted array (descending)
    const sortedDates = Array.from(completionDates).sort((a, b) => b - a);

    // Calculate current streak
    const now = Date.now();
    const today = new Date(now);
    const todayUTC = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
    );

    let currentStreak = 0;
    let expectedDate = todayUTC;
    const oneDay = 24 * 60 * 60 * 1000;

    for (const date of sortedDates) {
        if (date === expectedDate) {
            currentStreak++;
            expectedDate -= oneDay; // Move to previous day
        } else if (date < expectedDate) {
            // Gap found - streak broken
            break;
        }
        // If date > expectedDate, it's in the future (shouldn't happen, but skip it)
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < sortedDates.length - 1; i++) {
        const current = sortedDates[i];
        const next = sortedDates[i + 1];
        const daysBetween = (current - next) / oneDay;

        if (daysBetween === 1) {
            // Consecutive days
            tempStreak++;
        } else {
            // Gap found - save current streak and reset
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
}

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

        // Recalculate streak from all completed interviews (UTC-based)
        const { currentStreak, longestStreak } = await calculateStreakFromInterviews(ctx, args.userId);
        updateData.currentStreak = currentStreak;
        updateData.longestStreak = Math.max(user.longestStreak, longestStreak);

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
