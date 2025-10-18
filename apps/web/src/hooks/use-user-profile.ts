import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export const useUserProfile = (walletAddress?: string) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Get user data
    const user = useQuery(
        api.users.getUserByWallet,
        walletAddress ? { walletAddress } : "skip"
    );

    // Update user profile mutation
    const updateUserProfile = useMutation(api.users.updateUserProfile);

    const openProfile = () => setIsProfileOpen(true);
    const closeProfile = () => setIsProfileOpen(false);

    const updateProfile = async (profileData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        profileImage?: string;
        skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    }) => {
        if (!user?._id) return;

        try {
            await updateUserProfile({
                userId: user._id,
                ...profileData,
            });
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    };

    return {
        user,
        isProfileOpen,
        openProfile,
        closeProfile,
        updateProfile,
        isLoading: user === undefined,
    };
};
