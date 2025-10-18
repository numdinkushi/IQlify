'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserBalance } from '@/components/user-balance';
import { ConnectButton } from '@/components/connect-button';
import { useAppState } from '@/hooks/use-app-state';
import { useStreak } from '@/hooks/use-streak';
import { Target, TrendingUp, Clock, Zap } from 'lucide-react';

export function HomeTab() {
    const { isConnected } = useAppState();
    const { streakData, getStreakMultiplier } = useStreak();

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

    if (!isConnected) {
        return (
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

                    {/* User Balance */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <UserBalance />
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="text-center"
                    >
                        <Button size="lg" className="iqlify-button-primary px-8 py-3 text-base font-medium rounded-xl w-full">
                            Start Learning & Earning
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

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
                            <p className="text-xl font-bold text-gold-400">0 CELO</p>
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
                        <Button className="iqlify-button-primary h-12 rounded-xl">
                            <Target className="h-5 w-5 mr-2" />
                            Start Daily Challenge
                        </Button>

                        <Button variant="outline" className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10 h-12 rounded-xl">
                            <Zap className="h-5 w-5 mr-2" />
                            Practice Interview
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
                            <div className="text-center py-8 text-muted-foreground">
                                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No recent activity</p>
                                <p className="text-sm">Start your first challenge to see activity here</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
