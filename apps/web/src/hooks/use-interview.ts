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
            const interviewId = await createInterview({
                userId: userId as any,
                type: 'live',
                skillLevel: configuration.skillLevel,
                interviewType: configuration.interviewType,
                duration: configuration.duration,
                vapiCallId: undefined,
            });

            console.log('Interview created with ID:', interviewId);

            // Start VAPI call
            const vapiCallId = await startVapiCall(configuration, interviewId);

            console.log('VAPI call started with ID:', vapiCallId);

            // Update interview with VAPI call ID
            await updateInterview({
                interviewId,
                vapiCallId,
            });

            return { id: interviewId, vapiCallId };
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to start VAPI workflow');
        }

        const data = await response.json();
        return data.callId || data.workflowId || `workflow_${interviewId}`;
    } catch (error) {
        console.error('VAPI call failed:', error);
        throw error;
    }
}