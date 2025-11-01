'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ProfileBottomSheet } from '@/components/profile-bottom-sheet';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';

/**
 * Example component showing how to use the ProfileBottomSheet
 * from other parts of the application
 */
export const ProfileUsageExample = () => {
    const { address, isConnected } = useAccount();
    const { user, isProfileOpen, openProfile, closeProfile } = useUserProfile(address);

    if (!isConnected || !address) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400">Please connect your wallet to view profile</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Example 1: Using the hook */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Profile Hook Usage</h3>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-white">
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : 'Complete your profile'
                            }
                        </p>
                        <p className="text-gray-400 text-sm">
                            {user?.email || 'No email provided'}
                        </p>
                    </div>
                    <Button onClick={openProfile} size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </div>
            </div>

            {/* Example 2: Direct component usage */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Direct Component Usage</h3>
                <Button onClick={openProfile}>
                    Open Profile Settings
                </Button>
            </div>

            {/* Profile Bottom Sheet */}
            <ProfileBottomSheet
                isOpen={isProfileOpen}
                onClose={closeProfile}
                userId={user?._id}
                user={user ?? undefined}
            />
        </div>
    );
};

/**
 * Example of using ProfileBottomSheet in a different component
 * without the hook (manual state management)
 */
export const ManualProfileExample = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { address } = useAccount();
    // Note: ProfileBottomSheet requires userId or user object, not walletAddress
    // This example would need to fetch the user first using useUserProfile hook
    const { user } = useUserProfile(address);

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>
                Open Profile (Manual)
            </Button>

            <ProfileBottomSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                userId={user?._id}
                user={user ?? undefined}
            />
        </div>
    );
};
