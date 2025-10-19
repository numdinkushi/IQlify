import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { InterviewConfiguration } from '@/lib/interview-types';

export const useInterview = (userId?: Id<"users">) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Convex mutations
    const createInterview = useMutation(api.interviews.createInterview);
    const updateInterview = useMutation(api.interviews.updateInterview);
    const updateUserStats = useMutation(api.interviews.updateUserStatsAfterInterview);

    // Convex queries
    const userInterviews = useQuery(
        api.interviews.getUserInterviews,
        userId ? { userId, limit: 10 } : "skip"
    );

    const userStats = useQuery(
        api.interviews.getUserInterviewStats,
        userId ? { userId } : "skip"
    );

    const activeInterview = useQuery(
        api.interviews.getActiveInterview,
        userId ? { userId } : "skip"
    );

    // Start a new interview
    const startInterview = useCallback(async (configuration: InterviewConfiguration) => {
        if (!userId) {
            setError('User ID is required');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Create interview record in Convex
            const interviewId = await createInterview({
                userId,
                type: "mock",
                skillLevel: configuration.skillLevel,
                interviewType: configuration.interviewType,
                duration: configuration.duration,
            });

            // Trigger VAPI workflow
            const vapiResponse = await fetch('/api/vapi/workflow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assistantId: getAssistantId(configuration),
                    workflowType: 'interview',
                    parameters: buildVapiParameters(configuration)
                })
            });

            if (!vapiResponse.ok) {
                throw new Error('Failed to start VAPI call');
            }

            const vapiResult = await vapiResponse.json();

            if (vapiResult.success && vapiResult.data) {
                // Update interview with VAPI call ID
                await updateInterview({
                    interviewId,
                    status: "in_progress",
                    vapiCallId: vapiResult.data.callId,
                });

                return {
                    id: interviewId,
                    userId,
                    configuration,
                    status: 'active',
                    vapiCallId: vapiResult.data.callId,
                    startedAt: Date.now()
                };
            } else {
                throw new Error(vapiResult.error || 'Failed to start VAPI call');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Failed to start interview:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [userId, createInterview, updateInterview]);

    // Complete an interview
    const completeInterview = useCallback(async (
        interviewId: Id<"interviews">,
        score: number,
        feedback: string,
        earnings: number
    ) => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            // Update interview record
            await updateInterview({
                interviewId,
                status: "completed",
                score,
                feedback,
                earnings,
                completedAt: Date.now(),
            });

            // Update user statistics
            await updateUserStats({
                userId,
                score,
                earnings,
            });

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Failed to complete interview:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userId, updateInterview, updateUserStats]);

    // Get assistant ID based on interview type
    const getAssistantId = (configuration: InterviewConfiguration): string => {
        const assistantMap: Record<string, string> = {
            'technical': process.env.NEXT_PUBLIC_VAPI_TECHNICAL_ASSISTANT_ID || 'default-technical',
            'soft_skills': process.env.NEXT_PUBLIC_VAPI_SOFT_SKILLS_ASSISTANT_ID || 'default-soft-skills',
            'behavioral': process.env.NEXT_PUBLIC_VAPI_BEHAVIORAL_ASSISTANT_ID || 'default-behavioral',
            'system_design': process.env.NEXT_PUBLIC_VAPI_SYSTEM_DESIGN_ASSISTANT_ID || 'default-system-design'
        };

        return assistantMap[configuration.interviewType] || 'default';
    };

    // Build VAPI parameters
    const buildVapiParameters = (configuration: InterviewConfiguration): Record<string, any> => {
        return {
            skillLevel: configuration.skillLevel,
            interviewType: configuration.interviewType,
            duration: configuration.duration,
            preparationTime: configuration.preparationTime,
            timestamp: Date.now()
        };
    };

    return {
        // State
        isLoading,
        error,

        // Data
        userInterviews: userInterviews || [],
        userStats: userStats || {
            totalInterviews: 0,
            averageScore: 0,
            totalEarnings: 0,
            currentStreak: 0,
            longestStreak: 0
        },
        activeInterview,

        // Actions
        startInterview,
        completeInterview,

        // Utilities
        clearError: () => setError(null)
    };
};
