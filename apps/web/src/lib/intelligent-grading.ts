/**
 * Intelligent Grading System
 * 
 * A human-centered approach to interview grading that:
 * 1. Provides partial credit for incomplete interviews
 * 2. Distinguishes between technical issues and poor performance
 * 3. Uses mathematical formulas for fair scoring
 * 4. Provides encouraging, constructive feedback
 */

export interface InterviewMetrics {
    duration: number; // seconds
    transcriptLength: number; // characters
    transcriptWords: number;
    candidateMessageCount: number;
    transcript: string;
    interviewType: string;
    skillLevel: string;
    expectedDuration: number; // expected duration in seconds
}

export interface GradingResult {
    score: number;
    status: 'completed' | 'partial' | 'technical_issue' | 'insufficient_data';
    feedback: string;
    areasForImprovement: string[];
    strengths: string[];
    recommendation: 'strong-hire' | 'hire' | 'maybe' | 'no-hire' | 'retry';
    partialCreditReason?: string;
    technicalIssueReason?: string;
}

export class IntelligentGradingSystem {
    private static readonly MIN_DURATION_FOR_GRADING = 10; // 10 seconds minimum
    private static readonly IDEAL_DURATION_THRESHOLD = 0.3; // 30% of expected duration
    private static readonly GOOD_DURATION_THRESHOLD = 0.6; // 60% of expected duration
    private static readonly EXCELLENT_DURATION_THRESHOLD = 0.8; // 80% of expected duration

    private static readonly MIN_WORDS_FOR_GRADING = 20;
    private static readonly IDEAL_WORDS_THRESHOLD = 0.4; // 40% of expected words
    private static readonly GOOD_WORDS_THRESHOLD = 0.7; // 70% of expected words

    private static readonly MIN_MESSAGES_FOR_GRADING = 1;
    private static readonly IDEAL_MESSAGES_THRESHOLD = 0.3; // 30% of expected messages
    private static readonly GOOD_MESSAGES_THRESHOLD = 0.6; // 60% of expected messages

    /**
     * Main grading function that determines the appropriate grading approach
     */
    static gradeInterview(metrics: InterviewMetrics, aiScore?: number): GradingResult {
        console.log('🧠 [INTELLIGENT GRADING] Analyzing interview metrics:', {
            duration: metrics.duration,
            expectedDuration: metrics.expectedDuration,
            transcriptWords: metrics.transcriptWords,
            candidateMessages: metrics.candidateMessageCount,
            interviewType: metrics.interviewType,
            skillLevel: metrics.skillLevel
        });

        // Step 1: Determine if this is a technical issue (very strict criteria)
        const technicalIssue = this.detectTechnicalIssue(metrics);
        if (technicalIssue) {
            return this.handleTechnicalIssue(metrics, technicalIssue);
        }

        // Step 2: Always try partial completion scoring first (more lenient approach)
        const partialScore = this.calculatePartialCompletionScore(metrics, aiScore);

        // Step 3: Only use insufficient data handling for truly empty interviews
        if (partialScore === 0 && metrics.duration < 5 && metrics.transcriptWords < 5) {
            const insufficientData = this.detectInsufficientData(metrics);
            if (insufficientData) {
                return this.handleInsufficientData(metrics, insufficientData);
            }
        }

        // Step 4: Generate appropriate feedback and recommendation
        return this.generateGradingResult(metrics, partialScore, aiScore);
    }

    /**
     * Detects if the interview failure was due to technical issues
     */
    private static detectTechnicalIssue(metrics: InterviewMetrics): string | null {
        // Very short duration with no meaningful content suggests technical issue
        if (metrics.duration < 15 && metrics.transcriptWords < 10) {
            return 'connection_failed';
        }

        // Duration exists but no candidate messages suggests microphone issue
        if (metrics.duration > 10 && metrics.candidateMessageCount === 0) {
            return 'microphone_issue';
        }

        // Very short duration with some content suggests early disconnection
        if (metrics.duration < 20 && metrics.transcriptWords > 5 && metrics.candidateMessageCount > 0) {
            return 'early_disconnection';
        }

        return null;
    }

    /**
     * Detects if there's insufficient data for meaningful evaluation
     */
    private static detectInsufficientData(metrics: InterviewMetrics): string | null {
        if (metrics.duration < this.MIN_DURATION_FOR_GRADING) {
            return 'duration_too_short';
        }

        if (metrics.transcriptWords < this.MIN_WORDS_FOR_GRADING) {
            return 'insufficient_content';
        }

        if (metrics.candidateMessageCount < this.MIN_MESSAGES_FOR_GRADING) {
            return 'insufficient_participation';
        }

        return null;
    }

    /**
     * Handles technical issues with appropriate messaging
     */
    private static handleTechnicalIssue(metrics: InterviewMetrics, issue: string): GradingResult {
        const baseResult: GradingResult = {
            score: 0,
            status: 'technical_issue',
            feedback: '',
            areasForImprovement: [],
            strengths: [],
            recommendation: 'retry'
        };

        switch (issue) {
            case 'connection_failed':
                return {
                    ...baseResult,
                    feedback: "We couldn't establish a stable connection for your interview. This appears to be a technical issue on our end or with your internet connection.",
                    areasForImprovement: [
                        "Check your internet connection",
                        "Try again in a few minutes",
                        "Ensure you're in a location with stable WiFi"
                    ],
                    strengths: ["Willingness to participate"],
                    technicalIssueReason: "Connection failed during interview setup"
                };

            case 'microphone_issue':
                return {
                    ...baseResult,
                    feedback: "We couldn't hear your responses during the interview. This might be a microphone permission or audio issue.",
                    areasForImprovement: [
                        "Check microphone permissions in your browser",
                        "Ensure your microphone is not muted",
                        "Test your audio before starting the interview"
                    ],
                    strengths: ["Attempted to participate"],
                    technicalIssueReason: "Microphone not working or not permitted"
                };

            case 'early_disconnection':
                return {
                    ...baseResult,
                    feedback: "Your interview was cut short due to a connection issue. We could see you were participating before the disconnection.",
                    areasForImprovement: [
                        "Check your internet stability",
                        "Try again when you have a stronger connection",
                        "Consider using a different device or location"
                    ],
                    strengths: ["Started participating before technical issue"],
                    technicalIssueReason: "Connection lost during interview"
                };

            default:
                return baseResult;
        }
    }

    /**
     * Handles insufficient data scenarios
     */
    private static handleInsufficientData(metrics: InterviewMetrics, issue: string): GradingResult {
        const baseResult: GradingResult = {
            score: 0,
            status: 'insufficient_data',
            feedback: '',
            areasForImprovement: [],
            strengths: [],
            recommendation: 'retry'
        };

        switch (issue) {
            case 'duration_too_short':
                return {
                    ...baseResult,
                    feedback: "Your interview session was very brief. To provide a fair evaluation, we need at least a few minutes of conversation.",
                    areasForImprovement: [
                        "Try a longer interview session",
                        "Engage more with the interviewer's questions",
                        "Share detailed examples and experiences"
                    ],
                    strengths: ["Attempted to start the interview"],
                    partialCreditReason: "Session too brief for meaningful evaluation"
                };

            case 'insufficient_content':
                return {
                    ...baseResult,
                    feedback: "We need more detailed responses to provide a meaningful evaluation. Try sharing more about your experience and thoughts.",
                    areasForImprovement: [
                        "Provide more detailed answers",
                        "Share specific examples from your experience",
                        "Elaborate on your technical knowledge"
                    ],
                    strengths: ["Participated in the interview"],
                    partialCreditReason: "Limited content for comprehensive evaluation"
                };

            case 'insufficient_participation':
                return {
                    ...baseResult,
                    feedback: "We'd love to hear more from you! Try responding to more of the interviewer's questions to get a better evaluation.",
                    areasForImprovement: [
                        "Respond to all interviewer questions",
                        "Ask clarifying questions if needed",
                        "Share your thought process out loud"
                    ],
                    strengths: ["Started the interview process"],
                    partialCreditReason: "Limited participation in conversation"
                };

            default:
                return baseResult;
        }
    }

    /**
     * Calculates partial completion score using mathematical formulas
     */
    private static calculatePartialCompletionScore(metrics: InterviewMetrics, aiScore?: number): number {
        // Calculate completion percentages
        const durationCompletion = Math.min(metrics.duration / metrics.expectedDuration, 1);
        const contentCompletion = this.calculateContentCompletion(metrics);
        const participationCompletion = this.calculateParticipationCompletion(metrics);

        console.log('📊 [PARTIAL SCORING] Completion metrics:', {
            durationCompletion: (durationCompletion * 100).toFixed(1) + '%',
            contentCompletion: (contentCompletion * 100).toFixed(1) + '%',
            participationCompletion: (participationCompletion * 100).toFixed(1) + '%'
        });

        // Weighted scoring formula
        const weights = {
            duration: 0.3,      // 30% weight for time spent
            content: 0.4,       // 40% weight for content quality
            participation: 0.2, // 20% weight for participation
            aiScore: 0.1        // 10% weight for AI analysis (if available)
        };

        // Calculate base score from completion metrics
        let baseScore = (
            durationCompletion * weights.duration +
            contentCompletion * weights.content +
            participationCompletion * weights.participation
        ) * 100;

        // Apply AI score if available (normalized to 0-100)
        if (aiScore !== undefined && aiScore > 0) {
            const normalizedAiScore = Math.min(aiScore * 10, 100); // Convert 0-10 to 0-100
            baseScore = baseScore * (1 - weights.aiScore) + normalizedAiScore * weights.aiScore;
        }

        // Apply completion bonus/penalty
        const completionMultiplier = this.calculateCompletionMultiplier(durationCompletion, contentCompletion);
        let finalScore = Math.round(baseScore * completionMultiplier);

        // Apply intelligent minimum scoring based on participation quality
        if (metrics.duration > 0 && metrics.transcriptWords > 0) {
            // Calculate participation quality score
            const participationQuality = this.calculateParticipationQuality(metrics);
            const qualityBasedMinScore = Math.round(participationQuality * 20); // 0-20 points based on quality
            finalScore = Math.max(qualityBasedMinScore, finalScore);
        }

        // Ensure score is within bounds
        return Math.max(0, Math.min(100, finalScore));
    }

    /**
     * Calculates content completion based on transcript quality
     */
    private static calculateContentCompletion(metrics: InterviewMetrics): number {
        const expectedWords = this.getExpectedWordCount(metrics.expectedDuration, metrics.interviewType);
        const actualWords = metrics.transcriptWords;

        const wordCompletion = Math.min(actualWords / expectedWords, 1);

        // Bonus for quality content (longer average words suggest more detailed responses)
        const avgWordLength = metrics.transcript.split(' ').reduce((sum, word) => sum + word.length, 0) / metrics.transcriptWords;
        const qualityBonus = Math.min(avgWordLength / 6, 1) * 0.2; // Max 20% bonus for quality

        return Math.min(wordCompletion + qualityBonus, 1);
    }

    /**
     * Calculates participation completion based on message count
     */
    private static calculateParticipationCompletion(metrics: InterviewMetrics): number {
        const expectedMessages = this.getExpectedMessageCount(metrics.expectedDuration);
        const actualMessages = metrics.candidateMessageCount;

        return Math.min(actualMessages / expectedMessages, 1);
    }

    /**
     * Calculates completion multiplier for partial credit
     */
    private static calculateCompletionMultiplier(durationCompletion: number, contentCompletion: number): number {
        const overallCompletion = (durationCompletion + contentCompletion) / 2;

        if (overallCompletion >= this.EXCELLENT_DURATION_THRESHOLD) {
            return 1.0; // Full credit
        } else if (overallCompletion >= this.GOOD_DURATION_THRESHOLD) {
            return 0.9; // 90% credit
        } else if (overallCompletion >= this.IDEAL_DURATION_THRESHOLD) {
            return 0.8; // 80% credit
        } else if (overallCompletion >= 0.1) { // 10% completion
            return 0.6; // 60% credit for minimal completion
        } else {
            return 0.5; // 50% credit for very brief participation
        }
    }

    /**
     * Generates the final grading result with appropriate feedback
     */
    private static generateGradingResult(metrics: InterviewMetrics, score: number, aiScore?: number): GradingResult {
        const durationCompletion = metrics.duration / metrics.expectedDuration;
        const isPartialCompletion = durationCompletion < 0.8;

        let status: 'completed' | 'partial' = 'completed';
        let feedback = '';
        let recommendation: 'strong-hire' | 'hire' | 'maybe' | 'no-hire' | 'retry' = 'maybe';

        if (isPartialCompletion) {
            status = 'partial';
            feedback = this.generatePartialCompletionFeedback(metrics, score);
            recommendation = score >= 60 ? 'maybe' : 'retry';
        } else {
            feedback = this.generateFullCompletionFeedback(metrics, score);
            recommendation = this.getRecommendationFromScore(score);
        }

        return {
            score,
            status,
            feedback,
            areasForImprovement: this.generateAreasForImprovement(metrics, score),
            strengths: this.generateStrengths(metrics, score),
            recommendation,
            partialCreditReason: isPartialCompletion ? `Completed ${Math.round(durationCompletion * 100)}% of expected duration` : undefined
        };
    }

    /**
     * Generates encouraging feedback for partial completion
     */
    private static generatePartialCompletionFeedback(metrics: InterviewMetrics, score: number): string {
        const durationCompletion = Math.round((metrics.duration / metrics.expectedDuration) * 100);

        if (score >= 70) {
            return `Great start! You completed ${durationCompletion}% of the interview and showed strong potential. With a full session, you'd likely score even higher.`;
        } else if (score >= 50) {
            return `Good effort! You completed ${durationCompletion}% of the interview and demonstrated some solid skills. Consider trying a full session for a complete evaluation.`;
        } else {
            return `Thanks for participating! You completed ${durationCompletion}% of the interview. A longer session would help us better understand your capabilities.`;
        }
    }

    /**
     * Generates feedback for full completion
     */
    private static generateFullCompletionFeedback(metrics: InterviewMetrics, score: number): string {
        if (score >= 90) {
            return "Outstanding performance! You demonstrated excellent technical knowledge and communication skills throughout the interview.";
        } else if (score >= 80) {
            return "Great job! You showed strong technical abilities and clear communication. Keep up the excellent work!";
        } else if (score >= 70) {
            return "Good performance! You demonstrated solid skills and good communication. There's room for growth, but you're on the right track.";
        } else if (score >= 50) {
            return "You showed potential in this interview. With some practice and preparation, you can definitely improve your performance.";
        } else {
            return "Thanks for participating! This interview highlighted some areas for improvement, but every interview is a learning opportunity.";
        }
    }

    /**
     * Generates areas for improvement based on performance
     */
    private static generateAreasForImprovement(metrics: InterviewMetrics, score: number): string[] {
        const improvements: string[] = [];

        if (score < 60) {
            improvements.push("Practice explaining technical concepts clearly");
            improvements.push("Prepare specific examples from your experience");
        }

        if (metrics.duration < metrics.expectedDuration * 0.8) {
            improvements.push("Try to engage in longer conversations during interviews");
        }

        if (metrics.candidateMessageCount < 5) {
            improvements.push("Practice responding to more questions during interviews");
        }

        if (score < 80) {
            improvements.push("Review fundamental concepts in your field");
            improvements.push("Practice problem-solving under time pressure");
        }

        return improvements.length > 0 ? improvements : ["Continue practicing and learning"];
    }

    /**
     * Generates strengths based on performance
     */
    private static generateStrengths(metrics: InterviewMetrics, score: number): string[] {
        const strengths: string[] = [];

        if (score >= 70) {
            strengths.push("Good technical understanding");
            strengths.push("Clear communication");
        }

        if (metrics.candidateMessageCount >= 3) {
            strengths.push("Active participation");
        }

        if (metrics.duration >= metrics.expectedDuration * 0.6) {
            strengths.push("Good engagement");
        }

        if (score >= 50) {
            strengths.push("Willingness to learn and improve");
        }

        return strengths.length > 0 ? strengths : ["Courage to participate in interviews"];
    }

    /**
     * Gets recommendation based on score
     */
    private static getRecommendationFromScore(score: number): 'strong-hire' | 'hire' | 'maybe' | 'no-hire' {
        if (score >= 90) return 'strong-hire';
        if (score >= 80) return 'hire';
        if (score >= 60) return 'maybe';
        return 'no-hire';
    }

    /**
     * Calculates participation quality based on multiple factors
     */
    private static calculateParticipationQuality(metrics: InterviewMetrics): number {
        // Factor 1: Duration quality (longer is better, but with diminishing returns)
        const durationQuality = Math.min(metrics.duration / 300, 1); // 5 minutes = 1.0

        // Factor 2: Content density (words per minute)
        const wordsPerMinute = metrics.transcriptWords / (metrics.duration / 60);
        const contentDensity = Math.min(wordsPerMinute / 50, 1); // 50 WPM = 1.0

        // Factor 3: Message engagement (responses per minute)
        const messagesPerMinute = metrics.candidateMessageCount / (metrics.duration / 60);
        const engagementLevel = Math.min(messagesPerMinute / 2, 1); // 2 messages/min = 1.0

        // Factor 4: Content quality (average word length indicates thoughtfulness)
        const avgWordLength = metrics.transcript.split(' ').reduce((sum, word) => sum + word.length, 0) / metrics.transcriptWords;
        const contentQuality = Math.min(avgWordLength / 6, 1); // 6 chars/word = 1.0

        // Weighted combination
        const quality = (
            durationQuality * 0.3 +
            contentDensity * 0.3 +
            engagementLevel * 0.2 +
            contentQuality * 0.2
        );

        return Math.max(0, Math.min(1, quality));
    }

    /**
     * Helper methods for calculating expected values
     */
    private static getExpectedWordCount(duration: number, interviewType: string): number {
        // Base words per minute varies by interview type
        const wordsPerMinute = {
            'technical': 120,
            'soft_skills': 100,
            'behavioral': 110,
            'system_design': 130
        };

        const baseWPM = wordsPerMinute[interviewType as keyof typeof wordsPerMinute] || 110;
        return Math.round((duration / 60) * baseWPM);
    }

    private static getExpectedMessageCount(duration: number): number {
        // Assume 1 message per 30 seconds on average
        return Math.max(2, Math.round(duration / 30));
    }
}
