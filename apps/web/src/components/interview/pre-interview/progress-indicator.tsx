'use client';

interface ProgressIndicatorProps {
    steps: string[];
    currentStepIndex: number;
}

export function ProgressIndicator({ steps, currentStepIndex }: ProgressIndicatorProps) {
    return (
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
    );
}
