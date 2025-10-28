'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, CheckCircle, Target, Mic, Play } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

interface Interview {
    _id: string;
    interviewType?: string;
    type?: string;
    skillLevel?: string;
    duration: number;
    status: string;
    score?: number;
    earnings?: number;
}

interface InterviewHistoryProps {
    history: Interview[];
    onInterviewClick: (interview: Interview) => void;
    onStartFirstInterview: () => void;
    userHasId: boolean;
    userId?: string;
}

export function InterviewHistory({
    history,
    onInterviewClick,
    onStartFirstInterview,
    userHasId,
    userId
}: InterviewHistoryProps) {
    const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');
    const [cursor, setCursor] = useState<string | null>(null);

    // Fetch all interviews with pagination
    const allInterviewsData = useQuery(
        api.interviews.getAllUserInterviews,
        activeTab === 'all' && userId ? {
            userId: userId as any,
            limit: 20,
            cursor: cursor || undefined
        } : "skip"
    );

    if (history.length === 0) {
        return (
            <Card className="iqlify-card border-gray-600/30">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Interviews Yet</h3>
                    <p className="text-gray-400 mb-6">
                        Start your first interview to see your history here.
                    </p>
                    <Button
                        onClick={onStartFirstInterview}
                        disabled={!userHasId}
                        className="bg-gold-400 hover:bg-gold-500 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        {!userHasId ? 'Loading User...' : 'Start Your First Interview'}
                    </Button>
                </div>
            </Card>
        );
    }

    const displayedInterviews = activeTab === 'recent' ? history.slice(0, 5) : (allInterviewsData?.interviews || history || []);
    const hasMore = allInterviewsData?.nextCursor ? true : false;
    const isLoadingAll = activeTab === 'all' && userId && allInterviewsData === undefined;

    const handleLoadMore = () => {
        if (allInterviewsData?.nextCursor) {
            setCursor(allInterviewsData.nextCursor);
        }
    };

    const handleTabChange = (tab: 'recent' | 'all') => {
        setActiveTab(tab);
        setCursor(null); // Reset cursor when switching tabs
    };

    return (
        <Card className="iqlify-card">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <History className="h-5 w-5 text-gold-400" />
                    <h3 className="text-lg font-semibold text-white">Interview Records</h3>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4 border-b border-gray-700">
                    <button
                        onClick={() => handleTabChange('recent')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'recent'
                            ? 'text-gold-400 border-b-2 border-gold-400'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        Recent
                    </button>
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'all'
                            ? 'text-gold-400 border-b-2 border-gold-400'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        All
                    </button>
                </div>

                {/* Content */}
                {isLoadingAll && userId && !history.length ? (
                    <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-400">Loading interviews...</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {displayedInterviews.map((interview: Interview) => (
                                <div
                                    key={interview._id}
                                    onClick={() => onInterviewClick(interview)}
                                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${interview.status === 'completed' ? 'bg-green-400/20' :
                                            interview.status === 'grading' ? 'bg-yellow-400/20' :
                                                interview.status === 'in_progress' ? 'bg-blue-400/20' :
                                                    interview.status === 'failed' ? 'bg-red-400/20' :
                                                        interview.status === 'partial' ? 'bg-orange-400/20' :
                                                            interview.status === 'technical_issue' ? 'bg-purple-400/20' :
                                                                interview.status === 'insufficient_data' ? 'bg-gray-400/20' :
                                                                    'bg-gold-400/20'
                                            }`}>
                                            {interview.status === 'completed' ? (
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            ) : interview.status === 'grading' ? (
                                                <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                            ) : interview.status === 'in_progress' ? (
                                                <Target className="w-4 h-4 text-blue-400" />
                                            ) : interview.status === 'failed' ? (
                                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            ) : interview.status === 'partial' ? (
                                                <div className="w-4 h-4 text-orange-400">⏱</div>
                                            ) : interview.status === 'technical_issue' ? (
                                                <div className="w-4 h-4 text-purple-400">🔧</div>
                                            ) : interview.status === 'insufficient_data' ? (
                                                <div className="w-4 h-4 text-gray-400">❓</div>
                                            ) : (
                                                <Mic className="w-4 h-4 text-gold-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium capitalize">
                                                {interview.interviewType?.replace('_', ' ') || interview.type || 'Interview'}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {interview.skillLevel || 'Unknown'} • {interview.duration} min
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {interview.status === 'completed' && interview.score !== undefined ? (
                                            <div className="flex items-center gap-2">
                                                <div className={`font-medium ${interview.score === 0 ? 'text-red-400' :
                                                    interview.score < 30 ? 'text-red-400' :
                                                        interview.score < 50 ? 'text-orange-400' :
                                                            interview.score < 70 ? 'text-yellow-400' :
                                                                interview.score < 90 ? 'text-blue-400' :
                                                                    'text-green-400'
                                                    }`}>{interview.score}%</div>
                                                <div className="text-gold-400 text-sm">+{interview.earnings || 0} CELO</div>
                                            </div>
                                        ) : interview.status === 'failed' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="text-red-400 font-medium">0%</div>
                                                <div className="text-red-400 text-sm">Failed</div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 text-sm">
                                                {interview.status === 'in_progress' ? 'In Progress' :
                                                    interview.status === 'grading' ? 'Grading...' :
                                                        interview.status === 'partial' ? 'Partial' :
                                                            interview.status === 'technical_issue' ? 'Technical Issue' :
                                                                interview.status === 'insufficient_data' ? 'Insufficient Data' :
                                                                    'Not Started'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {activeTab === 'all' && hasMore && (
                            <div className="mt-4 text-center">
                                <Button
                                    onClick={handleLoadMore}
                                    className="bg-gold-400 hover:bg-gold-500 text-black font-medium"
                                >
                                    Load More
                                </Button>
                            </div>
                        )}

                        {/* Empty state for All tab */}
                        {displayedInterviews.length === 0 && (
                            <div className="text-center py-8">
                                <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-400">No interviews found</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
}
