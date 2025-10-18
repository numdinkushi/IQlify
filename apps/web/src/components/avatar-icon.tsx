'use client';

import { useProfile } from '@/providers/profile-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface AvatarIconProps {
    className?: string;
}

export const AvatarIcon = ({ className = '' }: AvatarIconProps) => {
    const { openProfile, user } = useProfile();

    // Generate initials from user's name
    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        }
        if (user?.firstName) {
            return user.firstName.charAt(0).toUpperCase();
        }
        return 'U'; // Default fallback
    };

    return (
        <div
            onClick={openProfile}
            className={`hover:opacity-80 transition-opacity ${className}`}
            aria-label="Open profile"
        >
            <Avatar className="w-10 h-10 ring-2 ring-gold-400/20 hover:ring-gold-400/40 transition-all">
                <AvatarImage
                    src={user?.profileImage}
                    alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-br from-gold-400/20 to-gold-600/30 text-gold-400 font-semibold text-sm">
                    {getInitials()}
                </AvatarFallback>
            </Avatar>
        </div>
    );
};
