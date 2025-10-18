'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast, ToastOptions, ToastType, ToastPosition } from '@/lib/toast-types';
import { ToastContainer } from '@/components/ui/toast-container';

interface ToastContextType {
    toasts: Toast[];
    addToast: (options: ToastOptions) => string;
    removeToast: (id: string) => void;
    clearToasts: () => void;
    success: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
    error: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
    warning: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
    info: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
    loading: (title: string, description?: string, options?: Partial<ToastOptions>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((options: ToastOptions): string => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = {
            id,
            type: options.type,
            title: options.title,
            description: options.description,
            duration: options.duration || 5000,
            position: options.position || ToastPosition.TOP_RIGHT,
            action: options.action,
        };

        setToasts(prev => [...prev, toast]);

        // Auto remove toast after duration
        if (toast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    // Convenience methods
    const success = useCallback((title: string, description?: string, options?: Partial<ToastOptions>) => {
        return addToast({ type: ToastType.SUCCESS, title, description, ...options });
    }, [addToast]);

    const error = useCallback((title: string, description?: string, options?: Partial<ToastOptions>) => {
        return addToast({ type: ToastType.ERROR, title, description, ...options });
    }, [addToast]);

    const warning = useCallback((title: string, description?: string, options?: Partial<ToastOptions>) => {
        return addToast({ type: ToastType.WARNING, title, description, ...options });
    }, [addToast]);

    const info = useCallback((title: string, description?: string, options?: Partial<ToastOptions>) => {
        return addToast({ type: ToastType.INFO, title, description, ...options });
    }, [addToast]);

    const loading = useCallback((title: string, description?: string, options?: Partial<ToastOptions>) => {
        return addToast({ type: ToastType.LOADING, title, description, duration: 0, ...options });
    }, [addToast]);

    const contextValue: ToastContextType = {
        toasts,
        addToast,
        removeToast,
        clearToasts,
        success,
        error,
        warning,
        info,
        loading,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
