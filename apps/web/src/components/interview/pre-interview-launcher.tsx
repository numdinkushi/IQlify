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
import { SkillLevelSelector } from './skill-level-selector';
import { InterviewTypeSelector } from './interview-type-selector';
import { DurationSelector } from './duration-selector';
import { EquipmentCheck } from './equipment-check';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    ArrowRight,
    ArrowLeft,
    Play,
    CheckCircle,
    AlertCircle,
    Coins
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

    // Step progression
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

        // Warnings and recommendations
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
            preparationTime: 120 // 2 minutes
        };

        onStartInterview(config);
    };

    // Calculate potential reward
    const potentialReward = selectedSkillLevel && selectedInterviewType
        ? calculatePotentialReward(selectedSkillLevel, selectedInterviewType)
        : 0;

    const getStepTitle = (step: SetupStep) => {
        switch (step) {
            case 'skill':
                return 'Select Skill Level';
            case 'type':
                return 'Choose Interview Type';
            case 'duration':
                return 'Set Duration';
            case 'equipment':
                return 'Equipment Check';
            case 'ready':
                return 'Ready to Start';
            default:
                return 'Interview Setup';
        }
    };

    const getStepDescription = (step: SetupStep) => {
        switch (step) {
            case 'skill':
                return 'Choose your experience level to get appropriate questions';
            case 'type':
                return 'Select what type of interview you want to practice';
            case 'duration':
                return 'How long do you want your interview to be?';
            case 'equipment':
                return 'Let\'s make sure your setup is ready';
            case 'ready':
                return 'Everything looks good! Ready to start your interview?';
            default:
                return '';
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {getStepTitle(currentStep)}
                </h2>
                <p className="text-gray-400">
                    {getStepDescription(currentStep)}
                </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4">
                {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStepIndex
                                    ? 'bg-gold-400 text-black'
                                    : 'bg-gray-600 text-gray-400'
                                }`}
                        >
                            {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`w-8 h-0.5 ${index < currentStepIndex ? 'bg-gold-400' : 'bg-gray-600'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
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
                        {/* Configuration Summary */}
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
                                    <span className="text-white font-medium">{selectedSkillLevel}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Interview Type:</span>
                                    <span className="text-white font-medium">{selectedInterviewType}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white font-medium">{selectedDuration} minutes</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Equipment:</span>
                                    <span className="text-green-400 font-medium">Ready</span>
                                </div>
                            </div>
                        </Card>

                        {/* Reward Information */}
                        <Card className="p-6 border-2 border-gold-400/30 bg-gold-400/10">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <Coins className="w-6 h-6 text-gold-400 mr-2" />
                                    <h3 className="text-lg font-semibold text-white">
                                        Potential Reward
                                    </h3>
                                </div>
                                <div className="text-3xl font-bold text-gold-400 mb-2">
                                    {potentialReward.toFixed(2)} CELO
                                </div>
                                <p className="text-sm text-gray-400">
                                    Base reward (performance bonuses may apply)
                                </p>
                            </div>
                        </Card>

                        {/* Validation Messages */}
                        {validation && (
                            <div className="space-y-3">
                                {validation.errors.length > 0 && (
                                    <Card className="p-4 border-2 border-red-400/30 bg-red-400/10">
                                        <div className="flex items-start space-x-3">
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-red-400 mb-1">Errors</h4>
                                                <ul className="space-y-1">
                                                    {validation.errors.map((error, index) => (
                                                        <li key={index} className="text-sm text-red-300">
                                                            • {error}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {validation.warnings.length > 0 && (
                                    <Card className="p-4 border-2 border-yellow-400/30 bg-yellow-400/10">
                                        <div className="flex items-start space-x-3">
                                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-yellow-400 mb-1">Warnings</h4>
                                                <ul className="space-y-1">
                                                    {validation.warnings.map((warning, index) => (
                                                        <li key={index} className="text-sm text-yellow-300">
                                                            • {warning}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
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
