'use client';

import { useState } from 'react';
import { PreInterviewLauncher } from './pre-interview-launcher';
import { InterviewConfiguration } from '@/lib/interview-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Settings } from 'lucide-react';

export const InterviewDemo = () => {
    const [isLauncherOpen, setIsLauncherOpen] = useState(false);
    const [lastConfiguration, setLastConfiguration] = useState<InterviewConfiguration | null>(null);

    const handleStartInterview = (config: InterviewConfiguration) => {
        setLastConfiguration(config);
        setIsLauncherOpen(false);
        // Here you would typically start the actual interview
        console.log('Starting interview with configuration:', config);
    };

    const handleCancel = () => {
        setIsLauncherOpen(false);
    };

    if (isLauncherOpen) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <PreInterviewLauncher
                    onStartInterview={handleStartInterview}
                    onCancel={handleCancel}
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4">
                    Interview System Demo
                </h1>
                <p className="text-gray-400 text-lg">
                    Experience the pre-interview setup flow
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start New Interview */}
                <Card className="p-6 border-2 border-gold-400/30 bg-gold-400/10">
                    <div className="text-center space-y-4">
                        <Play className="w-12 h-12 text-gold-400 mx-auto" />
                        <h2 className="text-xl font-semibold text-white">
                            Start New Interview
                        </h2>
                        <p className="text-gray-400">
                            Go through the complete pre-interview setup process
                        </p>
                        <Button
                            onClick={() => setIsLauncherOpen(true)}
                            className="w-full bg-gold-400 hover:bg-gold-500 text-black font-medium"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Launch Interview Setup
                        </Button>
                    </div>
                </Card>

                {/* Last Configuration */}
                {lastConfiguration && (
                    <Card className="p-6 border-2 border-green-400/30 bg-green-400/10">
                        <div className="text-center space-y-4">
                            <Settings className="w-12 h-12 text-green-400 mx-auto" />
                            <h2 className="text-xl font-semibold text-white">
                                Last Configuration
                            </h2>
                            <div className="space-y-2 text-left">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Skill Level:</span>
                                    <span className="text-white">{lastConfiguration.skillLevel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Type:</span>
                                    <span className="text-white">{lastConfiguration.interviewType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white">{lastConfiguration.duration} min</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Prep Time:</span>
                                    <span className="text-white">{lastConfiguration.preparationTime}s</span>
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsLauncherOpen(true)}
                                variant="outline"
                                className="w-full border-green-400/50 text-green-400 hover:bg-green-400/20"
                            >
                                Modify Configuration
                            </Button>
                        </div>
                    </Card>
                )}
            </div>

            {/* Features Overview */}
            <Card className="p-6 border-2 border-blue-400/30 bg-blue-400/10">
                <h2 className="text-xl font-semibold text-white mb-4 text-center">
                    Pre-Interview Setup Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="w-8 h-8 bg-gold-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-black font-bold">1</span>
                        </div>
                        <h3 className="font-medium text-white mb-1">Skill Level</h3>
                        <p className="text-sm text-gray-400">Choose your experience level</p>
                    </div>
                    <div className="text-center">
                        <div className="w-8 h-8 bg-gold-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-black font-bold">2</span>
                        </div>
                        <h3 className="font-medium text-white mb-1">Interview Type</h3>
                        <p className="text-sm text-gray-400">Select the type of interview</p>
                    </div>
                    <div className="text-center">
                        <div className="w-8 h-8 bg-gold-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-black font-bold">3</span>
                        </div>
                        <h3 className="font-medium text-white mb-1">Duration</h3>
                        <p className="text-sm text-gray-400">Set interview length</p>
                    </div>
                    <div className="text-center">
                        <div className="w-8 h-8 bg-gold-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-black font-bold">4</span>
                        </div>
                        <h3 className="font-medium text-white mb-1">Equipment</h3>
                        <p className="text-sm text-gray-400">Verify your setup</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
