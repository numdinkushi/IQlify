'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';

export function LeaderboardTab() {
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
                ease: 'easeOut'
            }
        }
    };

    const mockLeaderboard = [
        { rank: 1, name: 'Alex Chen', earnings: 1250, streak: 45, skillLevel: 'Advanced' },
        { rank: 2, name: 'Sarah Kim', earnings: 1180, streak: 32, skillLevel: 'Advanced' },
        { rank: 3, name: 'Mike Johnson', earnings: 1050, streak: 28, skillLevel: 'Intermediate' },
        { rank: 4, name: 'Emma Wilson', earnings: 980, streak: 25, skillLevel: 'Intermediate' },
        { rank: 5, name: 'David Lee', earnings: 920, streak: 22, skillLevel: 'Advanced' }
    ];

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
                    <p className="text-muted-foreground">Top performers this week</p>
                </motion.div>

                {/* Your Rank */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card border-gold-400/30">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-gold-400" />
                                <CardTitle className="text-gold-400">Your Rank</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-2">
                                <p className="text-3xl font-bold text-gold-400">#127</p>
                                <p className="text-muted-foreground">0 CELO earned</p>
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
                            {mockLeaderboard.map((user, index) => (
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
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.streak} day streak •
                                                <span className={getSkillLevelColor(user.skillLevel)}> {user.skillLevel}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gold-400">{user.earnings} CELO</p>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Skill Categories */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gold-400">Skill Categories</h2>

                    <div className="grid gap-3">
                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-400 font-bold">R</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">React Leaders</h3>
                                            <p className="text-sm text-muted-foreground">Top React developers</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                                        View
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-green-400 font-bold">N</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Node.js Masters</h3>
                                            <p className="text-sm text-muted-foreground">Backend experts</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                                        View
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="iqlify-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                            <span className="text-yellow-400 font-bold">JS</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">JavaScript Gurus</h3>
                                            <p className="text-sm text-muted-foreground">JS specialists</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                                        View
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* Weekly Competition */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card border-purple-400/30">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-purple-400" />
                                <CardTitle className="text-purple-400">Weekly Competition</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-sm">
                                Compete in this week's JavaScript challenge and win big prizes!
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Prize Pool</span>
                                <span className="font-semibold text-purple-400">500 CELO</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Participants</span>
                                <span className="font-semibold">156</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Time Left</span>
                                <span className="font-semibold text-warning">4d 12h</span>
                            </div>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                Join Competition
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
