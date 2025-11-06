'use client';

import { useUserInterviewStats, useUserByWallet } from './use-convex';
import { useAppState } from './use-app-state';

// This hook manages user earnings data from Convex DB
// Uses interviews table as the single source of truth for earnings
// Similar pattern to useStreak for consistency

export function useEarnings() {
    const { address } = useAppState();
    const userData = useUserByWallet(address || '');
    const interviewStats = useUserInterviewStats(userData?._id);

    // Use interview stats as the single source of truth for earnings
    // This ensures consistency across dashboard and interview tab
    const totalEarnings = interviewStats?.totalEarnings ?? 0;
    const todayEarnings = interviewStats?.todayEarnings ?? 0;
    const thisWeekEarnings = interviewStats?.thisWeekEarnings ?? 0;
    const thisMonthEarnings = interviewStats?.thisMonthEarnings ?? 0;

    return {
        earnings: {
            total: totalEarnings,
            today: todayEarnings,
            thisWeek: thisWeekEarnings,
            thisMonth: thisMonthEarnings,
        },
        isLoading: userData === undefined || interviewStats === undefined,
        userData,
    };
}

