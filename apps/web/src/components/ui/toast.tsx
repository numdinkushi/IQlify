'use client';

import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Toast, ToastType } from '@/lib/toast-types';

interface ToastProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const getToastIcon = (type: ToastType) => {
    switch (type) {
        case ToastType.SUCCESS:
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case ToastType.ERROR:
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        case ToastType.WARNING:
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case ToastType.INFO:
            return <Info className="w-5 h-5 text-blue-500" />;
        case ToastType.LOADING:
            return <Loader2 className="w-5 h-5 text-gold-400 animate-spin" />;
        default:
            return <Info className="w-5 h-5 text-gray-500" />;
    }
};

const getToastStyles = (type: ToastType) => {
    switch (type) {
        case ToastType.SUCCESS:
            return 'bg-green-900/20 border-green-500/30 text-green-100';
        case ToastType.ERROR:
            return 'bg-red-900/20 border-red-500/30 text-red-100';
        case ToastType.WARNING:
            return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-100';
        case ToastType.INFO:
            return 'bg-blue-900/20 border-blue-500/30 text-blue-100';
        case ToastType.LOADING:
            return 'bg-gold-900/20 border-gold-500/30 text-gold-100';
        default:
            return 'bg-gray-900/20 border-gray-500/30 text-gray-100';
    }
};

export const ToastComponent = ({ toast, onRemove }: ToastProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
        relative flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm
        min-w-[320px] max-w-[400px] shadow-lg
        ${getToastStyles(toast.type)}
      `}
        >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
                {getToastIcon(toast.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight">
                    {toast.title}
                </h4>
                {toast.description && (
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">
                        {toast.description}
                    </p>
                )}

                {/* Action Button */}
                {toast.action && (
                    <button
                        onClick={toast.action.onClick}
                        className="mt-2 text-xs font-medium underline hover:no-underline transition-all"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>

            {/* Close Button */}
            {toast.type !== ToastType.LOADING && (
                <button
                    onClick={() => onRemove(toast.id)}
                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                    aria-label="Close toast"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
};
