import { v } from "convex/values";
import { query } from "./_generated/server";

// Get user transactions
export const getUserTransactions = query({
    args: {
        userId: v.id("users"),
        type: v.optional(v.union(
            v.literal("earned"),
            v.literal("spent"),
            v.literal("withdrawn")
        )),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db
            .query("transactions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId));

        if (args.type) {
            query = query.filter((q) => q.eq(q.field("type"), args.type));
        }

        const transactions = await query
            .order("desc")
            .take(args.limit || 100);

        return transactions;
    },
});

// Get user earnings summary by time period
export const getUserEarningsSummary = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        const oneMonth = 30 * oneDay;

        // Get start of today (midnight UTC)
        const now = Date.now();
        const today = new Date(now);
        today.setUTCHours(0, 0, 0, 0);
        const startOfToday = today.getTime();

        // Get start of this week (Monday UTC)
        const dayOfWeek = today.getUTCDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust when day is Sunday
        const startOfWeek = new Date(today);
        startOfWeek.setUTCDate(today.getUTCDate() + diff);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const startOfThisWeek = startOfWeek.getTime();

        // Get start of this month (UTC)
        const startOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)).getTime();

        // Get all earned transactions for the user
        const allTransactions = await ctx.db
            .query("transactions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("type"), "earned"))
            .collect();

        // Calculate earnings for each period
        let todayEarnings = 0;
        let thisWeekEarnings = 0;
        let thisMonthEarnings = 0;
        let totalEarnings = 0;

        for (const transaction of allTransactions) {
            // Only count CELO earnings (or convert other currencies)
            const amount = transaction.currency === "celo"
                ? transaction.amount
                : transaction.currency === "cUSD"
                    ? transaction.amount * 0.1 // Simple conversion rate
                    : 0;

            totalEarnings += amount;

            if (transaction.timestamp >= startOfToday) {
                todayEarnings += amount;
            }

            if (transaction.timestamp >= startOfThisWeek) {
                thisWeekEarnings += amount;
            }

            if (transaction.timestamp >= startOfMonth) {
                thisMonthEarnings += amount;
            }
        }

        return {
            today: todayEarnings,
            thisWeek: thisWeekEarnings,
            thisMonth: thisMonthEarnings,
            total: totalEarnings,
        };
    },
});

