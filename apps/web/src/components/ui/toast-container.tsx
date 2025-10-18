'use client';

import { AnimatePresence } from 'framer-motion';
import { Toast, ToastPosition } from '@/lib/toast-types';
import { ToastComponent } from './toast';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const getContainerStyles = (position: ToastPosition) => {
    const baseStyles = 'fixed z-50 flex flex-col gap-2 pointer-events-none';

    switch (position) {
        case ToastPosition.TOP_LEFT:
            return `${baseStyles} top-4 left-4`;
        case ToastPosition.TOP_RIGHT:
            return `${baseStyles} top-4 right-4`;
        case ToastPosition.TOP_CENTER:
            return `${baseStyles} top-4 left-1/2 transform -translate-x-1/2`;
        case ToastPosition.BOTTOM_LEFT:
            return `${baseStyles} bottom-4 left-4`;
        case ToastPosition.BOTTOM_RIGHT:
            return `${baseStyles} bottom-4 right-4`;
        case ToastPosition.BOTTOM_CENTER:
            return `${baseStyles} bottom-4 left-1/2 transform -translate-x-1/2`;
        default:
            return `${baseStyles} top-4 right-4`;
    }
};

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
    // Group toasts by position
    const toastsByPosition = toasts.reduce((acc, toast) => {
        const position = toast.position || ToastPosition.TOP_RIGHT;
        if (!acc[position]) {
            acc[position] = [];
        }
        acc[position].push(toast);
        return acc;
    }, {} as Record<ToastPosition, Toast[]>);

    return (
        <>
            {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
                <div
                    key={position}
                    className={getContainerStyles(position as ToastPosition)}
                >
                    <AnimatePresence mode="popLayout">
                        {positionToasts.map((toast) => (
                            <ToastComponent
                                key={toast.id}
                                toast={toast}
                                onRemove={onRemove}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ))}
        </>
    );
};
