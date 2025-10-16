'use client';

import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
    streakStartDate: string;
}

export function useStreak() {
    const [streakData, setStreakData] = useState<StreakData>({
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        streakStartDate: ''
    });

    // Load streak data from localStorage
    useEffect(() => {
        const savedStreakData = localStorage.getItem(STORAGE_KEYS.streakData);
        const savedLastActiveDate = localStorage.getItem(STORAGE_KEYS.lastActiveDate);

        if (savedStreakData) {
            setStreakData(JSON.parse(savedStreakData));
        }

        if (savedLastActiveDate) {
            // Check if streak should continue or break
            updateStreakStatus(savedLastActiveDate);
        }
    }, []);

    const updateStreakStatus = (lastActiveDate: string) => {
        const today = new Date().toDateString();
        const lastActive = new Date(lastActiveDate).toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

        setStreakData(prev => {
            let newStreak = prev.currentStreak;

            if (lastActive === today) {
                // User was active today, streak continues
                newStreak = prev.currentStreak;
            } else if (lastActive === yesterday) {
                // User was active yesterday, streak continues
                newStreak = prev.currentStreak;
            } else {
                // Streak broken
                newStreak = 0;
            }

            const updatedStreak = {
                ...prev,
                currentStreak: newStreak,
                longestStreak: Math.max(prev.longestStreak, newStreak),
                lastActiveDate: today,
                streakStartDate: newStreak === 1 ? today : prev.streakStartDate
            };

            // Save to localStorage
            localStorage.setItem(STORAGE_KEYS.streakData, JSON.stringify(updatedStreak));
            localStorage.setItem(STORAGE_KEYS.lastActiveDate, today);

            return updatedStreak;
        });
    };

    const incrementStreak = () => {
        setStreakData(prev => {
            const today = new Date().toDateString();
            const newStreak = prev.currentStreak + 1;

            const updatedStreak = {
                ...prev,
                currentStreak: newStreak,
                longestStreak: Math.max(prev.longestStreak, newStreak),
                lastActiveDate: today,
                streakStartDate: newStreak === 1 ? today : prev.streakStartDate
            };

            // Save to localStorage
            localStorage.setItem(STORAGE_KEYS.streakData, JSON.stringify(updatedStreak));
            localStorage.setItem(STORAGE_KEYS.lastActiveDate, today);

            return updatedStreak;
        });
    };

    const getStreakMultiplier = () => {
        const { currentStreak } = streakData;
        if (currentStreak >= 30) return 5;
        if (currentStreak >= 7) return 2;
        return 1;
    };

    const getStreakReward = (baseReward: number) => {
        return baseReward * getStreakMultiplier();
    };

    return {
        streakData,
        incrementStreak,
        getStreakMultiplier,
        getStreakReward,
        updateStreakStatus
    };
}
