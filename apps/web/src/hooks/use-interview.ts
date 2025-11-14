import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { InterviewConfiguration } from '@/lib/interview-types';

export const useInterview = (userId?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createInterview = useMutation(api.interviews.createInterview);
    const updateInterview = useMutation(api.interviews.updateInterview);

    // Get user interviews
    const userInterviews = useQuery(
        api.interviews.getUserInterviews,
        userId ? { userId: userId as any, limit: 10 } : "skip"
    );

    // Get user stats
    const userStats = useQuery(
        api.interviews.getUserInterviewStats,
        userId ? { userId: userId as any } : "skip"
    );

    // Get active interview
    const activeInterview = useQuery(
        api.interviews.getActiveInterview,
        userId ? { userId: userId as any } : "skip"
    );

    const startInterview = useCallback(async (configuration: InterviewConfiguration, userId: string) => {
        if (!userId) {
            throw new Error('User ID is required to start interview');
        }

        if (typeof userId !== 'string' || userId.trim() === '') {
            throw new Error('User ID must be a non-empty string');
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('Starting interview with configuration:', configuration);
            console.log('User ID:', userId);
            console.log('User ID type:', typeof userId);
            console.log('User ID length:', userId.length);

            // Validate configuration
            if (!configuration.skillLevel || !configuration.interviewType || !configuration.duration) {
                throw new Error('Invalid interview configuration');
            }

            // Create interview record
            console.log('📝 [INTERVIEW HOOK] Creating interview record...');
            const interviewId = await createInterview({
                userId: userId as any,
                type: 'live',
                skillLevel: configuration.skillLevel,
                interviewType: configuration.interviewType,
                duration: configuration.duration,
                vapiCallId: undefined,
            });

            console.log('✅ [INTERVIEW HOOK] Interview created with ID:', interviewId);
            console.log('📊 [INTERVIEW HOOK] Interview data:', {
                userId,
                skillLevel: configuration.skillLevel,
                interviewType: configuration.interviewType,
                duration: configuration.duration
            });

            // For web calls, we don't need server-side call creation
            // The VAPI Web SDK handles everything client-side
            console.log('Interview created - VAPI web call will be handled client-side');

            console.log('Interview ready for VAPI web call');

            return {
                id: interviewId,
                configuration: configuration
            };
        } catch (error) {
            console.error('Failed to start interview:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to start interview';
            setError(`Interview Error: ${errorMessage}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [createInterview, updateInterview]);

    const completeInterview = useCallback(async (
        interviewId: string,
        score: number,
        feedback: string,
        earnings: number
    ) => {
        try {
            await updateInterview({
                interviewId: interviewId as any,
                status: 'completed',
                score,
                feedback,
                earnings,
                completedAt: Date.now(),
            });
        } catch (error) {
            console.error('Failed to complete interview:', error);
            throw error;
        }
    }, [updateInterview]);

    const failInterview = useCallback(async (interviewId: string, reason: string) => {
        try {
            await updateInterview({
                interviewId: interviewId as any,
                status: 'failed',
                feedback: reason,
                completedAt: Date.now(),
            });
        } catch (error) {
            console.error('Failed to mark interview as failed:', error);
            throw error;
        }
    }, [updateInterview]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        startInterview,
        completeInterview,
        failInterview,
        userInterviews: userInterviews || [],
        userStats: userStats || {
            totalInterviews: 0,
            averageScore: 0,
            totalEarnings: 0,
            currentStreak: 0,
            longestStreak: 0,
        },
        activeInterview: activeInterview || null,
        isLoading,
        error,
        clearError,
    };
};

// Note: VAPI calls are now handled client-side in the interview interface
// No server-side VAPI API calls needed anymore