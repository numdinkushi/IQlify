'use client';

import { useSplash } from '@/providers/splash-provider';
import { useState, useCallback } from 'react';

interface UseLoadingReturn {
    isLoading: boolean;
    withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
    showLoading: () => void;
    hideLoading: () => void;
}

export function useLoading(): UseLoadingReturn {
    const { isLoading, setIsLoading } = useSplash();
    const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());

    const showLoading = useCallback(() => {
        setIsLoading(true);
    }, [setIsLoading]);

    const hideLoading = useCallback(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
        const loadingId = Math.random().toString(36);

        try {
            setLoadingStates(prev => new Set(prev).add(loadingId));
            setIsLoading(true);

            const result = await asyncFn();
            return result;
        } finally {
            setLoadingStates(prev => {
                const newSet = new Set(prev);
                newSet.delete(loadingId);

                // Only hide loading if no other operations are running
                if (newSet.size === 0) {
                    setIsLoading(false);
                }

                return newSet;
            });
        }
    }, [setIsLoading]);

    return {
        isLoading,
        withLoading,
        showLoading,
        hideLoading
    };
}

// Convenience hook for specific loading scenarios
export function useAsyncLoading() {
    const { withLoading } = useLoading();

    const loadWithSplash = useCallback(async <T>(
        asyncFn: () => Promise<T>,
        options?: {
            minimumDuration?: number;
            onComplete?: () => void;
        }
    ): Promise<T> => {
        const startTime = Date.now();

        try {
            const result = await withLoading(asyncFn);

            // Ensure minimum loading duration for better UX
            if (options?.minimumDuration) {
                const elapsed = Date.now() - startTime;
                const remaining = options.minimumDuration - elapsed;

                if (remaining > 0) {
                    await new Promise(resolve => setTimeout(resolve, remaining));
                }
            }

            options?.onComplete?.();
            return result;
        } catch (error) {
            // Always hide loading on error
            const { setIsLoading } = useSplash();
            setIsLoading(false);
            throw error;
        }
    }, [withLoading]);

    return { loadWithSplash };
}
