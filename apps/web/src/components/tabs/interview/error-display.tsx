'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
    error: string;
    onDismiss: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
    return (
        <Card className="iqlify-card border-red-400/30 bg-red-400/10">
            <div className="p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="flex-1">
                    <h4 className="font-medium text-red-400">Interview Error</h4>
                    <p className="text-sm text-red-300">{error}</p>
                </div>
                <Button
                    onClick={onDismiss}
                    variant="outline"
                    size="sm"
                    className="ml-auto border-red-400/50 text-red-400 hover:bg-red-400/20"
                >
                    Dismiss
                </Button>
            </div>
        </Card>
    );
}
