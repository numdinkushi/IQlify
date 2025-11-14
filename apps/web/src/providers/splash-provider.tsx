'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { STORAGE_KEYS } from '@/lib/constants';

interface SplashContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    showSplash: () => void;
    hideSplash: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function useSplash() {
    const context = useContext(SplashContext);
    if (context === undefined) {
        throw new Error('useSplash must be used within a SplashProvider');
    }
    return context;
}

interface SplashProviderProps {
    children: ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [showInitialSplash, setShowInitialSplash] = useState(true);

    // Show splash screen on every page load/refresh
    useEffect(() => {
        // Always show splash screen initially
        setShowInitialSplash(true);
        setIsLoading(true);

        // Hide splash screen after a minimum duration
        const timer = setTimeout(() => {
            setShowInitialSplash(false);
            setIsLoading(false);
        }, 2000); // 2 seconds minimum

        return () => clearTimeout(timer);
    }, []);

    const showSplash = () => {
        setIsLoading(true);
    };

    const hideSplash = () => {
        setIsLoading(false);
    };

    const handleSplashComplete = () => {
        setShowInitialSplash(false);
        setIsLoading(false);
    };

    const value: SplashContextType = {
        isLoading,
        setIsLoading,
        showSplash,
        hideSplash
    };

    return (
        <SplashContext.Provider value={value}>
            {children}

            {/* Show splash screen for loading states */}
            <SplashScreen
                isVisible={isLoading}
                onComplete={handleSplashComplete}
            />
        </SplashContext.Provider>
    );
}
