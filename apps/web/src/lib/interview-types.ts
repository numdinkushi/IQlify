// Interview Types and Interfaces
// Following SOLID principles with clear separation of concerns

export enum SkillLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

export enum InterviewType {
    TECHNICAL = 'technical',
    SOFT_SKILLS = 'soft_skills',
    BEHAVIORAL = 'behavioral',
    SYSTEM_DESIGN = 'system_design'
}

export enum InterviewDuration {
    SHORT = 5,     // 5 minutes
    MEDIUM = 10,   // 10 minutes
    LONG = 15      // 15 minutes
}

export interface InterviewConfiguration {
    skillLevel: SkillLevel;
    interviewType: InterviewType;
    duration: InterviewDuration;
    preparationTime: number; // in seconds
}

export interface EquipmentStatus {
    microphone: boolean;
    audio: boolean;
    internet: boolean;
    browser: boolean;
}

export interface InterviewSetupData {
    configuration: InterviewConfiguration;
    equipmentStatus: EquipmentStatus;
    isReady: boolean;
}

// Skill level configuration
export interface SkillLevelConfig {
    level: SkillLevel;
    label: string;
    description: string;
    baseReward: number; // in CELO
    multiplier: number;
    maxReward: number; // in CELO
    difficulty: number; // 1-10 scale
}

// Interview type configuration
export interface InterviewTypeConfig {
    type: InterviewType;
    label: string;
    description: string;
    baseReward: number; // in CELO
    estimatedDuration: number; // in minutes
    skills: string[];
}

// Duration configuration
export interface DurationConfig {
    duration: InterviewDuration;
    label: string;
    description: string;
    timeInMinutes: number;
    recommendedFor: SkillLevel[];
}

// Equipment check result
export interface EquipmentCheckResult {
    status: EquipmentStatus;
    issues: string[];
    recommendations: string[];
    canProceed: boolean;
}

// Pre-interview validation
export interface PreInterviewValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
}
