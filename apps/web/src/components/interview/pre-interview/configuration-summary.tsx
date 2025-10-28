'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { SkillLevel, InterviewType, InterviewDuration } from '@/lib/interview-types';

interface ConfigurationSummaryProps {
    skillLevel?: SkillLevel;
    interviewType?: InterviewType;
    duration?: InterviewDuration;
}

export function ConfigurationSummary({ skillLevel, interviewType, duration }: ConfigurationSummaryProps) {
    return (
        <Card className="p-6 border-2 border-gold-400/30 bg-gold-400/10">
            <div className="text-center mb-4">
                <CheckCircle className="w-12 h-12 text-gold-400 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-white">
                    Interview Configuration
                </h3>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Skill Level:</span>
                    <span className="text-white font-medium">{skillLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Interview Type:</span>
                    <span className="text-white font-medium">{interviewType}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white font-medium">{duration} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Equipment:</span>
                    <span className="text-green-400 font-medium">Ready</span>
                </div>
            </div>
        </Card>
    );
}
