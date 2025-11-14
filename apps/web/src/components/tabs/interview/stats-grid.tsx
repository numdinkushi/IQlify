'use client';

import { Card } from '@/components/ui/card';
import { Target, TrendingUp, Coins, Trophy } from 'lucide-react';

interface InterviewStats {
    totalInterviews: number;
    averageScore: number;
    totalEarnings: number;
    currentStreak: number;
    longestStreak: number;
}

interface StatsGridProps {
    stats: InterviewStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    if (stats.totalInterviews === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="iqlify-card border-green-400/30">
                <div className="p-4 text-center">
                    <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stats.totalInterviews}</div>
                    <div className="text-sm text-muted-foreground">Total Interviews</div>
                </div>
            </Card>

            <Card className="iqlify-card border-blue-400/30">
                <div className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stats.averageScore.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
            </Card>

            <Card className="iqlify-card border-gold-400/30">
                <div className="p-4 text-center">
                    <Coins className="h-8 w-8 text-gold-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stats.totalEarnings.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Total Earnings (CELO)</div>
                </div>
            </Card>

            <Card className="iqlify-card border-purple-400/30">
                <div className="p-4 text-center">
                    <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                </div>
            </Card>
        </div>
    );
}
