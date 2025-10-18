'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/image-upload';
import { User, Mail, Phone, Star, Camera } from 'lucide-react';

interface ProfileBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: Id<'users'>;
    user?: {
        _id: Id<'users'>;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        profileImage?: string;
        skillLevel: 'beginner' | 'intermediate' | 'advanced';
        walletAddress: string;
    };
    onProfileUpdate?: () => void;
}

export const ProfileBottomSheet = ({
    isOpen,
    onClose,
    userId,
    user
}: ProfileBottomSheetProps) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        skillLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    });
    const [profileImage, setProfileImage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateUserProfile = useMutation(api.users.updateUserProfile);

    // Initialize form data when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                skillLevel: user.skillLevel,
            });
            // Always use the database value as source of truth
            if (user.profileImage) {
                setProfileImage(user.profileImage);
            }
        }
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageUpload = (result: any) => {
        if (result?.secure_url) {
            setProfileImage(result.secure_url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setIsSubmitting(true);
        try {
            await updateUserProfile({
                userId,
                firstName: formData.firstName || undefined,
                lastName: formData.lastName || undefined,
                email: formData.email || undefined,
                phoneNumber: formData.phoneNumber || undefined,
                profileImage: profileImage || undefined,
                skillLevel: formData.skillLevel,
            });

            // Show success message briefly before closing
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSkillLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'text-green-500';
            case 'intermediate': return 'text-yellow-500';
            case 'advanced': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getSkillLevelLabel = (level: string) => {
        switch (level) {
            case 'beginner': return 'Beginner';
            case 'intermediate': return 'Intermediate';
            case 'advanced': return 'Advanced';
            default: return 'Unknown';
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Profile Settings</h2>
                    <p className="text-gray-400 text-sm">Update your profile information</p>
                </div>

                {/* Profile Image Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Camera className="w-5 h-5 text-gold-400" />
                        <span className="text-white font-medium">Profile Picture</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Current/Preview Image */}
                        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-8 h-8 text-gray-400" />
                            )}
                        </div>

                        {/* Upload Component */}
                        <div className="flex-1">
                            <ImageUpload
                                onUploadSuccess={handleImageUpload}
                                onUploadError={(error) => console.error('Upload error:', error)}
                                maxSize={2}
                                accept="image/*"
                                className=""
                            />
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                placeholder="Enter first name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                            placeholder="Enter email address"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* Skill Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Star className="w-4 h-4 inline mr-2" />
                            Skill Level
                        </label>
                        <select
                            value={formData.skillLevel}
                            onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Wallet Address (Read-only) */}
                    {user?.walletAddress && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Wallet Address
                            </label>
                            <input
                                type="text"
                                value={user.walletAddress}
                                disabled
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gold-400 hover:bg-gold-500 text-black font-medium"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </BottomSheet>
    );
};
