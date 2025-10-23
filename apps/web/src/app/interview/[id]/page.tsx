'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { InterviewInterface } from '@/components/interview/interview-interface';
import { GradingScreen } from '@/components/interview/grading-screen';
import { ResultsScreen } from '@/components/interview/results-screen';
import { Id } from '../../../../convex/_generated/dataModel';

export default function InterviewPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const interviewId = params.id as string;
    const status = searchParams.get('status');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fallbackInterview, setFallbackInterview] = useState<any>(null);

    // Get interview data
    const interview = useQuery(api.interviews.getInterview, { interviewId: interviewId as any }) as any;
    const updateInterview = useMutation(api.interviews.updateInterview);

    useEffect(() => {
        console.log('🔍 [INTERVIEW PAGE] Interview data:', interview);
        console.log('🔍 [INTERVIEW PAGE] Interview ID:', interviewId);

        if (interview === undefined) {
            console.log('⏳ [INTERVIEW PAGE] Interview loading...');
            setIsLoading(true);
        } else if (interview === null) {
            console.log('❌ [INTERVIEW PAGE] Interview not found');
            setError('Interview not found');
            setIsLoading(false);
        } else {
            console.log('✅ [INTERVIEW PAGE] Interview found:', interview);
            setIsLoading(false);
        }
    }, [interview, interviewId]);

    // Fallback: Create temporary interview object if loading takes too long
    useEffect(() => {
        const fallbackTimeout = setTimeout(() => {
            if (isLoading && interview === undefined && !fallbackInterview) {
                console.log('🚀 [INTERVIEW PAGE] Creating fallback interview object');
                // Create a temporary interview object to allow the interview to proceed
                const fallback = {
                    _id: interviewId,
                    duration: 10, // Default duration
                    skillLevel: 'intermediate' as const,
                    interviewType: 'technical' as const,
                    status: 'in_progress' as const
                };
                console.log('📋 [INTERVIEW PAGE] Fallback interview created:', fallback);
                setFallbackInterview(fallback);
                setIsLoading(false);
            }
        }, 3000); // 3 second fallback timeout

        return () => clearTimeout(fallbackTimeout);
    }, [isLoading, interview, interviewId, fallbackInterview]);

    // Add timeout to prevent infinite loading
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading && interview === undefined) {
                console.log('⏰ [INTERVIEW PAGE] Loading timeout - interview not found after 5 seconds');
                setError('Interview loading timeout - please try again');
                setIsLoading(false);
            }
        }, 5000); // 5 second timeout

        return () => clearTimeout(timeout);
    }, [isLoading, interview]);

    const handleInterviewComplete = async (score: number, feedback: string, earnings: number) => {
        try {
            console.log('📝 [INTERVIEW PAGE] Interview completed, updating status:', { score, feedback, earnings });
            await updateInterview({
                interviewId: interviewId as any,
                status: 'completed',
                score,
                feedback,
                earnings,
                completedAt: Date.now(),
            });

            // Don't redirect automatically - let user stay on the interview screen
            // They can manually navigate back when they want to
            console.log('✅ [INTERVIEW PAGE] Interview completed successfully - staying on interview screen');
        } catch (error) {
            console.error('Failed to complete interview:', error);
            setError('Failed to save interview results');
        }
    };

    const handleInterviewFailed = async (reason: string) => {
        try {
            console.log('📝 [INTERVIEW PAGE] Interview failed, updating status:', reason);
            await updateInterview({
                interviewId: interviewId as any,
                status: 'failed',
                feedback: reason,
                completedAt: Date.now(),
            });

            // Don't redirect - just show error in the interface
            setError(`Interview failed: ${reason}`);
            console.log('✅ [INTERVIEW PAGE] Interview status updated to failed');
        } catch (error) {
            console.error('Failed to mark interview as failed:', error);
            setError('Failed to update interview status');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-white mb-2">Loading Interview</h2>
                    <p className="text-gray-400">Preparing your interview session...</p>
                    <p className="text-xs text-gray-500 mt-2">Interview ID: {interviewId}</p>
                    <p className="text-xs text-gray-500">Status: {interview === undefined ? 'Loading...' : interview === null ? 'Not found' : 'Found'}</p>
                </div>
            </div>
        );
    }

    if (error || (!interview && !fallbackInterview)) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Interview Error</h2>
                    <p className="text-gray-400 mb-4">{error || 'Interview not found'}</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                // Retry by refreshing the page
                                window.location.reload();
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => router.push('/?tab=interview')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Back to Interviews
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Use fallback interview if database interview is not available
    const currentInterview = interview || fallbackInterview as any;

    // Handle different status views
    if (status === 'grading' || currentInterview?.status === 'grading') {
        return (
            <GradingScreen
                interviewId={interviewId}
                onComplete={handleInterviewComplete}
                onBack={() => router.push('/?tab=interview')}
            />
        );
    }

    if (status === 'completed' || currentInterview?.status === 'completed') {
        return (
            <ResultsScreen
                interview={currentInterview}
                onBack={() => router.push('/?tab=interview')}
                onClaim={() => {
                    console.log('Claiming rewards for interview:', currentInterview._id);
                    // TODO: Implement actual claim logic
                }}
            />
        );
    }

    return (
        <InterviewInterface
            interview={currentInterview}
            onComplete={handleInterviewComplete}
            onFailed={handleInterviewFailed}
        />
    );
}
