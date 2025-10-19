import { InterviewConfiguration, SkillLevel, InterviewType } from './interview-types';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export interface InterviewSession {
    id: string;
    userId: string;
    configuration: InterviewConfiguration;
    status: 'preparing' | 'active' | 'completed' | 'failed';
    vapiCallId?: string;
    score?: number;
    feedback?: string;
    earnings?: number;
    startedAt: number;
    completedAt?: number;
}

export interface InterviewResult {
    sessionId: string;
    score: number;
    feedback: string;
    earnings: number;
    completedAt: number;
}

export class InterviewService {
    private static instance: InterviewService;

    private constructor() { }

    public static getInstance(): InterviewService {
        if (!InterviewService.instance) {
            InterviewService.instance = new InterviewService();
        }
        return InterviewService.instance;
    }

    /**
     * Start a new interview session
     */
    async startInterview(
        userId: string,
        configuration: InterviewConfiguration
    ): Promise<InterviewSession> {
        const sessionId = this.generateSessionId();

        const session: InterviewSession = {
            id: sessionId,
            userId,
            configuration,
            status: 'preparing',
            startedAt: Date.now()
        };

        try {
            // Call VAPI workflow endpoint
            const vapiResponse = await this.triggerVapiWorkflow(configuration);

            if (vapiResponse.success && vapiResponse.data) {
                session.vapiCallId = vapiResponse.data.callId;
                session.status = 'active';
            } else {
                throw new Error(vapiResponse.error || 'Failed to start VAPI call');
            }

            return session;
        } catch (error) {
            console.error('Failed to start interview:', error);
            session.status = 'failed';
            throw error;
        }
    }

    /**
     * Complete an interview session
     */
    async completeInterview(
        sessionId: string,
        result: InterviewResult
    ): Promise<void> {
        try {
            // Update session in database
            await this.updateInterviewSession(sessionId, {
                status: 'completed',
                score: result.score,
                feedback: result.feedback,
                earnings: result.earnings,
                completedAt: result.completedAt
            });

            // Update user statistics
            await this.updateUserStats(result.sessionId, result.score, result.earnings);

            // Create transaction record
            await this.createTransactionRecord(result);

        } catch (error) {
            console.error('Failed to complete interview:', error);
            throw error;
        }
    }

    /**
     * Get interview history for a user
     */
    async getInterviewHistory(userId: string): Promise<InterviewSession[]> {
        try {
            const response = await fetch(`/api/interviews/history?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch interview history');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to get interview history:', error);
            return [];
        }
    }

    /**
     * Get user interview statistics
     */
    async getUserInterviewStats(userId: string): Promise<{
        totalInterviews: number;
        averageScore: number;
        totalEarnings: number;
        currentStreak: number;
        longestStreak: number;
    }> {
        try {
            const response = await fetch(`/api/interviews/stats?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch interview stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to get interview stats:', error);
            return {
                totalInterviews: 0,
                averageScore: 0,
                totalEarnings: 0,
                currentStreak: 0,
                longestStreak: 0
            };
        }
    }

    /**
     * Trigger VAPI workflow for interview
     */
    private async triggerVapiWorkflow(configuration: InterviewConfiguration): Promise<{
        success: boolean;
        data?: { callId: string; };
        error?: string;
    }> {
        try {
            const response = await fetch('/api/vapi/workflow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assistantId: this.getAssistantId(configuration),
                    workflowType: 'interview',
                    parameters: this.buildVapiParameters(configuration)
                })
            });

            if (!response.ok) {
                throw new Error(`VAPI workflow failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('VAPI workflow error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Get appropriate assistant ID based on configuration
     */
    private getAssistantId(configuration: InterviewConfiguration): string {
        // Map interview types to VAPI assistant IDs
        const assistantMap: Record<InterviewType, string> = {
            [InterviewType.TECHNICAL]: process.env.VAPI_TECHNICAL_ASSISTANT_ID || 'default-technical',
            [InterviewType.SOFT_SKILLS]: process.env.VAPI_SOFT_SKILLS_ASSISTANT_ID || 'default-soft-skills',
            [InterviewType.BEHAVIORAL]: process.env.VAPI_BEHAVIORAL_ASSISTANT_ID || 'default-behavioral',
            [InterviewType.SYSTEM_DESIGN]: process.env.VAPI_SYSTEM_DESIGN_ASSISTANT_ID || 'default-system-design'
        };

        return assistantMap[configuration.interviewType];
    }

    /**
     * Build VAPI parameters from interview configuration
     */
    private buildVapiParameters(configuration: InterviewConfiguration): Record<string, any> {
        return {
            skillLevel: configuration.skillLevel,
            interviewType: configuration.interviewType,
            duration: configuration.duration,
            preparationTime: configuration.preparationTime,
            // Add any additional parameters needed by VAPI
            timestamp: Date.now()
        };
    }

    /**
     * Update interview session in database
     */
    private async updateInterviewSession(
        sessionId: string,
        updates: Partial<InterviewSession>
    ): Promise<void> {
        try {
            const response = await fetch('/api/interviews/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    updates
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update interview session');
            }
        } catch (error) {
            console.error('Failed to update interview session:', error);
            throw error;
        }
    }

    /**
     * Update user statistics after interview completion
     */
    private async updateUserStats(
        sessionId: string,
        score: number,
        earnings: number
    ): Promise<void> {
        try {
            const response = await fetch('/api/interviews/update-stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    score,
                    earnings
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update user stats');
            }
        } catch (error) {
            console.error('Failed to update user stats:', error);
            throw error;
        }
    }

    /**
     * Create transaction record for earnings
     */
    private async createTransactionRecord(result: InterviewResult): Promise<void> {
        try {
            const response = await fetch('/api/transactions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'earned',
                    amount: result.earnings,
                    currency: 'celo',
                    description: `Interview completion reward - Score: ${result.score}%`,
                    interviewId: result.sessionId,
                    timestamp: result.completedAt
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create transaction record');
            }
        } catch (error) {
            console.error('Failed to create transaction record:', error);
            throw error;
        }
    }

    /**
     * Generate unique session ID
     */
    private generateSessionId(): string {
        return `interview_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}
