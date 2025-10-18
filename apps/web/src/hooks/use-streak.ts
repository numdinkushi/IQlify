'use client';

import { useEffect } from 'react';
import { useUserByWallet, useUpdateStreak, useUpsertUser } from './use-convex';
import { useAppState } from './use-app-state';

// This hook manages user streak data in Convex DB
// UI state like tabs should stay in context/localStorage

export function useStreak() {
    const { user, isConnected } = useAppState();
    const { address } = useAppState(); // Get wallet address
    const userData = useUserByWallet(address || '');
    const updateStreak = useUpdateStreak();
    const upsertUser = useUpsertUser();

    // Update streak when user data changes
    useEffect(() => {
        if (userData && isConnected) {
            checkAndUpdateStreak();
        }
    }, [userData, isConnected]);

    const checkAndUpdateStreak = async () => {
        if (!userData || !address) return;

        const today = new Date().toDateString();
        const lastActiveDate = new Date(userData.lastActiveAt).toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

        let newStreak = userData.currentStreak;

        if (lastActiveDate === today) {
            // User was active today, streak continues
            newStreak = userData.currentStreak;
        } else if (lastActiveDate === yesterday) {
            // User was active yesterday, streak continues
            newStreak = userData.currentStreak;
        } else if (lastActiveDate !== today && lastActiveDate !== yesterday) {
            // Streak broken - reset to 0
            newStreak = 0;
        }

        // Only update if streak changed
        if (newStreak !== userData.currentStreak) {
            await updateStreak({
                userId: userData._id,
                newStreak
            });
        }
    };

    const incrementStreak = async () => {
        if (!userData || !address) return;

        const newStreak = userData.currentStreak + 1;
        await updateStreak({
            userId: userData._id,
            newStreak
        });
    };

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
        incrementStreak,
        getStreakMultiplier,
        getStreakReward,
        updateStreakStatus: checkAndUpdateStreak,
        userData
    };
}
