'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@/components/connect-button';
import { ClientOnly } from '@/components/client-only';
import { useAppState } from '@/hooks/use-app-state';
import { useStreak } from '@/hooks/use-streak';
import { useEarnings } from '@/hooks/use-earnings';
import { useUserByWallet, useUserInterviews } from '@/hooks/use-convex';
import { TabType } from '@/lib/types';
import { formatTimeAgo } from '@/lib/app-utils';
import { Target, TrendingUp, Clock, Zap, Trophy, CheckCircle, Coins } from 'lucide-react';

export function HomeTab() {
    const { isConnected, address } = useAppState();
    const { streakData, getStreakMultiplier, userData } = useStreak();

    return (
        <ClientOnly
            fallback={
                <div className="min-h-screen p-4 iqlify-grid-bg flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading IQlify...</p>
                    </div>
                </div>
            }
        >
            {/* Show connect wallet screen when not connected */}
            {(!isConnected || !address) ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen p-4 iqlify-grid-bg"
                >
                    <div className="max-w-md mx-auto space-y-8">
                        {/* Header */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-center space-y-4"
                        >
                            <h1 className="text-4xl font-bold">
                                Welcome to <span className="iqlify-gold-text">IQlify</span>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Master interviews while earning real money
                            </p>
                        </motion.div>

                        {/* Connect Wallet Section */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="iqlify-card border-gold-400/20 p-6 text-center space-y-4"
                        >
                            <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
                            <p className="text-muted-foreground text-sm">
                                Connect your wallet to view your balance and start earning rewards!
                            </p>
                            <ConnectButton />
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <DashboardContent />
            )}
        </ClientOnly>
    );
}

function DashboardContent() {
    const { isConnected, address, setCurrentTab } = useAppState();
    const { streakData, getStreakMultiplier, userData } = useStreak();
    const { earnings } = useEarnings();
    const userDataFromWallet = useUserByWallet(address || '');
    const recentInterviews = useUserInterviews(userDataFromWallet?._id, 5);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut' as const
            }
        }
    };


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen p-4 iqlify-grid-bg"
        >
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-2">
                    <h1 className="text-2xl font-bold iqlify-gold-text">Dashboard</h1>
                    <p className="text-muted-foreground">Track your progress and earnings</p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <Card className="iqlify-card">
                        <CardContent className="p-4 text-center">
                            <TrendingUp className="h-8 w-8 text-gold-400 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Total Earnings</p>
                            <p className="text-xl font-bold text-gold-400">{earnings.total.toFixed(2)} CELO</p>
                        </CardContent>
                    </Card>

                    <Card className="iqlify-card">
                        <CardContent className="p-4 text-center">
                            <Clock className="h-8 w-8 text-success mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Current Streak</p>
                            <p className="text-xl font-bold text-success">{streakData.currentStreak} days</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Streak Multiplier */}
                {streakData.currentStreak > 0 && (
                    <motion.div variants={itemVariants}>
                        <Card className="iqlify-card border-gold-400/30">
                            <CardContent className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Zap className="h-5 w-5 text-gold-400" />
                                    <span className="font-semibold text-gold-400">Streak Bonus</span>
                                </div>
                                <p className="text-2xl font-bold text-gold-400">{getStreakMultiplier()}x Earnings</p>
                                <p className="text-sm text-muted-foreground">Keep your streak going!</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gold-400">Quick Actions</h2>

                    <div className="grid gap-3">
                        <Button
                            variant="outline"
                            className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10 h-12 rounded-xl"
                            onClick={() => setCurrentTab(TabType.INTERVIEW)}
                        >
                            <Zap className="h-5 w-5 mr-2" />
                            Take Interview
                        </Button>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card">
                        <CardHeader>
                            <CardTitle className="text-gold-400">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentInterviews && recentInterviews.length > 0 ? (
                                <div className="space-y-3">
                                    {recentInterviews.map((interview, index) => {
                                        const isCompleted = interview.status === 'completed';
                                        const isClaimed = interview.claimed === true;

                                        return (
                                            <motion.div
                                                key={interview._id}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-gold-400/10 hover:border-gold-400/20 transition-colors"
                                            >
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {isCompleted && isClaimed ? (
                                                        <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                                                            <CheckCircle className="h-5 w-5 text-green-400" />
                                                        </div>
                                                    ) : isCompleted ? (
                                                        <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center">
                                                            <Trophy className="h-5 w-5 text-gold-400" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                                                            <Target className="h-5 w-5 text-blue-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-foreground text-sm">
                                                                {isCompleted
                                                                    ? `Interview Completed${interview.score !== undefined ? ` - ${interview.score}%` : ''}`
                                                                    : interview.status === 'in_progress'
                                                                        ? 'Interview in Progress'
                                                                        : 'Interview Started'
                                                                }
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {interview.interviewType
                                                                    ? interview.interviewType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                                                                    : 'Technical Interview'
                                                                }
                                                                {interview.skillLevel && ` • ${interview.skillLevel.charAt(0).toUpperCase() + interview.skillLevel.slice(1)}`}
                                                            </p>
                                                            {interview.completedAt && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {formatTimeAgo(interview.completedAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {isCompleted && interview.earnings && interview.earnings > 0 && (
                                                            <div className="flex items-center gap-1 text-gold-400 text-sm font-semibold flex-shrink-0">
                                                                <Coins className="h-4 w-4" />
                                                                <span>{interview.earnings.toFixed(2)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isCompleted && !isClaimed && interview.earnings && interview.earnings > 0 && (
                                                        <div className="mt-2 pt-2 border-t border-gold-400/10">
                                                            <p className="text-xs text-gold-400">
                                                                💰 {interview.earnings.toFixed(2)} CELO reward available
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No recent activity</p>
                                    <p className="text-sm">Start your first interview to see activity here</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
