'use client';

import { useState, useEffect } from 'react';
import { EquipmentCheckService } from '@/lib/equipment-check';
import { EquipmentStatus, EquipmentCheckResult } from '@/lib/interview-types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Mic,
    Volume2,
    Wifi,
    Monitor,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

interface EquipmentCheckProps {
    onCheckComplete: (result: EquipmentCheckResult) => void;
    onRetry?: () => void;
    className?: string;
}

const getStatusIcon = (status: boolean) => {
    return status ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
        <XCircle className="w-5 h-5 text-red-400" />
    );
};

const getStatusColor = (status: boolean) => {
    return status ? 'text-green-400' : 'text-red-400';
};

const getStatusText = (status: boolean) => {
    return status ? 'Working' : 'Issue Detected';
};

export const EquipmentCheck = ({
    onCheckComplete,
    onRetry,
    className = ''
}: EquipmentCheckProps) => {
    const [isChecking, setIsChecking] = useState(false);
    const [equipmentStatus, setEquipmentStatus] = useState<EquipmentStatus | null>(null);
    const [checkResult, setCheckResult] = useState<EquipmentCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const equipmentCheckService = EquipmentCheckService.getInstance();

    const performEquipmentCheck = async () => {
        setIsChecking(true);
        setError(null);

        try {
            const result = await equipmentCheckService.performEquipmentCheck();
            setCheckResult(result);
            setEquipmentStatus(result.status);
            onCheckComplete(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Equipment check failed:', err);
        } finally {
            setIsChecking(false);
        }
    };

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
        performEquipmentCheck();
    };

    useEffect(() => {
        performEquipmentCheck();
    }, []);

    if (isChecking) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Checking Your Equipment
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Please wait while we verify your setup...
                    </p>
                </div>

                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-8 h-8 text-gold-400 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Equipment Check Failed
                    </h3>
                    <p className="text-red-400 text-sm">
                        {error}
                    </p>
                </div>

                <div className="flex justify-center">
                    <Button
                        onClick={handleRetry}
                        variant="outline"
                        className="bg-gold-400/20 border-gold-400/50 text-gold-400 hover:bg-gold-400/30"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!equipmentStatus || !checkResult) {
        return null;
    }

    const equipmentItems = [
        {
            name: 'Microphone',
            status: equipmentStatus.microphone,
            icon: <Mic className="w-5 h-5" />,
            description: 'Required for voice interaction'
        },
        {
            name: 'Audio Output',
            status: equipmentStatus.audio,
            icon: <Volume2 className="w-5 h-5" />,
            description: 'Speakers or headphones for hearing'
        },
        {
            name: 'Internet Connection',
            status: equipmentStatus.internet,
            icon: <Wifi className="w-5 h-5" />,
            description: 'Stable connection required'
        },
        {
            name: 'Browser Compatibility',
            status: equipmentStatus.browser,
            icon: <Monitor className="w-5 h-5" />,
            description: 'Modern browser features'
        }
    ];

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                    Equipment Check Results
                </h3>
                <p className="text-gray-400 text-sm">
                    {checkResult.canProceed
                        ? 'All systems are ready for your interview!'
                        : 'Some issues were detected. Please resolve them before proceeding.'
                    }
                </p>
            </div>

            {/* Equipment Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentItems.map((item, index) => (
                    <Card
                        key={index}
                        className={`p-4 border-2 ${item.status
                                ? 'border-green-400/30 bg-green-400/10'
                                : 'border-red-400/30 bg-red-400/10'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`${getStatusColor(item.status)}`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-white">
                                        {item.name}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(item.status)}
                                        <span className={`text-sm ${getStatusColor(item.status)}`}>
                                            {getStatusText(item.status)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Issues and Recommendations */}
            {checkResult.issues.length > 0 && (
                <Card className="p-4 border-2 border-red-400/30 bg-red-400/10">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-medium text-red-400 mb-2">
                                Issues Detected
                            </h4>
                            <ul className="space-y-1">
                                {checkResult.issues.map((issue, index) => (
                                    <li key={index} className="text-sm text-red-300">
                                        • {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>
            )}

            {checkResult.recommendations.length > 0 && (
                <Card className="p-4 border-2 border-yellow-400/30 bg-yellow-400/10">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-medium text-yellow-400 mb-2">
                                Recommendations
                            </h4>
                            <ul className="space-y-1">
                                {checkResult.recommendations.map((recommendation, index) => (
                                    <li key={index} className="text-sm text-yellow-300">
                                        • {recommendation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
                <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="bg-gray-600/20 border-gray-500/50 text-gray-300 hover:bg-gray-600/30"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recheck Equipment
                </Button>

                {checkResult.canProceed && (
                    <Button
                        onClick={() => {/* Handle proceed */ }}
                        className="bg-gold-400 hover:bg-gold-500 text-black font-medium"
                    >
                        Continue to Interview
                    </Button>
                )}
            </div>
        </div>
    );
};
