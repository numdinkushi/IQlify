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
        setIsLoading(true);
        setError(null);

        try {
            // Create interview record
            const interviewId = await createInterview({
                userId: userId as any,
                type: 'live',
                skillLevel: configuration.skillLevel,
                interviewType: configuration.interviewType,
                duration: configuration.duration,
                vapiCallId: undefined,
            });

            // Start VAPI call
            const vapiCallId = await startVapiCall(configuration, interviewId);

            // Update interview with VAPI call ID
            await updateInterview({
                interviewId,
                vapiCallId,
            });

            return { id: interviewId, vapiCallId };
        } catch (error) {
            console.error('Failed to start interview:', error);
            setError(error instanceof Error ? error.message : 'Failed to start interview');
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

// Helper function to start VAPI call
async function startVapiCall(configuration: InterviewConfiguration, interviewId: string): Promise<string> {
    try {
        const response = await fetch('/api/vapi/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                interviewId,
                configuration,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to start VAPI call');
        }

        const data = await response.json();
        return data.callId;
    } catch (error) {
        console.error('VAPI call failed:', error);
        throw error;
    }
}