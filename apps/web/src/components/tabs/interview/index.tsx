'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';
import { PreInterviewLauncher } from '@/components/interview/pre-interview';
import { InterviewConfiguration } from '@/lib/interview-types';
import { useInterview } from '@/hooks/use-interview';
import { ErrorDisplay } from './error-display';
import { QuickStart } from './quick-start';
import { StatsGrid } from './stats-grid';
import { InterviewHistory } from './interview-history';
import { GettingStarted } from './getting-started';
import { ConnectButton } from '@/components/connect-button';

export function InterviewTab() {
    const { address, isConnected } = useAccount();
    const [isLauncherOpen, setIsLauncherOpen] = useState(false);
    const router = useRouter();

    const user = useQuery(
        api.users.getUserByWallet,
        address && isConnected ? { walletAddress: address } : "skip"
    );

    const {
        isLoading,
        error,
        userInterviews: history,
        userStats: stats,
        startInterview,
        clearError
    } = useInterview(user?._id);

    const handleStartInterview = async (config: InterviewConfiguration) => {
        if (!user?._id) {
            console.error('User ID is missing:', user);
            return;
        }

        setIsLauncherOpen(false);
        clearError();

        try {
            const session = await startInterview(config, user._id);
            if (session) {
                router.push(`/interview/${session.id}`);
            }
        } catch (error) {
            console.error('Failed to start interview:', error);
        }
    };

    const handleInterviewCardClick = (interview: any) => {
        console.log('🎯 [INTERVIEW CLICK] Clicked interview:', interview);

        if (interview.status === 'grading') {
            router.push(`/interview/${interview._id}?status=grading`);
        } else if (interview.status === 'completed' || interview.status === 'partial' ||
            interview.status === 'technical_issue' || interview.status === 'insufficient_data' ||
            interview.status === 'failed') {
            // For completed, partial, technical issues, insufficient data, or failed interviews, show results screen
            router.push(`/interview/${interview._id}?status=completed`);
        } else {
            // For in_progress, not_started, or any other status, go to interview interface
            router.push(`/interview/${interview._id}`);
        }
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
                duration: 0.5
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

    // Show connect wallet prompt if not connected
    if (!isConnected || !address) {
        return (
            <div className="min-h-screen p-4 iqlify-grid-bg flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md mx-auto text-center space-y-6"
                >
                    <div className="iqlify-card border-gold-400/20 p-6 space-y-4">
                        <h2 className="text-2xl font-semibold text-gold-400">Connect Your Wallet</h2>
                        <p className="text-muted-foreground">
                            Please connect your wallet to access interviews and start earning rewards!
                        </p>
                        <ConnectButton />
                    </div>
                </motion.div>
            </div>
        );
    }

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
                <motion.div variants={itemVariants} className="text-center space-y-2">
                    <h1 className="text-3xl font-bold iqlify-gold-text">Interview</h1>
                    <p className="text-gray-400">Take interviews with AI and earn rewards</p>
                </motion.div>

                {error && (
                    <motion.div variants={itemVariants}>
                        <ErrorDisplay error={error} onDismiss={clearError} />
                    </motion.div>
                )}

                <motion.div variants={itemVariants}>
                    <QuickStart
                        onStart={() => setIsLauncherOpen(true)}
                        isLoading={isLoading}
                        isDisabled={!user?._id}
                    />
                </motion.div>

                {stats && <motion.div variants={itemVariants}>
                    <StatsGrid stats={stats} />
                </motion.div>}

                <motion.div variants={itemVariants}>
                    <InterviewHistory
                        history={history || []}
                        onInterviewClick={handleInterviewCardClick}
                        onStartFirstInterview={() => setIsLauncherOpen(true)}
                        userHasId={!!user?._id}
                    />
                </motion.div>

                {(!stats || stats.totalInterviews === 0) && (
                    <motion.div variants={itemVariants}>
                        <GettingStarted show={true} />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
