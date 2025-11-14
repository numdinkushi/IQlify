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
import { Target, TrendingUp, Clock, Zap, Trophy, CheckCircle, Coins, Sparkles, Brain, Wallet2, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HomeTab() {
    const { isConnected, address } = useAppState();
    const { streakData, getStreakMultiplier, userData } = useStreak();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Always show welcome screen when wallet is disconnected (fix rendering bug)
    const showWelcomeScreen = !mounted || !isConnected || !address;

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
            {showWelcomeScreen ? (
                <WelcomeScreen />
            ) : (
                <DashboardContent />
            )}
        </ClientOnly>
    );
}

function WelcomeScreen() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 iqlify-grid-bg">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background" />

                {/* Animated Gradient Orbs */}
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, -60, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                <div className="max-w-md mx-auto w-full space-y-8">
                    {/* Logo/Brain Icon with Animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                        className="flex justify-center"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <div className="w-24 h-24 border-2 border-gold-400/30 rounded-full" />
                            </motion.div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-gold-400/20 to-gold-400/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-gold-400/20">
                                <Brain className="w-12 h-12 text-gold-400" />
                            </div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-gold-400/20 rounded-full blur-xl"
                            />
                        </div>
                    </motion.div>

                    {/* Welcome Text */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-center space-y-4"
                    >
                        <motion.h1
                            className="text-5xl md:text-6xl font-bold iqlify-robotic-font"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Welcome to{' '}
                            <motion.span
                                className="iqlify-gold-text inline-block"
                                animate={{
                                    backgroundPosition: ['0%', '100%', '0%'],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{
                                    backgroundSize: '200%',
                                }}
                            >
                                IQlify
                            </motion.span>
                        </motion.h1>
                        <motion.p
                            className="text-muted-foreground text-lg md:text-xl iqlify-robotic-font-light"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            Master interviews while earning real money
                        </motion.p>
                    </motion.div>

                    {/* Feature Cards */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="grid grid-cols-3 gap-3"
                    >
                        {[
                            { icon: Brain, text: 'AI Interviews' },
                            { icon: Trophy, text: 'Earn Rewards' },
                            { icon: Zap, text: 'Get Better' },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    delay: 0.8 + index * 0.1,
                                    type: "spring",
                                    stiffness: 200
                                }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="iqlify-card border-gold-400/20 p-4 text-center space-y-2"
                            >
                                <feature.icon className="w-6 h-6 text-gold-400 mx-auto" />
                                <p className="text-xs text-muted-foreground iqlify-robotic-font-light">{feature.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Connect Wallet Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="relative"
                    >
                        {/* Glow effect */}
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-gold-400/20 rounded-2xl blur-xl"
                        />

                        <Card className="iqlify-card border-gold-400/30 relative z-10 overflow-hidden">
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <motion.div
                                    animate={{ x: [0, 100, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent w-1/2 h-full"
                                />
                            </div>

                            <CardContent className="p-8 text-center space-y-6 relative z-10">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="flex justify-center"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-gold-400/20 to-gold-400/5 rounded-full flex items-center justify-center border border-gold-400/30">
                                        <Wallet2 className="w-8 h-8 text-gold-400" />
                                    </div>
                                </motion.div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold iqlify-robotic-font">Connect Your Wallet</h2>
                                    <p className="text-muted-foreground text-sm iqlify-robotic-font-light">
                                        Connect your wallet to view your balance and start earning rewards!
                                    </p>
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ConnectButton />
                                </motion.div>

                                {/* Sparkle effects */}
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute"
                                        style={{
                                            top: `${20 + i * 30}%`,
                                            left: `${10 + i * 40}%`,
                                        }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            scale: [0, 1, 0],
                                            rotate: [0, 180, 360],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.5,
                                        }}
                                    >
                                        <Sparkles className="w-4 h-4 text-gold-400" />
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Bottom decorative elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="flex justify-center gap-2 pt-4"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-gold-400/40"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.4, 1, 0.4],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
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
