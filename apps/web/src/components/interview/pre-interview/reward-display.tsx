'use client';

import { Card } from '@/components/ui/card';
import { Coins } from 'lucide-react';

interface RewardDisplayProps {
    potentialReward: number;
}

export function RewardDisplay({ potentialReward }: RewardDisplayProps) {
    return (
        <Card className="p-6 border-2 border-gold-400/30 bg-gold-400/10">
            <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                    <Coins className="w-6 h-6 text-gold-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">
                        Potential Reward
                    </h3>
                </div>
                <div className="text-3xl font-bold text-gold-400 mb-2">
                    {potentialReward.toFixed(2)} CELO
                </div>
                <p className="text-sm text-gray-400">
                    Base reward (performance bonuses may apply)
                </p>
            </div>
        </Card>
    );
}
