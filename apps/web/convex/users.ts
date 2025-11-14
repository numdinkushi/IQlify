import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

// Recalculate and update user streak from completed interviews
export const recalculateStreak = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        const { currentStreak, longestStreak } = await calculateStreakFromInterviews(ctx, args.userId);

        await ctx.db.patch(args.userId, {
            currentStreak,
            longestStreak: Math.max(user.longestStreak, longestStreak),
            lastActiveAt: Date.now(),
        });

        return { currentStreak, longestStreak };
    },
});

// Update user streak (legacy - kept for backward compatibility)
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

// Get user's total interview points
export const getUserInterviewPoints = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const interviews = await ctx.db
            .query("interviews")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("status"), "completed"))
            .collect();

        const interviewPoints = interviews.reduce((sum, interview) => {
            return sum + (interview.score || 0);
        }, 0);

        return interviewPoints;
    },
});

// Get user's rank by calculating position in sorted leaderboard
export const getUserRank = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Get all users
        const allUsers = await ctx.db
            .query("users")
            .collect();

        // Calculate interview points and streak for each user
        const usersWithPoints = await Promise.all(
            allUsers.map(async (user) => {
                const interviews = await ctx.db
                    .query("interviews")
                    .withIndex("by_user", (q: any) => q.eq("userId", user._id))
                    .filter((q: any) => q.eq(q.field("status"), "completed"))
                    .collect();

                const interviewPoints = interviews.reduce((sum: number, interview: any) => {
                    return sum + (interview.score || 0);
                }, 0);

                // Recalculate streak from completed interviews for accuracy
                const { currentStreak } = await calculateStreakFromInterviews(ctx, user._id);

                return {
                    ...user,
                    interviewPoints,
                    currentStreak, // Use recalculated streak
                };
            })
        );

        // Sort by interview points descending, then by currentStreak descending as tiebreaker
        const sortedUsers = usersWithPoints.sort((a, b) => {
            if (b.interviewPoints !== a.interviewPoints) {
                return b.interviewPoints - a.interviewPoints;
            }
            return b.currentStreak - a.currentStreak;
        });

        // Find the user's position in the sorted list
        const userIndex = sortedUsers.findIndex(user => user._id === args.userId);

        // Return rank (1-based index, or null if user not found)
        return userIndex >= 0 ? userIndex + 1 : null;
    },
});

// Get leaderboard (top users by interview points)
export const getLeaderboard = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;

        // Get all users
        const allUsers = await ctx.db
            .query("users")
            .collect();

        // Calculate interview points and streak for each user
        const usersWithPoints = await Promise.all(
            allUsers.map(async (user) => {
                const interviews = await ctx.db
                    .query("interviews")
                    .withIndex("by_user", (q: any) => q.eq("userId", user._id))
                    .filter((q: any) => q.eq(q.field("status"), "completed"))
                    .collect();

                const interviewPoints = interviews.reduce((sum: number, interview: any) => {
                    return sum + (interview.score || 0);
                }, 0);

                // Recalculate streak from completed interviews for accuracy
                const { currentStreak } = await calculateStreakFromInterviews(ctx, user._id);

                return {
                    ...user,
                    interviewPoints,
                    currentStreak, // Use recalculated streak
                };
            })
        );

        // Sort by interview points descending, then by currentStreak descending as tiebreaker
        const sortedUsers = usersWithPoints.sort((a, b) => {
            if (b.interviewPoints !== a.interviewPoints) {
                return b.interviewPoints - a.interviewPoints;
            }
            return b.currentStreak - a.currentStreak;
        });

        // Take top N users and add rank
        const leaderboard = sortedUsers.slice(0, limit).map((user, index) => {
            // Format user name
            const name = user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.firstName || user.lastName
                    ? user.firstName || user.lastName
                    : user.walletAddress
                        ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
                        : 'Anonymous';

            // Format skill level (capitalize first letter)
            const skillLevel = user.skillLevel
                ? user.skillLevel.charAt(0).toUpperCase() + user.skillLevel.slice(1)
                : 'Beginner';

            return {
                _id: user._id,
                rank: index + 1,
                name,
                interviewPoints: user.interviewPoints,
                earnings: user.totalEarnings, // Keep for reference but not used for ranking
                streak: user.currentStreak,
                skillLevel,
                walletAddress: user.walletAddress,
            };
        });

        return leaderboard;
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
