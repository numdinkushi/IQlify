'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { PreInterviewValidation } from '@/lib/interview-types';

interface ValidationMessagesProps {
    validation: PreInterviewValidation | null;
}

export function ValidationMessages({ validation }: ValidationMessagesProps) {
    if (!validation) return null;

    return (
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
    );
}
