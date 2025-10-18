'use client';

import { useToast } from '@/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { ToastType, ToastPosition } from '@/lib/toast-types';

export const ToastDemo = () => {
    const { success, error, warning, info, loading, addToast } = useToast();

    const handleSuccess = () => {
        success('Success!', 'This is a success message');
    };

    const handleError = () => {
        error('Error!', 'This is an error message');
    };

    const handleWarning = () => {
        warning('Warning!', 'This is a warning message');
    };

    const handleInfo = () => {
        info('Info!', 'This is an info message');
    };

    const handleLoading = () => {
        const id = loading('Loading...', 'This is a loading message');
        // Auto remove after 3 seconds
        setTimeout(() => {
            // You would need to access removeToast from context
        }, 3000);
    };

    const handleCustom = () => {
        addToast({
            type: ToastType.SUCCESS,
            title: 'Custom Toast',
            description: 'This is a custom toast with action',
            position: ToastPosition.BOTTOM_CENTER,
            action: {
                label: 'Undo',
                onClick: () => console.log('Undo clicked'),
            },
        });
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Toast System Demo</h2>

            <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleSuccess} className="bg-green-600 hover:bg-green-700">
                    Success Toast
                </Button>

                <Button onClick={handleError} className="bg-red-600 hover:bg-red-700">
                    Error Toast
                </Button>

                <Button onClick={handleWarning} className="bg-yellow-600 hover:bg-yellow-700">
                    Warning Toast
                </Button>

                <Button onClick={handleInfo} className="bg-blue-600 hover:bg-blue-700">
                    Info Toast
                </Button>

                <Button onClick={handleLoading} className="bg-gold-600 hover:bg-gold-700">
                    Loading Toast
                </Button>

                <Button onClick={handleCustom} className="bg-purple-600 hover:bg-purple-700">
                    Custom Toast
                </Button>
            </div>
        </div>
    );
};
