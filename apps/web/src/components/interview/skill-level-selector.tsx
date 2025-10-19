'use client';

import { useState } from 'react';
import { SkillLevel } from '@/lib/interview-types';
import { SKILL_LEVEL_CONFIGS, getSkillLevelConfig } from '@/lib/interview-config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Trophy, Target } from 'lucide-react';

interface SkillLevelSelectorProps {
    selectedLevel?: SkillLevel;
    onLevelSelect: (level: SkillLevel) => void;
    className?: string;
}

const getSkillIcon = (level: SkillLevel) => {
    switch (level) {
        case SkillLevel.BEGINNER:
            return <Target className="w-5 h-5 text-green-400" />;
        case SkillLevel.INTERMEDIATE:
            return <Star className="w-5 h-5 text-yellow-400" />;
        case SkillLevel.ADVANCED:
            return <Trophy className="w-5 h-5 text-gold-400" />;
        default:
            return <Target className="w-5 h-5 text-gray-400" />;
    }
};

const getSkillColor = (level: SkillLevel) => {
    switch (level) {
        case SkillLevel.BEGINNER:
            return 'border-green-400/30 bg-green-400/10 hover:border-green-400/50';
        case SkillLevel.INTERMEDIATE:
            return 'border-yellow-400/30 bg-yellow-400/10 hover:border-yellow-400/50';
        case SkillLevel.ADVANCED:
            return 'border-gold-400/30 bg-gold-400/10 hover:border-gold-400/50';
        default:
            return 'border-gray-400/30 bg-gray-400/10 hover:border-gray-400/50';
    }
};

const getSelectedColor = (level: SkillLevel) => {
    switch (level) {
        case SkillLevel.BEGINNER:
            return 'border-green-400 bg-green-400/20';
        case SkillLevel.INTERMEDIATE:
            return 'border-yellow-400 bg-yellow-400/20';
        case SkillLevel.ADVANCED:
            return 'border-gold-400 bg-gold-400/20';
        default:
            return 'border-gray-400 bg-gray-400/20';
    }
};

export const SkillLevelSelector = ({
    selectedLevel,
    onLevelSelect,
    className = ''
}: SkillLevelSelectorProps) => {
    const [hoveredLevel, setHoveredLevel] = useState<SkillLevel | null>(null);

    const handleLevelClick = (level: SkillLevel) => {
        onLevelSelect(level);
    };

    const getCardClasses = (level: SkillLevel) => {
        const isSelected = selectedLevel === level;
        const isHovered = hoveredLevel === level;

        const baseClasses = 'cursor-pointer transition-all duration-200 p-4 border-2';
        const colorClasses = isSelected
            ? getSelectedColor(level)
            : isHovered
                ? getSkillColor(level)
                : 'border-gray-600/30 bg-gray-800/50 hover:border-gray-500/50';

        return `${baseClasses} ${colorClasses} ${className}`;
    };

    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                    Choose Your Skill Level
                </h3>
                <p className="text-gray-400 text-sm">
                    Select the level that best matches your experience
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(SkillLevel).map((level) => {
                    const config = getSkillLevelConfig(level);
                    const isSelected = selectedLevel === level;

                    return (
                        <Card
                            key={level}
                            className={getCardClasses(level)}
                            onClick={() => handleLevelClick(level)}
                            onMouseEnter={() => setHoveredLevel(level)}
                            onMouseLeave={() => setHoveredLevel(null)}
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                {/* Icon */}
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/50">
                                    {getSkillIcon(level)}
                                </div>

                                {/* Level Info */}
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-white">
                                        {config.label}
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        {config.description}
                                    </p>
                                </div>

                                {/* Reward Info */}
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-500">
                                        Base Reward
                                    </div>
                                    <div className="text-sm font-medium text-gold-400">
                                        {config.baseReward} CELO
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Max: {config.maxReward} CELO
                                    </div>
                                </div>

                                {/* Difficulty Indicator */}
                                <div className="flex space-x-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${i < Math.ceil(config.difficulty / 2)
                                                    ? 'bg-gold-400'
                                                    : 'bg-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>

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

            {/* Selected Level Details */}
            {selectedLevel && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-white">
                                {getSkillLevelConfig(selectedLevel).label} Level Selected
                            </h4>
                            <p className="text-sm text-gray-400">
                                Difficulty: {getSkillLevelConfig(selectedLevel).difficulty}/10
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gold-400 font-medium">
                                {getSkillLevelConfig(selectedLevel).baseReward} - {getSkillLevelConfig(selectedLevel).maxReward} CELO
                            </div>
                            <div className="text-xs text-gray-500">
                                Potential Reward
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
