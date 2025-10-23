'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { PreInterviewLauncher } from '@/components/interview/pre-interview-launcher';
import { InterviewConfiguration } from '@/lib/interview-types';
import { useInterview } from '@/hooks/use-interview';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Mic,
    Play,
    Clock,
    Target,
    Award,
    TrendingUp,
    History,
    Trophy,
    Coins,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

interface InterviewStats {
    totalInterviews: number;
    averageScore: number;
    totalEarnings: number;
    currentStreak: number;
    longestStreak: number;
}

interface InterviewHistory {
    id: string;
    configuration: InterviewConfiguration;
    status: string;
    score?: number;
    earnings?: number;
    startedAt: number;
    completedAt?: number;
}

export function InterviewTabNew() {
    const { address, isConnected } = useAccount();
    const [isLauncherOpen, setIsLauncherOpen] = useState(false);

    // Get user data from Convex
    const user = useQuery(
        api.users.getUserByWallet,
        address && isConnected ? { walletAddress: address } : "skip"
    );

    // Use interview hook
    const {
        isLoading,
        error,
        userInterviews: history,
        userStats: stats,
        startInterview,
        completeInterview,
        clearError
    } = useInterview(user?._id);

    const handleStartInterview = async (config: InterviewConfiguration) => {
        if (!user) {
            console.error('User object is missing');
            return;
        }

        if (!user._id) {
            console.error('User ID is missing:', user);
            return;
        }

        console.log('Starting interview with user ID:', user._id);
        console.log('User object:', user);
        console.log('Configuration:', config);

        setIsLauncherOpen(false);
        clearError();

        try {
            console.log('🚀 [INTERVIEW TAB] Starting interview...');
            const session = await startInterview(config, user._id);
            console.log('📋 [INTERVIEW TAB] Interview session created:', session);

            if (session) {
                console.log('🔄 [INTERVIEW TAB] Redirecting to interview page:', `/interview/${session.id}`);
                // Redirect to the actual interview interface
                window.location.href = `/interview/${session.id}`;
            } else {
                console.error('❌ [INTERVIEW TAB] No session returned from startInterview');
            }
        } catch (error) {
            console.error('❌ [INTERVIEW TAB] Failed to start interview:', error);
            // Error is already handled by the useInterview hook
            // The error state will be displayed in the UI
        }
    };

    const handleInterviewCardClick = (interview: any) => {
        console.log('🖱️ [INTERVIEW TAB] Interview card clicked:', interview);

        if (interview.status === 'in_progress') {
            // Navigate back to the interview screen
            window.location.href = `/interview/${interview._id}`;
        } else if (interview.status === 'grading') {
            // Navigate to grading screen
            window.location.href = `/interview/${interview._id}?status=grading`;
        } else if (interview.status === 'completed') {
            // Navigate to results screen
            window.location.href = `/interview/${interview._id}?status=completed`;
        }
    };


    const calculateEarnings = (config: InterviewConfiguration, score: number): number => {
        // Base reward calculation based on configuration
        let baseReward = 0.2; // Default base reward

        // Adjust based on interview type and skill level
        if (config.interviewType === 'technical') baseReward = 0.2;
        else if (config.interviewType === 'soft_skills') baseReward = 0.15;
        else if (config.interviewType === 'behavioral') baseReward = 0.1;
        else if (config.interviewType === 'system_design') baseReward = 0.3;

        // Apply skill level multiplier
        if (config.skillLevel === 'intermediate') baseReward *= 1.5;
        else if (config.skillLevel === 'advanced') baseReward *= 2.0;

        // Apply performance bonus
        if (score >= 90) baseReward += 0.3;
        else if (score >= 80) baseReward += 0.2;
        else if (score >= 70) baseReward += 0.1;

        return Math.round(baseReward * 100) / 100; // Round to 2 decimal places
    };

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
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    if (isLauncherOpen) {
        return (
            <div className="min-h-screen p-4 bg-gray-900">
                <PreInterviewLauncher
                    onStartInterview={handleStartInterview}
                    onCancel={() => setIsLauncherOpen(false)}
                />
            </div>
        );
    }

    // Show loading state while data is being fetched
    if (history === undefined || stats === undefined || !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-white mb-2">Loading Interview Data</h3>
                    <p className="text-gray-400">Fetching your interview history and statistics...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen p-4 iqlify-grid-bg"
        >
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-2">
                    <h1 className="text-3xl font-bold iqlify-gold-text">Interview Practice</h1>
                    <p className="text-gray-400">Practice with AI and earn rewards</p>
                </motion.div>

                {/* Error Display */}
                {error && (
                    <motion.div variants={itemVariants}>
                        <Card className="iqlify-card border-red-400/30 bg-red-400/10">
                            <div className="p-4 flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-red-400">Interview Error</h4>
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                                <Button
                                    onClick={clearError}
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto border-red-400/50 text-red-400 hover:bg-red-400/20"
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}


                {/* Quick Start */}
                <motion.div variants={itemVariants}>
                    <Card className="iqlify-card border-gold-400/30">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Mic className="h-6 w-6 text-gold-400" />
                                <h2 className="text-xl font-semibold text-gold-400">Start New Interview</h2>
                            </div>
                            <p className="text-gray-400 mb-6">
                                Choose your skill level, interview type, and duration. Practice with AI and earn CELO rewards.
                            </p>
                            <Button
                                onClick={() => {
                                    if (!user?._id) {
                                        console.error('Cannot start interview: User ID is missing');
                                        return;
                                    }
                                    setIsLauncherOpen(true);
                                }}
                                disabled={isLoading || !user?._id}
                                className="w-full bg-gold-400 hover:bg-gold-500 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                {isLoading ? 'Starting...' : !user?._id ? 'Loading User...' : 'Launch Interview Setup'}
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats Grid */}
                {stats && stats.totalInterviews > 0 && (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="iqlify-card border-green-400/30">
                            <div className="p-4 text-center">
                                <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stats.totalInterviews}</div>
                                <div className="text-sm text-gray-400">Total Interviews</div>
                            </div>
                        </Card>

                        <Card className="iqlify-card border-blue-400/30">
                            <div className="p-4 text-center">
                                <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stats.averageScore.toFixed(1)}%</div>
                                <div className="text-sm text-gray-400">Average Score</div>
                            </div>
                        </Card>

                        <Card className="iqlify-card border-gold-400/30">
                            <div className="p-4 text-center">
                                <Coins className="h-8 w-8 text-gold-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stats.totalEarnings.toFixed(2)}</div>
                                <div className="text-sm text-gray-400">Total Earnings (CELO)</div>
                            </div>
                        </Card>

                        <Card className="iqlify-card border-purple-400/30">
                            <div className="p-4 text-center">
                                <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                                <div className="text-sm text-gray-400">Current Streak</div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Recent Interviews */}
                {history && history.length > 0 ? (
                    <motion.div variants={itemVariants}>
                        <Card className="iqlify-card">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <History className="h-5 w-5 text-gold-400" />
                                    <h3 className="text-lg font-semibold text-white">Recent Interviews</h3>
                                </div>
                                <div className="space-y-3">
                                    {history.slice(0, 5).map((interview) => (
                                        <div
                                            key={interview._id}
                                            onClick={() => handleInterviewCardClick(interview)}
                                            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${interview.status === 'completed' ? 'bg-green-400/20' :
                                                        interview.status === 'grading' ? 'bg-yellow-400/20' :
                                                            interview.status === 'in_progress' ? 'bg-blue-400/20' :
                                                                'bg-gold-400/20'
                                                    }`}>
                                                    {interview.status === 'completed' ? (
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    ) : interview.status === 'grading' ? (
                                                        <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : interview.status === 'in_progress' ? (
                                                        <Target className="w-4 h-4 text-blue-400" />
                                                    ) : (
                                                        <Mic className="w-4 h-4 text-gold-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium capitalize">
                                                        {interview.interviewType?.replace('_', ' ') || interview.type || 'Interview'}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {interview.skillLevel || 'Unknown'} • {interview.duration} min
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {interview.status === 'completed' && interview.score ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-green-400 font-medium">{interview.score}%</div>
                                                        <div className="text-gold-400 text-sm">+{interview.earnings} CELO</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400 text-sm">
                                                        {interview.status === 'in_progress' ? 'In Progress' :
                                                            interview.status === 'grading' ? 'Grading...' : 'Pending'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div variants={itemVariants}>
                        <Card className="iqlify-card border-gray-600/30">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <History className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No Interviews Yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Start your first interview to see your history here.
                                </p>
                                <Button
                                    onClick={() => {
                                        if (!user?._id) {
                                            console.error('Cannot start interview: User ID is missing');
                                            return;
                                        }
                                        setIsLauncherOpen(true);
                                    }}
                                    disabled={!user?._id}
                                    className="bg-gold-400 hover:bg-gold-500 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    {!user?._id ? 'Loading User...' : 'Start Your First Interview'}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Getting Started */}
                {(!stats || stats.totalInterviews === 0) && (
                    <motion.div variants={itemVariants}>
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
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
