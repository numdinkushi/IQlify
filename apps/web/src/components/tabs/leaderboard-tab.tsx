'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShareModal } from '@/components/share-modal';
import { useAppState } from '@/hooks/use-app-state';
import { useStreak } from '@/hooks/use-streak';
import { useEarnings } from '@/hooks/use-earnings';
import { useLeaderboard, useUserRank, useUserInterviewPoints, useUserInterviewStats } from '@/hooks/use-convex';
import { Trophy, Medal, Award, TrendingUp, Users, Share2 } from 'lucide-react';
import { useState } from 'react';

export function LeaderboardTab() {
    const { address, isConnected } = useAppState();
    const { streakData, userData } = useStreak();
    const { earnings } = useEarnings();
    const leaderboardData = useLeaderboard(10);
    const userRank = useUserRank(userData?._id);
    const userInterviewPoints = useUserInterviewPoints(userData?._id);
    const interviewStats = useUserInterviewStats(userData?._id);
    const [showShareModal, setShowShareModal] = useState(false);

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

    // Map leaderboard data from Convex to component format
    const leaderboard = (leaderboardData || []).map((user) => ({
        rank: user.rank,
        name: user.name,
        interviewPoints: user.interviewPoints,
        earnings: user.earnings, // Keep for reference
        streak: user.streak,
        skillLevel: user.skillLevel,
    }));

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-6 w-6 text-gold-400" />;
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />;
            case 3:
                return <Award className="h-6 w-6 text-amber-600" />;
            default:
                return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
        }
    };

    const getSkillLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner':
                return 'text-green-400';
            case 'Intermediate':
                return 'text-gold-400';
            case 'Advanced':
                return 'text-red-400';
            default:
                return 'text-muted-foreground';
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
                    <h1 className="text-2xl font-bold iqlify-gold-text">Leaderboard</h1>
                    <p className="text-muted-foreground">Ranked by interview points</p>
                </motion.div>

                {/* Your Rank */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card border-gold-400/30">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-gold-400" />
                                    <CardTitle className="text-gold-400">Your Rank</CardTitle>
                                </div>
                                <Button
                                    onClick={() => setShowShareModal(true)}
                                    variant="outline"
                                    size="sm"
                                    className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10 flex items-center gap-2"
                                >
                                    <Share2 className="h-4 w-4" />
                                    <span className="text-sm">Share</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-2">
                                <p className="text-3xl font-bold text-gold-400">#{userRank ?? '—'}</p>
                                <p className="text-muted-foreground">{(userInterviewPoints ?? 0).toLocaleString()} interview points</p>
                                <p className="text-sm text-muted-foreground">Keep practicing to climb the ranks!</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Top Performers */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-gold-400" />
                                    <CardTitle className="text-gold-400">Top Performers</CardTitle>
                                </div>
                                <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                                    <Users className="h-4 w-4 mr-1" />
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {leaderboard.length > 0 ? (
                                leaderboard.map((user, index) => (
                                    <motion.div
                                        key={user.rank}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8">
                                                {getRankIcon(user.rank)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.streak} day streak •
                                                    <span className={getSkillLevelColor(user.skillLevel)}> {user.skillLevel}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gold-400">{user.interviewPoints.toLocaleString()} pts</p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No leaderboard data yet</p>
                                    <p className="text-sm">Start earning to see top performers!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Share Modal */}
                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                    userRank={userRank ?? 0}
                    totalEarnings={earnings.total}
                    streak={streakData.currentStreak}
                    userName={userData?.firstName && userData?.lastName
                        ? `${userData.firstName} ${userData.lastName}`
                        : userData?.firstName || userData?.lastName || undefined}
                    walletAddress={address || ''}
                    totalInterviews={interviewStats?.totalInterviews || 0}
                    averageScore={interviewStats?.averageScore || 0}
                />
            </div>
        </motion.div>
    );
}
