'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { InterviewDuration, SkillLevel } from '@/lib/interview-types';
import { DURATION_CONFIGS, getDurationConfig } from '@/lib/interview-config';
import { Card } from '@/components/ui/card';
import { Clock, Zap, Timer } from 'lucide-react';

interface DurationSelectorProps {
    selectedDuration?: InterviewDuration;
    skillLevel?: SkillLevel;
    onDurationSelect: (duration: InterviewDuration) => void;
    className?: string;
}

const getDurationIcon = (duration: InterviewDuration) => {
    switch (duration) {
        case InterviewDuration.SHORT:
            return <Zap className="w-5 h-5 text-green-400" />;
        case InterviewDuration.MEDIUM:
            return <Clock className="w-5 h-5 text-yellow-400" />;
        case InterviewDuration.LONG:
            return <Timer className="w-5 h-5 text-red-400" />;
        default:
            return <Clock className="w-5 h-5 text-gray-400" />;
    }
};

const getDurationColor = (duration: InterviewDuration) => {
    switch (duration) {
        case InterviewDuration.SHORT:
            return 'border-green-400/30 bg-green-400/10 hover:border-green-400/50';
        case InterviewDuration.MEDIUM:
            return 'border-yellow-400/30 bg-yellow-400/10 hover:border-yellow-400/50';
        case InterviewDuration.LONG:
            return 'border-red-400/30 bg-red-400/10 hover:border-red-400/50';
        default:
            return 'border-gray-400/30 bg-gray-400/10 hover:border-gray-400/50';
    }
};

const getSelectedColor = (duration: InterviewDuration) => {
    switch (duration) {
        case InterviewDuration.SHORT:
            return 'border-green-400 bg-green-400/20';
        case InterviewDuration.MEDIUM:
            return 'border-yellow-400 bg-yellow-400/20';
        case InterviewDuration.LONG:
            return 'border-red-400 bg-red-400/20';
        default:
            return 'border-gray-400 bg-gray-400/20';
    }
};

const isRecommendedForSkillLevel = (duration: InterviewDuration, skillLevel?: SkillLevel): boolean => {
    if (!skillLevel) return true;
    const config = getDurationConfig(duration);
    if (!config || !config.recommendedFor) return true; // Default to true if config is invalid
    return config.recommendedFor.includes(skillLevel);
};

// Helper function to convert duration enum to translation key
const getDurationKey = (duration: InterviewDuration): string => {
    switch (duration) {
        case InterviewDuration.SHORT:
            return 'short';
        case InterviewDuration.MEDIUM:
            return 'medium';
        case InterviewDuration.LONG:
            return 'long';
        default:
            return 'medium';
    }
};

export const DurationSelector = ({
    selectedDuration,
    skillLevel,
    onDurationSelect,
    className = ''
}: DurationSelectorProps) => {
    const t = useTranslations();
    const [hoveredDuration, setHoveredDuration] = useState<InterviewDuration | null>(null);

    const handleDurationClick = (duration: InterviewDuration) => {
        onDurationSelect(duration);
    };

    const getCardClasses = (duration: InterviewDuration) => {
        const isSelected = selectedDuration === duration;
        const isHovered = hoveredDuration === duration;
        const isRecommended = isRecommendedForSkillLevel(duration, skillLevel);

        const baseClasses = 'cursor-pointer transition-all duration-200 p-4 border-2 relative';
        const colorClasses = isSelected
            ? getSelectedColor(duration)
            : isHovered
                ? getDurationColor(duration)
                : 'border-gray-600/30 bg-gray-800/50 hover:border-gray-500/50';

        const recommendedClasses = isRecommended ? '' : 'opacity-60';

        return `${baseClasses} ${colorClasses} ${recommendedClasses} ${className}`;
    };

    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                    {t('interviewFlow.duration.title')}
                </h3>
                <p className="text-gray-400 text-sm">
                    {t('interviewFlow.duration.subtitle')}
                </p>
                {skillLevel && (
                    <p className="text-xs text-gold-400 mt-1">
                        {t('interviewFlow.duration.recommended', { level: skillLevel })}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {([InterviewDuration.SHORT, InterviewDuration.MEDIUM, InterviewDuration.LONG] as const).map((duration) => {
                    const config = getDurationConfig(duration);
                    if (!config) {
                        console.warn(`Invalid duration config for: ${duration}`);
                        return null;
                    }
                    const isSelected = selectedDuration === duration;
                    const isRecommended = isRecommendedForSkillLevel(duration, skillLevel);

                    return (
                        <Card
                            key={duration}
                            className={getCardClasses(duration)}
                            onClick={() => handleDurationClick(duration)}
                            onMouseEnter={() => setHoveredDuration(duration)}
                            onMouseLeave={() => setHoveredDuration(null)}
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                {/* Icon */}
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/50">
                                    {getDurationIcon(duration)}
                                </div>

                                {/* Duration Info */}
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-white">
                                        {t(`interviewFlow.duration.${getDurationKey(duration)}.label`)}
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        {t(`interviewFlow.duration.${getDurationKey(duration)}.description`)}
                                    </p>
                                </div>

                                {/* Time Display */}
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-gold-400">
                                        {config.timeInMinutes}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {t('interviewFlow.duration.minutes')}
                                    </div>
                                </div>

                                {/* Recommendation Badge */}
                                {isRecommended && (
                                    <div className="px-2 py-1 text-xs bg-gold-400/20 text-gold-400 rounded border border-gold-400/30">
                                        {t('interviewFlow.duration.recommendedBadge')}
                                    </div>
                                )}

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-3 h-3 bg-gold-400 rounded-full" />
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Selected Duration Details */}
            {selectedDuration && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-white">
                                {t(`interviewFlow.duration.${getDurationKey(selectedDuration)}.label`)} {t('interviewFlow.duration.selected')}
                            </h4>
                            <p className="text-sm text-gray-400">
                                {t(`interviewFlow.duration.${getDurationKey(selectedDuration)}.description`)}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gold-400">
                                {getDurationConfig(selectedDuration).timeInMinutes}
                            </div>
                            <div className="text-xs text-gray-500">
                                {t('interviewFlow.duration.minutes')}
                            </div>
                        </div>
                    </div>

                    {/* Preparation Time */}
                    <div className="mt-3 pt-3 border-t border-gray-600/30">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                {t('interviewFlow.duration.preparationTime')}
                            </div>
                            <div className="text-sm font-medium text-white">
                                15 {t('interviewFlow.duration.seconds')}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <div className="text-sm text-gray-400">
                                {t('interviewFlow.duration.totalSessionTime')}:
                            </div>
                            <div className="text-sm font-medium text-gold-400">
                                {getDurationConfig(selectedDuration).timeInMinutes} {t('interviewFlow.duration.minutes')}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
