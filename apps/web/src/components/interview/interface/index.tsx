'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { GradingScreen } from '../grading-screen';
import { ConnectionStatus } from './connection-status';
import { AudioControls } from './audio-controls';
import { ErrorDisplay } from './error-display';
import { InterviewSidebar } from './interview-sidebar';

interface Interview {
    _id: string;
    duration: number;
    skillLevel: string;
    interviewType: string;
    status?: string;
    assistantId?: string;
}

interface InterviewInterfaceProps {
    interview: Interview;
    onComplete?: (score: number, feedback: string, earnings: number) => void;
    onFailed?: (reason: string) => void;
}

function getAssistantId(interviewType: string): string {
    const assistantMap: Record<string, string> = {
        'technical': process.env.NEXT_PUBLIC_VAPI_TECHNICAL_ASSISTANT_ID || 'default-technical',
        'soft_skills': process.env.NEXT_PUBLIC_VAPI_SOFT_SKILLS_ASSISTANT_ID || 'default-soft-skills',
        'behavioral': process.env.NEXT_PUBLIC_VAPI_BEHAVIORAL_ASSISTANT_ID || 'default-behavioral',
        'system_design': process.env.NEXT_PUBLIC_VAPI_SYSTEM_DESIGN_ASSISTANT_ID || 'default-system-design'
    };

    return assistantMap[interviewType] || 'default';
}

export const InterviewInterface = ({
    interview,
    onComplete,
    onFailed
}: InterviewInterfaceProps) => {
    const router = useRouter();

    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(interview.duration * 60);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
    const [error, setError] = useState<string | null>(null);
    const [showGrading, setShowGrading] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const updateInterview = useMutation(api.interviews.updateInterview);

    useEffect(() => {
        // Don't initialize if interview has already ended or is in a non-active state
        if (hasEnded || interview.status === 'grading' || interview.status === 'completed' || interview.status === 'failed') {
            console.log('⚠️ [INTERVIEW INTERFACE] Skipping initialization - interview already ended or in non-active state');
            return;
        }

        initializeVapiCall();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasEnded]);

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
            setError(null);

            const { VapiService } = await import('@/lib/vapi-service');
            const vapiService = VapiService.getInstance();

            const assistantId = getAssistantId(interview.interviewType);

            if (!assistantId || assistantId === 'default') {
                throw new Error(`Invalid assistant ID for ${interview.interviewType}. Assistant ID: ${assistantId}. Please check your NEXT_PUBLIC_VAPI_${interview.interviewType.toUpperCase()}_ASSISTANT_ID environment variable.`);
            }

            const connectionTimeout = setTimeout(() => {
                if (connectionStatus === 'connecting') {
                    setError('Connection timeout. The assistant may not be receiving audio. Please check your microphone permissions and ensure you granted access when prompted.');
                    setConnectionStatus('error');
                }
            }, 120000);

            const vapiCall = await vapiService.startCall({
                assistantId: assistantId,
                duration: interview.duration,
                onCallStart: () => {
                    clearTimeout(connectionTimeout);
                    setIsConnected(true);
                    setConnectionStatus('connected');
                    setIsInterviewActive(true);
                },
                onCallEnd: () => {
                    clearTimeout(connectionTimeout);
                    handleInterviewEnd();
                },
                onError: (error: any) => {
                    clearTimeout(connectionTimeout);

                    let errorMessage = 'Call failed';
                    if (error.message) {
                        errorMessage = error.message;
                    } else if (error.code) {
                        errorMessage = `Error ${error.code}: ${error.message || 'Unknown error'}`;
                    }

                    setError(`VAPI Error: ${errorMessage}`);
                    setConnectionStatus('error');
                },
                onMessage: (message: any) => {
                }
            });

            try {
                await updateInterview({
                    interviewId: interview._id as any,
                    status: 'in_progress',
                    vapiCallId: vapiCall.id || `call_${Date.now()}`
                });
            } catch (updateError) {
                // Silent fail - interview can continue
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to start interview';
            setError(`VAPI Error: ${errorMessage}`);
            setConnectionStatus('error');
        }
    };

    const handleEndCall = async () => {
        try {
            const { VapiService } = await import('@/lib/vapi-service');
            const vapiService = VapiService.getInstance();
            await vapiService.endCall();
            handleInterviewEnd();
        } catch (error) {
            handleInterviewEnd();
        }
    };

    const handleInterviewEnd = async () => {
        // Prevent multiple calls to this function
        if (hasEnded) {
            console.log('⚠️ [INTERVIEW INTERFACE] Interview already ended, skipping');
            return;
        }

        setHasEnded(true);
        setIsInterviewActive(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        try {
            await updateInterview({
                interviewId: interview._id as any,
                status: 'grading',
            });
        } catch (error) {
            // Silent fail
        }

        // Redirect to grading screen via URL parameter
        // This lets the parent page handle the routing logic
        console.log('✅ [INTERVIEW INTERFACE] Redirecting to grading screen');
        router.push(`/interview/${interview._id}?status=grading`);
    };

    if (showGrading) {
        return (
            <GradingScreen
                interviewId={interview._id}
                interview={interview}
                onComplete={onComplete || (() => { })}
                onBack={() => {
                    router.push('/?tab=interview');
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {interview.interviewType?.replace('_', ' ') || 'Interview'} Interview
                    </h1>
                    <p className="text-gray-400">
                        {interview.skillLevel} Level • {interview.duration} minutes
                    </p>
                </div>

                <ConnectionStatus status={connectionStatus} timeRemaining={timeRemaining} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <AudioControls
                            isMuted={isMuted}
                            isSpeakerOn={isSpeakerOn}
                            onToggleMute={() => setIsMuted(!isMuted)}
                            onToggleSpeaker={() => setIsSpeakerOn(!isSpeakerOn)}
                        />

                        {error && (
                            <ErrorDisplay
                                error={error}
                                onRetry={() => {
                                    setError(null);
                                    setConnectionStatus('connecting');
                                    initializeVapiCall();
                                }}
                            />
                        )}
                    </div>

                    <InterviewSidebar
                        interview={interview}
                        isConnected={isConnected}
                        onEndCall={handleEndCall}
                        onGoBack={() => router.push('/?tab=interview')}
                    />
                </div>
            </div>
        </div>
    );
};
