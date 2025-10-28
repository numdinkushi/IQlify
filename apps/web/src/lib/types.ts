// IQlify App Types and Enums

export enum TabType {
    HOME = 'home',
    CHALLENGES = 'challenges',
    INTERVIEW = 'interview',
    WALLET = 'wallet',
    LEADERBOARD = 'leaderboard'
}

export enum SkillLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

export enum ChallengeType {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    CUSTOM = 'custom'
}

export enum InterviewStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed',
    GRADING = 'grading',
    PARTIAL = 'partial',
    TECHNICAL_ISSUE = 'technical_issue',
    INSUFFICIENT_DATA = 'insufficient_data'
}

export enum RewardType {
    CELO = 'celo',
    cUSD = 'cUSD',
    USDC = 'USDC',
    USDT = 'USDT',
    BADGE = 'badge',
    XP = 'xp'
}

export interface User {
    id: string;
    walletAddress: string;
    phoneNumber?: string;
    email?: string;
    fullName?: string;
    skillLevel: SkillLevel;
    totalEarnings: number;
    currentStreak: number;
    totalInterviews: number;
    rank: number;
    createdAt: Date;
    lastActiveAt: Date;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    type: ChallengeType;
    skillLevel: SkillLevel;
    entryFee: number;
    prizePool: number;
    participants: number;
    startDate: Date;
    endDate: Date;
    status: 'upcoming' | 'active' | 'completed';
    skills: string[];
}

export interface Interview {
    id: string;
    userId: string;
    challengeId?: string;
    type: 'mock' | 'live' | 'assessment';
    skills: string[];
    status: InterviewStatus;
    score?: number;
    feedback?: string;
    duration: number;
    startedAt: Date;
    completedAt?: Date;
    earnings?: number;
}

export interface Transaction {
    id: string;
    userId: string;
    type: 'earned' | 'spent' | 'withdrawn';
    amount: number;
    currency: RewardType;
    description: string;
    timestamp: Date;
    challengeId?: string;
    interviewId?: string;
}

export interface LeaderboardEntry {
    rank: number;
    user: Pick<User, 'id' | 'fullName' | 'walletAddress'>;
    totalEarnings: number;
    totalInterviews: number;
    streak: number;
    skillLevel: SkillLevel;
}

export interface TabConfig {
    id: TabType;
    label: string;
    icon: string;
    path: string;
    badge?: number;
}

export interface AppState {
    currentTab: TabType;
    user: User | null;
    isConnected: boolean;
    isLoading: boolean;
}
