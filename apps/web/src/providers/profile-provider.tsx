'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { ProfileBottomSheet } from '@/components/profile-bottom-sheet';

interface ProfileContextType {
    isProfileOpen: boolean;
    openProfile: () => void;
    closeProfile: () => void;
    user: any;
    isLoading: boolean;
    refreshUser: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
    children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { address, isConnected } = useAccount();

    // Get user data
    const user = useQuery(
        api.users.getUserByWallet,
        address && isConnected ? { walletAddress: address } : "skip"
    );

    const openProfile = () => setIsProfileOpen(true);
    const closeProfile = () => setIsProfileOpen(false);

    // Force refresh user data
    const refreshUser = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const contextValue: ProfileContextType = {
        isProfileOpen,
        openProfile,
        closeProfile,
        user,
        isLoading: user === undefined,
        refreshUser,
    };

    return (
        <ProfileContext.Provider value={contextValue}>
            {children}
            {/* Global Profile Bottom Sheet */}
            <ProfileBottomSheet
                isOpen={isProfileOpen}
                onClose={closeProfile}
                userId={user?._id}
                user={user}
            />
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
