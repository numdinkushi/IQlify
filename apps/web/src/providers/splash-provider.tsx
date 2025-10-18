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
    const [isLoading, setIsLoading] = useState(false);
    const [showInitialSplash, setShowInitialSplash] = useState(false);

    // Show initial splash screen on first visit
    useEffect(() => {
        const hasVisited = localStorage.getItem(STORAGE_KEYS.hasVisited);

        if (!hasVisited) {
            // First time visitor - show splash screen
            setShowInitialSplash(true);
            setIsLoading(true);

            // Mark as visited after splash completes
            setTimeout(() => {
                localStorage.setItem(STORAGE_KEYS.hasVisited, 'true');
            }, 3000);
        } else {
            // Returning visitor - skip initial splash
            setShowInitialSplash(false);
            setIsLoading(false);
        }
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
