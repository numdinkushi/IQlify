'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VapiService } from '@/lib/vapi-service';
import { InterviewConfiguration } from '@/lib/interview-types';
import {
    Phone,
    PhoneOff,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Clock,
    User,
    Target,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface InterviewInterfaceProps {
    interview: any;
    onComplete: (score: number, feedback: string, earnings: number) => void;
    onFailed: (reason: string) => void;
}

export const InterviewInterface = ({
    interview,
    onComplete,
    onFailed
}: InterviewInterfaceProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(interview.duration * 60); // Convert to seconds
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
    const [error, setError] = useState<string | null>(null);

    const vapiService = VapiService.getInstance();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize VAPI call
    useEffect(() => {
        initializeVapiCall();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (vapiService.isCallActive()) {
                vapiService.endCall();
            }
        };
    }, []);

    // Timer countdown
    useEffect(() => {
        if (isInterviewActive && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleInterviewEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isInterviewActive, timeRemaining]);

    const initializeVapiCall = async () => {
        try {
            setConnectionStatus('connecting');

            // Initialize VAPI SDK
            await vapiService.initializeVapi();

            // Build interview configuration
            const config: InterviewConfiguration = {
                skillLevel: interview.skillLevel,
                interviewType: interview.interviewType,
                duration: interview.duration,
                preparationTime: 2 // 2 minutes preparation time
            };

            // Get assistant ID based on interview type
            const assistantId = vapiService.getAssistantId(config);

            // Start VAPI call
            await vapiService.startCall({
                assistantId,
                onCallStart: () => {
                    console.log('VAPI call started');
                    setIsConnected(true);
                    setConnectionStatus('connected');
                    setIsInterviewActive(true);
                },
                onCallEnd: () => {
                    console.log('VAPI call ended');
                    setIsConnected(false);
                    setConnectionStatus('disconnected');
                    setIsInterviewActive(false);
                },
                onError: (error: any) => {
                    console.error('VAPI call error:', error);
                    setError(error.message || 'Call failed');
                    setConnectionStatus('error');
                    onFailed(error.message || 'Call failed');
                },
                onMessage: (message: any) => {
                    console.log('VAPI message:', message);
                }
            });

        } catch (error) {
            console.error('Failed to initialize VAPI call:', error);
            setError(error instanceof Error ? error.message : 'Failed to start interview');
            setConnectionStatus('error');
        }
    };


    const handleEndCall = async () => {
        try {
            if (vapiService.isCallActive()) {
                await vapiService.endCall();
            }
            handleInterviewEnd();
        } catch (error) {
            console.error('Failed to end call:', error);
            onFailed('Failed to end call properly');
        }
    };

    const handleInterviewEnd = async () => {
        setIsInterviewActive(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Simulate interview completion with real scoring
        // In a real implementation, this would come from VAPI webhooks
        const score = Math.floor(Math.random() * 40) + 60; // 60-100
        const earnings = calculateEarnings(interview, score);
        const feedback = generateFeedback(score, interview.interviewType);

        onComplete(score, feedback, earnings);
    };

    const calculateEarnings = (interview: any, score: number): number => {
        let baseReward = 0.2;

        if (interview.interviewType === 'technical') baseReward = 0.2;
        else if (interview.interviewType === 'soft_skills') baseReward = 0.15;
        else if (interview.interviewType === 'behavioral') baseReward = 0.1;
        else if (interview.interviewType === 'system_design') baseReward = 0.3;

        if (interview.skillLevel === 'intermediate') baseReward *= 1.5;
        else if (interview.skillLevel === 'advanced') baseReward *= 2.0;

        if (score >= 90) baseReward += 0.3;
        else if (score >= 80) baseReward += 0.2;
        else if (score >= 70) baseReward += 0.1;

        return Math.round(baseReward * 100) / 100;
    };

    const generateFeedback = (score: number, interviewType: string): string => {
        const typeName = interviewType.replace('_', ' ');
        if (score >= 90) {
            return `Excellent performance in your ${typeName} interview! You demonstrated strong skills and clear communication.`;
        } else if (score >= 80) {
            return `Good job on your ${typeName} interview! You showed solid understanding with room for improvement.`;
        } else if (score >= 70) {
            return `Decent performance in your ${typeName} interview. Consider practicing more to improve your skills.`;
        } else {
            return `Your ${typeName} interview shows areas for improvement. Keep practicing to enhance your skills.`;
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connecting': return 'text-yellow-400';
            case 'connected': return 'text-green-400';
            case 'disconnected': return 'text-gray-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connecting': return 'Connecting...';
            case 'connected': return 'Connected';
            case 'disconnected': return 'Disconnected';
            case 'error': return 'Connection Error';
            default: return 'Unknown';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {interview.interviewType?.replace('_', ' ') || 'Interview'} Interview
                    </h1>
                    <p className="text-gray-400">
                        {interview.skillLevel} Level • {interview.duration} minutes
                    </p>
                </div>

                {/* Connection Status */}
                <Card className="p-4 border-2 border-gray-600/30 bg-gray-800/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : connectionStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                            <span className={`font-medium ${getConnectionStatusColor()}`}>
                                {getConnectionStatusText()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-mono text-lg">
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Main Interview Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Interview Controls */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="p-6 border-2 border-gold-400/30 bg-gold-400/10">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto">
                                    <User className="w-10 h-10 text-gold-400" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        AI Interviewer
                                    </h3>
                                    <p className="text-gray-400">
                                        Your AI interviewer is ready to assess your skills
                                    </p>
                                </div>

                                {/* Audio Controls */}
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        onClick={() => setIsMuted(!isMuted)}
                                        variant="outline"
                                        className={`w-12 h-12 rounded-full ${isMuted
                                            ? 'bg-red-400/20 border-red-400/50 text-red-400'
                                            : 'bg-green-400/20 border-green-400/50 text-green-400'
                                            }`}
                                    >
                                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </Button>

                                    <Button
                                        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                                        variant="outline"
                                        className={`w-12 h-12 rounded-full ${isSpeakerOn
                                            ? 'bg-blue-400/20 border-blue-400/50 text-blue-400'
                                            : 'bg-gray-400/20 border-gray-400/50 text-gray-400'
                                            }`}
                                    >
                                        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Error Display */}
                        {error && (
                            <Card className="p-4 border-2 border-red-400/30 bg-red-400/10">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <div>
                                        <h4 className="font-medium text-red-400">Connection Error</h4>
                                        <p className="text-sm text-red-300">{error}</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Interview Info */}
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

                        {/* End Call Button */}
                        <Button
                            onClick={handleEndCall}
                            disabled={!isConnected}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                        >
                            <PhoneOff className="w-4 h-4 mr-2" />
                            End Interview
                        </Button>

                        {/* Tips */}
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
                </div>
            </div>
        </div>
    );
};
