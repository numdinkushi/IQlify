'use client';

import { useState, useEffect } from 'react';
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
    Sparkles,
    AlertCircle
} from 'lucide-react';

interface GradingScreenProps {
    interviewId: string;
    interview?: any; // Add interview object to props
    onComplete: (score: number, feedback: string, earnings: number) => void;
    onBack: () => void;
}

interface GradingResult {
    score: number;
    feedback: string;
    earnings: number;
    strengths: string[];
    areasForImprovement: string[];
    recommendation: string;
}

export const GradingScreen = ({ interviewId, interview, onComplete, onBack }: GradingScreenProps) => {
    const [isGrading, setIsGrading] = useState(true);
    const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Start grading process
        startGrading();
    }, [interviewId]);

    const startGrading = async () => {
        try {
            console.log('🎯 [GRADING] Starting grading process for interview:', interviewId);

            // Simulate grading process with realistic timing
            await new Promise(resolve => setTimeout(resolve, 3000));

            // First try to get stored grading results
            let gradingData = null;
            try {
                const storedResponse = await fetch(`/api/vapi/grading?callId=${interviewId}`);
                if (storedResponse.ok) {
                    const storedData = await storedResponse.json();
                    if (storedData.success && storedData.gradingResults) {
                        gradingData = storedData.gradingResults;
                        console.log('✅ [GRADING] Found stored grading results:', gradingData);
                    }
                }
            } catch (error) {
                console.log('⚠️ [GRADING] No stored results found, generating new ones...');
            }

            // If no stored results, generate new ones
            if (!gradingData) {
                console.log('🔄 [GRADING] Generating new grading results...');
                const response = await fetch('/api/vapi/evaluate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        interviewId,
                        // Add any additional data needed for grading
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to grade interview');
                }

                gradingData = await response.json();
                console.log('✅ [GRADING] New grading completed:', gradingData);
            }

            // Process the grading result
            // Convert AI score (0-10) to percentage (0-100)
            let finalScore = 0;

            console.log('🔍 [GRADING] Processing grading data:', {
                overallScore: gradingData.overallScore,
                isFailedInterview: gradingData.isFailedInterview,
                transcriptLength: gradingData.transcriptLength,
                transcriptWordCount: gradingData.transcriptWordCount,
                candidateMessageCount: gradingData.candidateMessageCount
            });

            if (gradingData.isFailedInterview) {
                // CRITICAL: If interview was marked as failed, force score to 0
                console.warn('⚠️ [GRADING] Interview marked as failed, setting score to 0');
                finalScore = 0;
            } else if (gradingData.overallScore !== undefined && gradingData.overallScore !== null) {
                // Validate score is within expected range (0-10)
                const rawScore = gradingData.overallScore;

                if (typeof rawScore !== 'number' || isNaN(rawScore)) {
                    console.error('⚠️ [GRADING] Invalid score type:', rawScore);
                    finalScore = 0;
                } else if (rawScore < 0 || rawScore > 10) {
                    console.error('⚠️ [GRADING] Score out of range (0-10):', rawScore);
                    finalScore = 0;
                } else {
                    // AI returns score in 0-10 range, convert to 0-100
                    // Cap at 100 to prevent scores over 100%
                    finalScore = Math.min(Math.round(rawScore * 10), 100);
                    console.log('✅ [GRADING] Valid score converted:', rawScore, '→', finalScore);
                }
            } else {
                // No score provided - fail safely
                console.warn('⚠️ [GRADING] No score provided, setting to 0');
                finalScore = 0;
            }

            // Determine appropriate feedback based on score and interview status
            let feedback = 'Interview evaluation completed';

            if (finalScore === 0) {
                // Failed interview - use specific feedback
                feedback = gradingData.summary ||
                    gradingData.overallAssessment ||
                    'Interview could not be completed. Please try again and ensure you have a stable connection.';
            } else {
                // Successful interview - use positive feedback
                feedback = gradingData.summary ||
                    gradingData.detailedFeedback ||
                    gradingData.overallAssessment ||
                    'Interview evaluation completed successfully.';
            }

            const result: GradingResult = {
                score: finalScore,
                feedback: feedback,
                earnings: calculateEarnings(finalScore, interview),
                strengths: gradingData.keyHighlights || gradingData.strengths || [],
                areasForImprovement: gradingData.areasForImprovement || [],
                recommendation: getRecommendation(finalScore)
            };

            setGradingResult(result);
            setIsGrading(false);

            // Call onComplete with the results - this will update the interview status to completed
            onComplete(result.score, result.feedback, result.earnings);

        } catch (error) {
            console.error('❌ [GRADING] Grading failed:', error);
            setError('Failed to grade interview. Please try again.');
            setIsGrading(false);
        }
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

    const calculateEarnings = (score: number, interviewData?: any): number => {
        // Get base reward from interview type
        let baseReward = 0.2; // Default

        if (interviewData) {
            // Set base reward based on interview type
            if (interviewData.interviewType === 'technical') baseReward = 0.2;
            else if (interviewData.interviewType === 'soft_skills') baseReward = 0.15;
            else if (interviewData.interviewType === 'behavioral') baseReward = 0.1;
            else if (interviewData.interviewType === 'system_design') baseReward = 0.3;

            // Apply skill level multiplier
            if (interviewData.skillLevel === 'intermediate') baseReward *= 1.5;
            else if (interviewData.skillLevel === 'advanced') baseReward *= 2.0;
        }

        // Apply performance bonus
        if (score >= 90) baseReward += 0.3;
        else if (score >= 80) baseReward += 0.2;
        else if (score >= 70) baseReward += 0.1;

        return Math.round(baseReward * 100) / 100;
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

    if (isGrading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto"
                >
                    <Card className="iqlify-card border-gold-400/30 bg-gold-400/10 p-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 mx-auto mb-6"
                        >
                            <Sparkles className="w-16 h-16 text-gold-400" />
                        </motion.div>

                        <h2 className="text-2xl font-bold text-white mb-4">
                            Grading Your Interview
                        </h2>

                        <p className="text-gray-400 mb-6">
                            Please wait while we analyze your performance...
                        </p>

                        <div className="flex justify-center space-x-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-gold-400 rounded-full"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <Card className="iqlify-card border-red-400/30 bg-red-400/10 p-8 max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Grading Error</h2>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <Button
                        onClick={() => {
                            setError(null);
                            setIsGrading(true);
                            startGrading();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Retry Grading
                    </Button>
                </Card>
            </div>
        );
    }

    if (!gradingResult) return null;

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    {gradingResult.score === 0 ? (
                        <>
                            <div className="w-20 h-20 bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Interview Failed
                            </h1>
                            <p className="text-gray-400">
                                The interview could not be completed
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-10 h-10 text-gold-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Interview Complete!
                            </h1>
                            <p className="text-gray-400">
                                Here's how you performed
                            </p>
                        </>
                    )}
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
                                {gradingResult.score}
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-gold-400">/100</div>
                                <div className={`text-lg font-medium ${getScoreColor(gradingResult.score)}`}>
                                    {getScoreMessage(gradingResult.score)}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-gray-300">+{gradingResult.earnings} CELO</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Award className="w-5 h-5 text-blue-400" />
                                <span className="text-sm text-gray-300 capitalize">
                                    {formatRecommendation(gradingResult.recommendation)}
                                </span>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Feedback */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="iqlify-card p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <Star className="w-5 h-5 text-gold-400 mr-2" />
                            Feedback
                        </h3>
                        <p className="text-gray-300 mb-6">{gradingResult.feedback}</p>

                        {gradingResult.strengths.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-lg font-medium text-green-400 mb-2 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Strengths
                                </h4>
                                <ul className="space-y-1">
                                    {gradingResult.strengths.map((strength, index) => (
                                        <li key={index} className="text-gray-300 text-sm flex items-center">
                                            <div className="w-1 h-1 bg-green-400 rounded-full mr-2" />
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {gradingResult.areasForImprovement.length > 0 && (
                            <div>
                                <h4 className="text-lg font-medium text-yellow-400 mb-2 flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Areas for Improvement
                                </h4>
                                <ul className="space-y-1">
                                    {gradingResult.areasForImprovement.map((area, index) => (
                                        <li key={index} className="text-gray-300 text-sm flex items-center">
                                            <div className="w-1 h-1 bg-yellow-400 rounded-full mr-2" />
                                            {area}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <Button
                        onClick={onBack}
                        className="bg-gold-400 hover:bg-gold-500 text-black font-semibold px-8 py-3"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Interviews
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};
