'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    const [isClaimed, setIsClaimed] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const handleClaim = async () => {
        try {
            setIsClaimed(true);
            // TODO: Implement actual claim logic
            console.log('Claiming rewards for interview:', interview._id);
            onClaim?.();
        } catch (error) {
            console.error('Failed to claim rewards:', error);
            setIsClaimed(false);
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

    const getRecommendationColor = (recommendation: string) => {
        switch (recommendation) {
            case 'strong-hire': return 'text-green-400 bg-green-400/20';
            case 'hire': return 'text-blue-400 bg-blue-400/20';
            case 'maybe': return 'text-yellow-400 bg-yellow-400/20';
            case 'no-hire': return 'text-red-400 bg-red-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

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
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor('hire')}`}>
                                {interview.recommendation || 'hire'}
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
                        disabled={isClaimed}
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
                                <Coins className="w-4 h-4 mr-2" />
                                Claim Rewards
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
