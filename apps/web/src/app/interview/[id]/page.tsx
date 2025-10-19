'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { InterviewInterface } from '@/components/interview/interview-interface';

export default function InterviewPage() {
    const params = useParams();
    const router = useRouter();
    const interviewId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get interview data
    const interview = useQuery(api.interviews.getInterview, { interviewId });
    const updateInterview = useMutation(api.interviews.updateInterview);

    useEffect(() => {
        if (interview === undefined) {
            setIsLoading(true);
        } else if (interview === null) {
            setError('Interview not found');
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [interview]);

    const handleInterviewComplete = async (score: number, feedback: string, earnings: number) => {
        try {
            await updateInterview({
                interviewId: interviewId as any,
                status: 'completed',
                score,
                feedback,
                earnings,
                completedAt: Date.now(),
            });

            // Redirect back to interview tab with success message
            router.push('/?tab=interview&completed=true');
        } catch (error) {
            console.error('Failed to complete interview:', error);
            setError('Failed to save interview results');
        }
    };

    const handleInterviewFailed = async (reason: string) => {
        try {
            await updateInterview({
                interviewId: interviewId as any,
                status: 'failed',
                feedback: reason,
                completedAt: Date.now(),
            });

            router.push('/?tab=interview&failed=true');
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
                </div>
            </div>
        );
    }

    if (error || !interview) {
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
                    <button
                        onClick={() => router.push('/?tab=interview')}
                        className="px-4 py-2 bg-gold-400 text-black rounded-lg hover:bg-gold-500 transition-colors"
                    >
                        Back to Interviews
                    </button>
                </div>
            </div>
        );
    }

    return (
        <InterviewInterface
            interview={interview}
            onComplete={handleInterviewComplete}
            onFailed={handleInterviewFailed}
        />
    );
}
