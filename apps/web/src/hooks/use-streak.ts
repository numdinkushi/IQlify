'use client';

import { useEffect } from 'react';
import { useUserByWallet, useRecalculateStreak, useUpsertUser } from './use-convex';
import { useAppState } from './use-app-state';

// This hook manages user streak data in Convex DB
// UI state like tabs should stay in context/localStorage

export function useStreak() {
    const { user, isConnected, address } = useAppState();
    const userData = useUserByWallet(address || ''); // Only query when address exists
    const recalculateStreak = useRecalculateStreak();
    const upsertUser = useUpsertUser();

    // Recalculate streak when user data changes (on app load)
    // This ensures streak is accurate even if user hasn't completed an interview recently
    useEffect(() => {
        if (userData && isConnected && userData._id) {
            // Recalculate streak from completed interviews to catch any breaks
            // This runs on app load to ensure accuracy
            recalculateStreak({ userId: userData._id }).catch((error) => {
                console.error('Failed to recalculate streak:', error);
            });
        }
    }, [userData?._id, isConnected]); // Only recalculate when user ID changes or connection status changes

    const getStreakMultiplier = () => {
        if (!userData) return 1;
        const currentStreak = userData.currentStreak;
        if (currentStreak >= 30) return 5;
        if (currentStreak >= 7) return 2;
        return 1;
    };

    const getStreakReward = (baseReward: number) => {
        return baseReward * getStreakMultiplier();
    };

    // Ensure user exists in database
    const ensureUserExists = async () => {
        if (!address || !isConnected) return;

        if (!userData) {
            await upsertUser({
                walletAddress: address,
                skillLevel: 'beginner',
            });
        }
    };

    useEffect(() => {
        ensureUserExists();
    }, [address, isConnected]);

    return {
        streakData: {
            currentStreak: userData?.currentStreak || 0,
            longestStreak: userData?.longestStreak || 0,
            lastActiveDate: userData ? new Date(userData.lastActiveAt).toDateString() : '',
            streakStartDate: userData ? new Date(userData.createdAt).toDateString() : ''
        },
        getStreakMultiplier,
        getStreakReward,
        recalculateStreak: () => userData?._id ? recalculateStreak({ userId: userData._id }) : Promise.resolve(),
        userData
    };
}
