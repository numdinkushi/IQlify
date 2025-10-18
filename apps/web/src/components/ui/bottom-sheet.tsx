'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-gold-400/20 rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
                        </div>

                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gold-400/10 flex-shrink-0">
                                <h2 className="text-lg font-semibold text-gold-400">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gold-400/20 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
