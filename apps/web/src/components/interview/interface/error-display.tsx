'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
    error: string;
    onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
    const isMicrophoneError = error.includes('microphone') || error.includes('permission');

    return (
        <Card className="p-4 border-2 border-red-400/30 bg-red-400/10">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                    <h4 className="font-medium text-red-400">Connection Error</h4>
                    <p className="text-sm text-red-300 mb-2">{error}</p>

                    {isMicrophoneError && (
                        <div className="text-xs text-red-200 bg-red-500/20 p-2 rounded">
                            <strong>Troubleshooting:</strong>
                            <ul className="mt-1 list-disc list-inside space-y-1">
                                <li>Check your browser's microphone permissions for this site</li>
                                <li>Look for a microphone icon in your browser's address bar</li>
                                <li>Click "Allow" when prompted for microphone access</li>
                                <li>Refresh the page and try again</li>
                            </ul>
                        </div>
                    )}

                    <Button
                        onClick={onRetry}
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs"
                        size="sm"
                    >
                        Retry Connection
                    </Button>
                </div>
            </div>
        </Card>
    );
}
