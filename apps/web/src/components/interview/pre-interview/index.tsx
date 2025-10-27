'use client';

import { useState, useEffect } from 'react';
import {
    SkillLevel,
    InterviewType,
    InterviewDuration,
    InterviewConfiguration,
    EquipmentCheckResult,
    PreInterviewValidation
} from '@/lib/interview-types';
import { calculatePotentialReward } from '@/lib/interview-config';
import { SkillLevelSelector } from '../skill-level-selector';
import { InterviewTypeSelector } from '../interview-type-selector';
import { DurationSelector } from '../duration-selector';
import { EquipmentCheck } from '../equipment-check';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from './progress-indicator';
import { ConfigurationSummary } from './configuration-summary';
import { RewardDisplay } from './reward-display';
import { ValidationMessages } from './validation-messages';
import {
    ArrowRight,
    ArrowLeft,
    Play
} from 'lucide-react';

interface PreInterviewLauncherProps {
    onStartInterview: (config: InterviewConfiguration) => void;
    onCancel: () => void;
    className?: string;
}

type SetupStep = 'skill' | 'type' | 'duration' | 'equipment' | 'ready';

export const PreInterviewLauncher = ({
    onStartInterview,
    onCancel,
    className = ''
}: PreInterviewLauncherProps) => {
    const [currentStep, setCurrentStep] = useState<SetupStep>('skill');
    const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | undefined>();
    const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType | undefined>();
    const [selectedDuration, setSelectedDuration] = useState<InterviewDuration | undefined>();
    const [equipmentResult, setEquipmentResult] = useState<EquipmentCheckResult | null>(null);
    const [validation, setValidation] = useState<PreInterviewValidation | null>(null);

    const steps: SetupStep[] = ['skill', 'type', 'duration', 'equipment', 'ready'];
    const currentStepIndex = steps.indexOf(currentStep);

    const canProceedToNext = () => {
        switch (currentStep) {
            case 'skill':
                return selectedSkillLevel !== undefined;
            case 'type':
                return selectedInterviewType !== undefined;
            case 'duration':
                return selectedDuration !== undefined;
            case 'equipment':
                return equipmentResult?.canProceed === true;
            case 'ready':
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (canProceedToNext() && currentStepIndex < steps.length - 1) {
            setCurrentStep(steps[currentStepIndex + 1]);
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(steps[currentStepIndex - 1]);
        }
    };

    const handleEquipmentCheckComplete = (result: EquipmentCheckResult) => {
        setEquipmentResult(result);
        validateConfiguration();
    };

    const validateConfiguration = (): PreInterviewValidation => {
        const errors: string[] = [];
        const warnings: string[] = [];
        const recommendations: string[] = [];

        if (!selectedSkillLevel) {
            errors.push('Please select a skill level');
        }

        if (!selectedInterviewType) {
            errors.push('Please select an interview type');
        }

        if (!selectedDuration) {
            errors.push('Please select a duration');
        }

        if (!equipmentResult?.canProceed) {
            errors.push('Equipment check must pass before starting interview');
        }

        if (selectedSkillLevel && selectedInterviewType && selectedDuration) {
            const potentialReward = calculatePotentialReward(selectedSkillLevel, selectedInterviewType);
            if (potentialReward < 0.1) {
                warnings.push('This configuration has a low reward potential');
                recommendations.push('Consider selecting a higher skill level or different interview type');
            }
        }

        const validation: PreInterviewValidation = {
            isValid: errors.length === 0,
            errors,
            warnings,
            recommendations
        };

        setValidation(validation);
        return validation;
    };

    const handleStartInterview = () => {
        if (!selectedSkillLevel || !selectedInterviewType || !selectedDuration) {
            return;
        }

        const config: InterviewConfiguration = {
            skillLevel: selectedSkillLevel,
            interviewType: selectedInterviewType,
            duration: selectedDuration,
            preparationTime: 15
        };

        onStartInterview(config);
    };

    const potentialReward = selectedSkillLevel && selectedInterviewType
        ? calculatePotentialReward(selectedSkillLevel, selectedInterviewType)
        : 0;

    const getStepTitle = (step: SetupStep) => {
        const titles: Record<SetupStep, string> = {
            'skill': 'Select Skill Level',
            'type': 'Choose Interview Type',
            'duration': 'Set Duration',
            'equipment': 'Equipment Check',
            'ready': 'Ready to Start'
        };
        return titles[step] || 'Interview Setup';
    };

    const getStepDescription = (step: SetupStep) => {
        const descriptions: Record<SetupStep, string> = {
            'skill': 'Choose your experience level to get appropriate questions',
            'type': 'Select what type of interview you want to practice',
            'duration': 'How long do you want your interview to be?',
            'equipment': 'Let\'s make sure your setup is ready',
            'ready': 'Everything looks good! Ready to start your interview?'
        };
        return descriptions[step] || '';
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {getStepTitle(currentStep)}
                </h2>
                <p className="text-gray-400">
                    {getStepDescription(currentStep)}
                </p>
            </div>

            <ProgressIndicator steps={steps} currentStepIndex={currentStepIndex} />

            <div className="min-h-[400px]">
                {currentStep === 'skill' && (
                    <SkillLevelSelector
                        selectedLevel={selectedSkillLevel}
                        onLevelSelect={setSelectedSkillLevel}
                    />
                )}

                {currentStep === 'type' && (
                    <InterviewTypeSelector
                        selectedType={selectedInterviewType}
                        onTypeSelect={setSelectedInterviewType}
                    />
                )}

                {currentStep === 'duration' && (
                    <DurationSelector
                        selectedDuration={selectedDuration}
                        skillLevel={selectedSkillLevel}
                        onDurationSelect={setSelectedDuration}
                    />
                )}

                {currentStep === 'equipment' && (
                    <EquipmentCheck
                        onCheckComplete={handleEquipmentCheckComplete}
                    />
                )}

                {currentStep === 'ready' && (
                    <div className="space-y-6">
                        <ConfigurationSummary
                            skillLevel={selectedSkillLevel}
                            interviewType={selectedInterviewType}
                            duration={selectedDuration}
                        />

                        <RewardDisplay potentialReward={potentialReward} />

                        <ValidationMessages validation={validation} />
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <Button
                    onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
                    variant="outline"
                    className="bg-gray-600/20 border-gray-500/50 text-gray-300 hover:bg-gray-600/30"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {currentStepIndex === 0 ? 'Cancel' : 'Previous'}
                </Button>

                {currentStep === 'ready' ? (
                    <Button
                        onClick={handleStartInterview}
                        disabled={!validation?.isValid}
                        className="bg-gold-400 hover:bg-gold-500 text-black font-medium"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Start Interview
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className="bg-gold-400 hover:bg-gold-500 text-black font-medium"
                    >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};
