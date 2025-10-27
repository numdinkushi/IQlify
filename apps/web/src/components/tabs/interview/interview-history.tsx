'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, CheckCircle, Target, Mic, Play } from 'lucide-react';

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
}

export function InterviewHistory({
    history,
    onInterviewClick,
    onStartFirstInterview,
    userHasId
}: InterviewHistoryProps) {
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

    return (
        <Card className="iqlify-card">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <History className="h-5 w-5 text-gold-400" />
                    <h3 className="text-lg font-semibold text-white">Recent Interviews</h3>
                </div>
                <div className="space-y-3">
                    {history.slice(0, 5).map((interview) => (
                        <div
                            key={interview._id}
                            onClick={() => onInterviewClick(interview)}
                            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${interview.status === 'completed' ? 'bg-green-400/20' :
                                        interview.status === 'grading' ? 'bg-yellow-400/20' :
                                            interview.status === 'in_progress' ? 'bg-blue-400/20' :
                                                'bg-gold-400/20'
                                    }`}>
                                    {interview.status === 'completed' ? (
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                    ) : interview.status === 'grading' ? (
                                        <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                    ) : interview.status === 'in_progress' ? (
                                        <Target className="w-4 h-4 text-blue-400" />
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
                                {interview.status === 'completed' && interview.score ? (
                                    <div className="flex items-center gap-2">
                                        <div className="text-green-400 font-medium">{interview.score}%</div>
                                        <div className="text-gold-400 text-sm">+{interview.earnings} CELO</div>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-sm">
                                        {interview.status === 'in_progress' ? 'In Progress' :
                                            interview.status === 'grading' ? 'Grading...' : 'Pending'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
