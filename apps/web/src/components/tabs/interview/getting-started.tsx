'use client';

import { Card } from '@/components/ui/card';
import { Award, CheckCircle } from 'lucide-react';

interface GettingStartedProps {
    show: boolean;
}

export function GettingStarted({ show }: GettingStartedProps) {
    if (!show) return null;

    return (
        <Card className="iqlify-card border-gray-600/30">
            <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Start?</h3>
                <p className="text-gray-400 mb-6">
                    Complete your first interview to start earning rewards and improving your skills.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>AI-powered interviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Instant feedback</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Earn CELO rewards</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
