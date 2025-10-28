'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, User } from 'lucide-react';

interface AudioControlsProps {
    isMuted: boolean;
    isSpeakerOn: boolean;
    onToggleMute: () => void;
    onToggleSpeaker: () => void;
}

export function AudioControls({ isMuted, isSpeakerOn, onToggleMute, onToggleSpeaker }: AudioControlsProps) {
    return (
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

                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={onToggleMute}
                        variant="outline"
                        className={`w-12 h-12 rounded-full ${isMuted
                                ? 'bg-red-400/20 border-red-400/50 text-red-400'
                                : 'bg-green-400/20 border-green-400/50 text-green-400'
                            }`}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>

                    <Button
                        onClick={onToggleSpeaker}
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
    );
}
