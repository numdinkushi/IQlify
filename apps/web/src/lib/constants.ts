import { TabConfig, TabType } from './types';

// Tab Configuration
export const TAB_CONFIGS: TabConfig[] = [
    {
        id: TabType.HOME,
        label: 'Home',
        icon: 'Home',
        path: '/home'
    },
    {
        id: TabType.CHALLENGES,
        label: 'Challenges',
        icon: 'Target',
        path: '/challenges'
    },
    {
        id: TabType.INTERVIEW,
        label: 'Interview',
        icon: 'Mic',
        path: '/interview'
    },
    {
        id: TabType.WALLET,
        label: 'Wallet',
        icon: 'Wallet',
        path: '/wallet'
    },
    {
        id: TabType.LEADERBOARD,
        label: 'Leaderboard',
        icon: 'Trophy',
        path: '/leaderboard'
    }
];

// Skill Level Configuration
export const SKILL_LEVEL_CONFIG = {
    beginner: {
        label: 'Beginner',
        color: 'text-green-400',
        bgColor: 'bg-green-400/20',
        borderColor: 'border-green-400/30',
        entryFee: 1,
        multiplier: 1
    },
    intermediate: {
        label: 'Intermediate',
        color: 'text-gold-400',
        bgColor: 'bg-gold-400/20',
        borderColor: 'border-gold-400/30',
        entryFee: 3,
        multiplier: 2
    },
    advanced: {
        label: 'Advanced',
        color: 'text-red-400',
        bgColor: 'bg-red-400/20',
        borderColor: 'border-red-400/30',
        entryFee: 10,
        multiplier: 5
    }
};

// Challenge Types
export const CHALLENGE_TYPES = {
    daily: {
        label: 'Daily Challenge',
        duration: 24, // hours
        color: 'text-blue-400'
    },
    weekly: {
        label: 'Weekly Challenge',
        duration: 168, // hours (7 days)
        color: 'text-purple-400'
    },
    monthly: {
        label: 'Monthly Challenge',
        duration: 720, // hours (30 days)
        color: 'text-gold-400'
    }
};

// Animation Constants
export const ANIMATION_DURATION = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5
};

export const ANIMATION_EASING = {
    easeInOut: 'easeInOut',
    easeOut: 'easeOut',
    easeIn: 'easeIn'
};

// Platform Constants
export const PLATFORM_CONFIG = {
    name: 'IQlify',
    description: 'Mobile-first educational quiz game that teaches through gamified learning while rewarding users with instant cUSD payments via MiniPay integration and CELO tokens.',
    registrationFee: 3, // CELO
    platformFeePercentage: 20, // 20% of all pools
    minWithdrawal: 1, // CELO
    maxDailyChallenges: 5,
    streakBonusMultiplier: {
        7: 2,    // 7-day streak = 2x earnings
        30: 5    // 30-day streak = 5x earnings
    }
};

// API Endpoints
export const API_ENDPOINTS = {
    user: '/api/user',
    challenges: '/api/challenges',
    interviews: '/api/interviews',
    transactions: '/api/transactions',
    leaderboard: '/api/leaderboard'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    currentTab: 'iqlify_current_tab',
    userProfile: 'iqlify_user_profile',
    streakData: 'iqlify_streak_data',
    lastActiveDate: 'iqlify_last_active_date'
};
