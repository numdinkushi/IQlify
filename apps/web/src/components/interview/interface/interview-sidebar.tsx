'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, PhoneOff, CheckCircle } from 'lucide-react';

interface Interview {
    interviewType: string;
    skillLevel: string;
    duration: number;
    status?: string;
}

interface InterviewSidebarProps {
    interview: Interview;
    isConnected: boolean;
    onEndCall: () => void;
    onGoBack: () => void;
}

export function InterviewSidebar({ interview, isConnected, onEndCall, onGoBack }: InterviewSidebarProps) {
    return (
        <div className="space-y-4">
            <Card className="p-4 border-2 border-blue-400/30 bg-blue-400/10">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <h4 className="font-medium text-white">Interview Details</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Type:</span>
                            <span className="text-white capitalize">
                                {interview.interviewType?.replace('_', ' ') || 'General'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Level:</span>
                            <span className="text-white capitalize">{interview.skillLevel || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white">{interview.duration} min</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className="text-white capitalize">{interview.status}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Button
                onClick={onEndCall}
                disabled={!isConnected}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
            >
                <PhoneOff className="w-4 h-4 mr-2" />
                End Interview
            </Button>

            <Button
                onClick={onGoBack}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back to Interviews
            </Button>

            <Card className="p-4 border-2 border-green-400/30 bg-green-400/10">
                <div className="space-y-2">
                    <h4 className="font-medium text-white flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Tips
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Speak clearly and confidently</li>
                        <li>• Take your time to think</li>
                        <li>• Ask questions if needed</li>
                        <li>• Be honest about your experience</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}
