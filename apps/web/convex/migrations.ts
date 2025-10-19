import { mutation } from "./_generated/server";

// Migration to update existing interview records with default values
export const updateExistingInterviews = mutation({
    args: {},
    handler: async (ctx) => {
        // Get all existing interviews that don't have the new fields
        const interviews = await ctx.db.query("interviews").collect();

        let updatedCount = 0;

        for (const interview of interviews) {
            const needsUpdate = !interview.skillLevel || !interview.interviewType;

            if (needsUpdate) {
                await ctx.db.patch(interview._id, {
                    skillLevel: interview.skillLevel || "beginner",
                    interviewType: interview.interviewType || "technical",
                });
                updatedCount++;
            }
        }

        return {
            message: `Updated ${updatedCount} interview records`,
            totalInterviews: interviews.length,
            updatedCount
        };
    },
});
