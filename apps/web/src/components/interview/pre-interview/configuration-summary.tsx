'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { SkillLevel, InterviewType, InterviewDuration } from '@/lib/interview-types';
import { getDurationConfig } from '@/lib/interview-config';

interface ConfigurationSummaryProps {
    skillLevel?: SkillLevel;
    interviewType?: InterviewType;
    duration?: InterviewDuration;
}

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

export function ConfigurationSummary({ skillLevel, interviewType, duration }: ConfigurationSummaryProps) {
    const t = useTranslations();
    
    return (
        <Card className="p-6 border-2 border-gold-400/30 bg-gold-400/10">
            <div className="text-center mb-4">
                <CheckCircle className="w-12 h-12 text-gold-400 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-white">
                    {t('interviewFlow.ready.configuration.title')}
                </h3>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">{t('interviewFlow.ready.configuration.skillLevel')}</span>
                    <span className="text-white font-medium">
                        {skillLevel ? t(`interviewFlow.skillLevel.${skillLevel.toLowerCase()}.label`) : '-'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">{t('interviewFlow.ready.configuration.interviewType')}</span>
                    <span className="text-white font-medium">
                        {interviewType ? t(`interviewFlow.interviewType.${interviewType.toLowerCase()}.label`) : '-'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">{t('interviewFlow.ready.configuration.duration')}</span>
                    <span className="text-white font-medium">
                        {duration ? `${getDurationConfig(duration).timeInMinutes} ${t('interviewFlow.duration.minutes')}` : '-'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">{t('interviewFlow.ready.configuration.equipment')}</span>
                    <span className="text-green-400 font-medium">{t('interviewFlow.ready.configuration.ready')}</span>
                </div>
            </div>
        </Card>
    );
}
