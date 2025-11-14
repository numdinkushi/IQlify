'use client';

import { useState } from 'react';
import { InterviewType } from '@/lib/interview-types';
import { INTERVIEW_TYPE_CONFIGS, getInterviewTypeConfig } from '@/lib/interview-config';
import { Card } from '@/components/ui/card';
import { Code, Users, Brain, Network } from 'lucide-react';

interface InterviewTypeSelectorProps {
    selectedType?: InterviewType;
    onTypeSelect: (type: InterviewType) => void;
    className?: string;
}

const getTypeIcon = (type: InterviewType) => {
    switch (type) {
        case InterviewType.TECHNICAL:
            return <Code className="w-5 h-5 text-blue-400" />;
        case InterviewType.SOFT_SKILLS:
            return <Users className="w-5 h-5 text-green-400" />;
        case InterviewType.BEHAVIORAL:
            return <Brain className="w-5 h-5 text-purple-400" />;
        case InterviewType.SYSTEM_DESIGN:
            return <Network className="w-5 h-5 text-orange-400" />;
        default:
            return <Code className="w-5 h-5 text-gray-400" />;
    }
};

const getTypeColor = (type: InterviewType) => {
    switch (type) {
        case InterviewType.TECHNICAL:
            return 'border-blue-400/30 bg-blue-400/10 hover:border-blue-400/50';
        case InterviewType.SOFT_SKILLS:
            return 'border-green-400/30 bg-green-400/10 hover:border-green-400/50';
        case InterviewType.BEHAVIORAL:
            return 'border-purple-400/30 bg-purple-400/10 hover:border-purple-400/50';
        case InterviewType.SYSTEM_DESIGN:
            return 'border-orange-400/30 bg-orange-400/10 hover:border-orange-400/50';
        default:
            return 'border-gray-400/30 bg-gray-400/10 hover:border-gray-400/50';
    }
};

const getSelectedColor = (type: InterviewType) => {
    switch (type) {
        case InterviewType.TECHNICAL:
            return 'border-blue-400 bg-blue-400/20';
        case InterviewType.SOFT_SKILLS:
            return 'border-green-400 bg-green-400/20';
        case InterviewType.BEHAVIORAL:
            return 'border-purple-400 bg-purple-400/20';
        case InterviewType.SYSTEM_DESIGN:
            return 'border-orange-400 bg-orange-400/20';
        default:
            return 'border-gray-400 bg-gray-400/20';
    }
};

export const InterviewTypeSelector = ({
    selectedType,
    onTypeSelect,
    className = ''
}: InterviewTypeSelectorProps) => {
    const [hoveredType, setHoveredType] = useState<InterviewType | null>(null);

    const handleTypeClick = (type: InterviewType) => {
        onTypeSelect(type);
    };

    const getCardClasses = (type: InterviewType) => {
        const isSelected = selectedType === type;
        const isHovered = hoveredType === type;

        const baseClasses = 'cursor-pointer transition-all duration-200 p-4 border-2 relative';
        const colorClasses = isSelected
            ? getSelectedColor(type)
            : isHovered
                ? getTypeColor(type)
                : 'border-gray-600/30 bg-gray-800/50 hover:border-gray-500/50';

        return `${baseClasses} ${colorClasses} ${className}`;
    };

    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                    Choose Interview Type
                </h3>
                <p className="text-gray-400 text-sm">
                    Select the type of interview you want to practice
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(InterviewType).map((type) => {
                    const config = getInterviewTypeConfig(type);
                    const isSelected = selectedType === type;

                    return (
                        <Card
                            key={type}
                            className={getCardClasses(type)}
                            onClick={() => handleTypeClick(type)}
                            onMouseEnter={() => setHoveredType(type)}
                            onMouseLeave={() => setHoveredType(null)}
                        >
                            <div className="flex items-start space-x-4">
                                {/* Icon */}
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/50 flex-shrink-0">
                                    {getTypeIcon(type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-white">
                                            {config.label}
                                        </h4>
                                        <div className="text-sm font-medium text-gold-400">
                                            {config.baseReward} CELO
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-400 mb-3">
                                        {config.description}
                                    </p>

                                    {/* Skills */}
                                    <div className="space-y-2">
                                        <div className="text-xs text-gray-500">
                                            Skills Covered:
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {config.skills.slice(0, 3).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {config.skills.length > 3 && (
                                                <span className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded">
                                                    +{config.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            Est. Duration: {config.estimatedDuration} min
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Base Reward: {config.baseReward} CELO
                                        </div>
                                    </div>
                                </div>

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3">
                                        <div className="w-3 h-3 bg-gold-400 rounded-full" />
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Selected Type Details */}
            {selectedType && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-white">
                                {getInterviewTypeConfig(selectedType).label} Selected
                            </h4>
                            <p className="text-sm text-gray-400">
                                {getInterviewTypeConfig(selectedType).description}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gold-400 font-medium">
                                {getInterviewTypeConfig(selectedType).baseReward} CELO
                            </div>
                            <div className="text-xs text-gray-500">
                                Base Reward
                            </div>
                        </div>
                    </div>

                    {/* Skills List */}
                    <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-2">
                            Skills you'll be assessed on:
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {getInterviewTypeConfig(selectedType).skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
