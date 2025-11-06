'use client';

import { useUserEarningsSummary, useUserByWallet } from './use-convex';
import { useAppState } from './use-app-state';

// This hook manages user earnings data from Convex DB
// Similar pattern to useStreak for consistency

export function useEarnings() {
    const { address } = useAppState();
    const userData = useUserByWallet(address || '');
    const earningsSummary = useUserEarningsSummary(userData?._id);

    // Calculate earnings from summary or fallback to user's totalEarnings
    const totalEarnings = earningsSummary?.total ?? userData?.totalEarnings ?? 0;
    const todayEarnings = earningsSummary?.today ?? 0;
    const thisWeekEarnings = earningsSummary?.thisWeek ?? 0;
    const thisMonthEarnings = earningsSummary?.thisMonth ?? 0;

    return {
        earnings: {
            total: totalEarnings,
            today: todayEarnings,
            thisWeek: thisWeekEarnings,
            thisMonth: thisMonthEarnings,
        },
        isLoading: userData === undefined || earningsSummary === undefined,
        userData,
    };
}

