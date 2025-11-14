'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { TabType, AppState, User } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { useAccount } from 'wagmi';

interface AppContextType extends AppState {
    setCurrentTab: (tab: TabType) => void;
    setUser: (user: User | null) => void;
    setIsConnected: (connected: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    address?: string;
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
    // UI State - Application-level state that doesn't need database persistence
    const [currentTab, setCurrentTab] = useState<TabType>(TabType.HOME);
    const [isLoading, setIsLoading] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Connection State - Managed by wagmi, synced here for app-wide access
    const [isConnected, setIsConnected] = useState(false);
    const { address, isConnected: wagmiConnected } = useAccount();

    // User State - This will be replaced by Convex data in components
    const [user, setUser] = useState<User | null>(null);

    // Hydration check
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Tab state - UI state that doesn't need database persistence
    useEffect(() => {
        if (!isHydrated) return;
        const savedTab = localStorage.getItem(STORAGE_KEYS.currentTab) as TabType;
        if (savedTab && Object.values(TabType).includes(savedTab)) {
            setCurrentTab(savedTab);
        }
    }, [isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        localStorage.setItem(STORAGE_KEYS.currentTab, currentTab);
    }, [currentTab, isHydrated]);

    // Sync wagmi connection state
    useEffect(() => {
        if (!isHydrated) return;
        setIsConnected(wagmiConnected);
    }, [wagmiConnected, isHydrated]);

    const value: AppContextType = {
        currentTab,
        user,
        isConnected: isHydrated ? isConnected : false,
        isLoading,
        address: isHydrated ? address : undefined,
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
