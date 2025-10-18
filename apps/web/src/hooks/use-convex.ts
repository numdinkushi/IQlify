'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

// User hooks
export function useUserByWallet(walletAddress: string) {
    return useQuery(
        api.users.getUserByWallet,
        walletAddress ? { walletAddress } : "skip"
    );
}

export function useUpsertUser() {
    return useMutation(api.users.upsertUser);
}

export function useUpdateStreak() {
    return useMutation(api.users.updateStreak);
}

export function useUpdateEarnings() {
    return useMutation(api.users.updateEarnings);
}

// Challenge hooks
export function useChallenges() {
    return useQuery(api.challenges.getChallenges);
}

export function useChallengesByType(type: 'daily' | 'weekly' | 'monthly' | 'custom') {
    return useQuery(api.challenges.getChallengesByType, { type });
}

export function useActiveChallenges() {
    return useQuery(api.challenges.getActiveChallenges);
}

export function useCreateChallenge() {
    return useMutation(api.challenges.createChallenge);
}

export function useJoinChallenge() {
    return useMutation(api.challenges.joinChallenge);
}

// Combined hooks for common operations
export function useUserOperations() {
    const upsertUser = useUpsertUser();
    const updateStreak = useUpdateStreak();
    const updateEarnings = useUpdateEarnings();

    return {
        upsertUser,
        updateStreak,
        updateEarnings,
    };
}

export function useChallengeOperations() {
    const createChallenge = useCreateChallenge();
    const joinChallenge = useJoinChallenge();

    return {
        createChallenge,
        joinChallenge,
    };
}
