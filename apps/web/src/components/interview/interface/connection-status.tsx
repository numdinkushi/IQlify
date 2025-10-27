'use client';

import { Card } from '@/components/ui/card';
import { Phone, Clock } from 'lucide-react';

interface ConnectionStatusProps {
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
    timeRemaining: number;
}

const statusColors = {
    connecting: 'text-yellow-400',
    connected: 'text-green-400',
    disconnected: 'text-gray-400',
    error: 'text-red-400',
};

const statusText = {
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
    error: 'Connection Error',
};

const statusDots = {
    connecting: 'bg-yellow-400',
    connected: 'bg-green-400',
    disconnected: 'bg-gray-400',
    error: 'bg-red-400',
};

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function ConnectionStatus({ status, timeRemaining }: ConnectionStatusProps) {
    return (
        <Card className="p-4 border-2 border-gray-600/30 bg-gray-800/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusDots[status]}`}></div>
                    <span className={`font-medium ${statusColors[status]}`}>
                        {statusText[status]}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-mono text-lg">
                        {formatTime(timeRemaining)}
                    </span>
                </div>
            </div>

            <div className="mt-3">
                <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">Call Type:</span>
                    <span className="text-green-400">Browser Audio Call</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    This will use your browser's microphone for the interview
                </p>

                {status === 'connecting' && (
                    <div className="mt-2 text-xs text-yellow-300 bg-yellow-500/20 p-2 rounded">
                        <strong>Please:</strong>
                        <ul className="mt-1 list-disc list-inside space-y-1">
                            <li>Allow microphone access when prompted</li>
                            <li>Speak clearly into your microphone</li>
                            <li>Wait for the assistant to respond</li>
                        </ul>
                    </div>
                )}
            </div>
        </Card>
    );
}
