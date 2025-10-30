'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClaimReward } from '@/hooks/use-claim-reward';
import { useToast } from '@/providers/toast-provider';
import { useChainId, useSwitchChain } from 'wagmi';
import { celo } from 'wagmi/chains';

// Extend window type for MiniPay compatibility
declare global {
    interface Window {
        ethereum?: any;
    }
}
import {
    Trophy,
    Star,
    CheckCircle,
    TrendingUp,
    Award,
    ArrowLeft,
    Share2,
    Download,
    Coins,
    Target,
    Clock,
    Calendar
} from 'lucide-react';

interface ResultsScreenProps {
    interview: any;
    onBack: () => void;
    onClaim?: () => void;
}

export const ResultsScreen = ({ interview, onBack, onClaim }: ResultsScreenProps) => {
    const { claim, loading } = useClaimReward();
    const { success, error: showError, info, warning } = useToast();
    const chainId = useChainId();
    const { switchChain, isPending: isSwitchPending } = useSwitchChain();
    const [isClaimed, setIsClaimed] = useState<boolean>(!!interview?.claimed);
    const [isSharing, setIsSharing] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    // Celo Mainnet
    const TARGET_CHAIN_ID = celo.id;

    // Log current chain on mount to help debug
    console.log('[ResultsScreen] Current chain ID:', chainId, 'Expected:', TARGET_CHAIN_ID, 'MiniPay:', typeof window !== 'undefined' && window.ethereum?.isMiniPay);

    const handleSwitchToMainnet = async () => {
        try {
            setIsSwitching(true);
            console.log('[ui] Switching to Celo Mainnet...');

            info('Switching network...', 'Please approve the network switch in your wallet');

            // Try wagmi's switchChain first
            try {
                await switchChain({ chainId: celo.id });
            } catch (wagmiError) {
                console.log('[ui] Wagmi switchChain failed, trying direct window.ethereum...', wagmiError);
                // Fallback to direct ethereum request for MiniPay test mode compatibility
                if (typeof window !== 'undefined' && window.ethereum) {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xa4ec' }], // 42220 in hex
                    });
                }
            }

            console.log('[ui] ✅ Switched to Celo Mainnet');
            success('Network switched!', 'Now connected to Celo Mainnet');
        } catch (error: any) {
            console.error('[ui] ❌ Failed to switch network:', error);
            const errorMessage = error?.shortMessage || error?.message || 'Failed to switch network';
            showError('Switch Network Failed', errorMessage);
        } finally {
            setIsSwitching(false);
        }
    };

    const handleClaim = async () => {
        try {
            console.log('[ui] claim clicked');

            // Check if we're on the correct chain
            console.log('[ui] Current chain ID:', chainId, 'Expected:', TARGET_CHAIN_ID);

            if (chainId !== TARGET_CHAIN_ID) {
                console.log('[ui] ⚠️ Wrong network. Current:', chainId, 'Expected:', TARGET_CHAIN_ID);
                warning(
                    'Wrong Network',
                    `Please switch to Celo Mainnet to claim rewards`,
                    {
                        duration: 8000,
                        action: {
                            label: 'Switch Network',
                            onClick: handleSwitchToMainnet
                        }
                    }
                );
                return;
            }

            // Show info toast
            info('Claiming rewards...', 'Please approve the transaction in your wallet');

            const amountCelo = String(interview.earnings || 0);
            const nonce = Math.floor(Date.now() / 1000); // simple per-attempt nonce; could be stored per user
            const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes
            const referralTag = '0x0000000000000000000000000000000000000000000000000000000000000000' as const;

            console.log('[ui] calling claim with args:', { amountCelo, nonce, deadline, chainId: TARGET_CHAIN_ID });
            const txHash = await claim({
                interviewId: interview._id,
                amountCelo,
                nonce,
                deadline,
                referralTag,
                chainId: TARGET_CHAIN_ID,
            });

            console.log('✅ Claimed tx:', txHash);
            setIsClaimed(true);

            // Show success toast
            success(
                'Rewards claimed!',
                `Transaction: ${txHash}`,
                { duration: 10000 }
            );

            onClaim?.();
        } catch (error) {
            console.error('❌ Failed to claim rewards:', error);

            // Show error toast with detailed message
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            showError(
                'Failed to claim rewards',
                errorMessage,
                { duration: 10000 }
            );
        }
    };

    const handleShare = async () => {
        try {
            setIsSharing(true);
            // TODO: Implement actual share logic
            console.log('Sharing interview results:', interview._id);

            // Simulate sharing delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsSharing(false);
        } catch (error) {
            console.error('Failed to share results:', error);
            setIsSharing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 80) return 'text-blue-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreMessage = (score: number) => {
        if (score >= 90) return 'Outstanding Performance!';
        if (score >= 80) return 'Great Job!';
        if (score >= 70) return 'Good Performance!';
        return 'Keep Practicing!';
    };

    const getRecommendation = (score: number): string => {
        if (score >= 90) return 'strong-hire';
        if (score >= 80) return 'hire';
        if (score >= 70) return 'maybe';
        return 'no-hire';
    };

    const formatRecommendation = (recommendation: string): string => {
        const formatted = recommendation.replace('-', ' ');
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

    const getRecommendationColor = (recommendation: string) => {
        switch (recommendation) {
            case 'strong-hire': return 'text-green-400 bg-green-400/20';
            case 'hire': return 'text-blue-400 bg-blue-400/20';
            case 'maybe': return 'text-yellow-400 bg-yellow-400/20';
            case 'no-hire': return 'text-red-400 bg-red-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    const recommendation = interview.recommendation || getRecommendation(interview.score || 0);

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-gold-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Interview Results
                    </h1>
                    <p className="text-gray-400">
                        Congratulations on completing your interview!
                    </p>
                </motion.div>

                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="iqlify-card border-gold-400/30 bg-gold-400/10 p-6 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-6xl font-bold text-white mr-4">
                                {interview.score || 0}
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-gold-400">/100</div>
                                <div className={`text-lg font-medium ${getScoreColor(interview.score || 0)}`}>
                                    {getScoreMessage(interview.score || 0)}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <Coins className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-gray-300">+{interview.earnings || 0} CELO</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(recommendation)}`}>
                                {formatRecommendation(recommendation)}
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Interview Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="iqlify-card p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <Target className="w-5 h-5 text-gold-400 mr-2" />
                            Interview Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <div>
                                    <div className="text-sm text-gray-400">Duration</div>
                                    <div className="text-white font-medium">{interview.duration || 10} minutes</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-green-400" />
                                <div>
                                    <div className="text-sm text-gray-400">Completed</div>
                                    <div className="text-white font-medium">
                                        {interview.completedAt ? new Date(interview.completedAt).toLocaleDateString() : 'Today'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Award className="w-5 h-5 text-purple-400" />
                                <div>
                                    <div className="text-sm text-gray-400">Type</div>
                                    <div className="text-white font-medium capitalize">
                                        {interview.interviewType?.replace('_', ' ') || 'Technical'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <div className="text-sm text-gray-400">Skill Level</div>
                                    <div className="text-white font-medium capitalize">
                                        {interview.skillLevel || 'Intermediate'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Feedback */}
                {interview.feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="iqlify-card p-6">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <CheckCircle className="w-5 h-5 text-gold-400 mr-2" />
                                Feedback
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{interview.feedback}</p>
                        </Card>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button
                        onClick={handleClaim}
                        disabled={isClaimed || loading || isSwitching || isSwitchPending}
                        className={`px-8 py-3 font-semibold ${isClaimed
                            ? 'bg-green-600 text-white'
                            : 'bg-gold-400 hover:bg-gold-500 text-black'
                            }`}
                    >
                        {isClaimed ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Claimed!
                            </>
                        ) : (
                            <>
                                {(loading || isSwitchPending) ? (
                                    <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Coins className="w-4 h-4 mr-2" />
                                )}
                                {(loading || isSwitchPending) ? 'Processing...' : 'Claim Rewards'}
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                        {isSharing ? (
                            <>
                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sharing...
                            </>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Results
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={onBack}
                        className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Interviews
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};
