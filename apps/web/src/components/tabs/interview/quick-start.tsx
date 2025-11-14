'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Play } from 'lucide-react';

interface QuickStartProps {
    onStart: () => void;
    isLoading: boolean;
    isDisabled: boolean;
}

export function QuickStart({ onStart, isLoading, isDisabled }: QuickStartProps) {
    return (
        <Card className="iqlify-card border-gold-400/30">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Mic className="h-6 w-6 text-gold-400" />
                    <h2 className="text-xl font-semibold text-foreground">Start New Interview</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                    Choose your skill level, interview type, and duration. Take interviews with AI and earn CELO rewards.
                </p>
                <Button
                    onClick={onStart}
                    disabled={isLoading || isDisabled}
                    className="w-full bg-gold-400 hover:bg-gold-500 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Play className="w-4 h-4 mr-2" />
                    {isLoading ? 'Starting...' : isDisabled ? 'Loading User...' : 'Launch Interview Setup'}
                </Button>
            </div>
        </Card>
    );
}
