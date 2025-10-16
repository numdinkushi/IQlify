'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { TabType, AppState, User } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface AppContextType extends AppState {
    setCurrentTab: (tab: TabType) => void;
    setUser: (user: User | null) => void;
    setIsConnected: (connected: boolean) => void;
    setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppState() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
}

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [currentTab, setCurrentTab] = useState<TabType>(TabType.HOME);
    const [user, setUser] = useState<User | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load saved tab from localStorage
    useEffect(() => {
        const savedTab = localStorage.getItem(STORAGE_KEYS.currentTab) as TabType;
        if (savedTab && Object.values(TabType).includes(savedTab)) {
            setCurrentTab(savedTab);
        }
    }, []);

    // Save tab to localStorage when it changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.currentTab, currentTab);
    }, [currentTab]);

    const value: AppContextType = {
        currentTab,
        user,
        isConnected,
        isLoading,
        setCurrentTab,
        setUser,
        setIsConnected,
        setIsLoading
    };

   return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
);
}
