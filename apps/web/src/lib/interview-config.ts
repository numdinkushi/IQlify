import {
    SkillLevel,
    InterviewType,
    InterviewDuration,
    SkillLevelConfig,
    InterviewTypeConfig,
    DurationConfig
} from './interview-types';

// Skill Level Configurations
export const SKILL_LEVEL_CONFIGS: Record<SkillLevel, SkillLevelConfig> = {
    [SkillLevel.BEGINNER]: {
        level: SkillLevel.BEGINNER,
        label: 'Beginner',
        description: 'Perfect for those starting their coding journey',
        baseReward: 0.1,
        multiplier: 1.0,
        maxReward: 0.2,
        difficulty: 3
    },
    [SkillLevel.INTERMEDIATE]: {
        level: SkillLevel.INTERMEDIATE,
        label: 'Intermediate',
        description: 'For developers with some experience',
        baseReward: 0.15,
        multiplier: 1.5,
        maxReward: 0.3,
        difficulty: 6
    },
    [SkillLevel.ADVANCED]: {
        level: SkillLevel.ADVANCED,
        label: 'Advanced',
        description: 'For experienced developers and experts',
        baseReward: 0.2,
        multiplier: 2.0,
        maxReward: 0.4,
        difficulty: 9
    }
};

// Interview Type Configurations
export const INTERVIEW_TYPE_CONFIGS: Record<InterviewType, InterviewTypeConfig> = {
    [InterviewType.TECHNICAL]: {
        type: InterviewType.TECHNICAL,
        label: 'Technical Skills',
        description: 'Coding challenges, algorithms, and technical problem-solving',
        baseReward: 0.2,
        estimatedDuration: 30,
        skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Algorithms']
    },
    [InterviewType.SOFT_SKILLS]: {
        type: InterviewType.SOFT_SKILLS,
        label: 'Soft Skills',
        description: 'Communication, teamwork, and professional skills',
        baseReward: 0.15,
        estimatedDuration: 25,
        skills: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork']
    },
    [InterviewType.BEHAVIORAL]: {
        type: InterviewType.BEHAVIORAL,
        label: 'Behavioral',
        description: 'Past experiences, decision-making, and situational questions',
        baseReward: 0.1,
        estimatedDuration: 20,
        skills: ['Decision Making', 'Conflict Resolution', 'Adaptability', 'Initiative']
    },
    [InterviewType.SYSTEM_DESIGN]: {
        type: InterviewType.SYSTEM_DESIGN,
        label: 'System Design',
        description: 'Architecture, scalability, and system design challenges',
        baseReward: 0.3,
        estimatedDuration: 45,
        skills: ['Architecture', 'Scalability', 'Database Design', 'API Design']
    }
};

// Duration Configurations
export const DURATION_CONFIGS: Record<InterviewDuration, DurationConfig> = {
    [InterviewDuration.SHORT]: {
        duration: InterviewDuration.SHORT,
        label: 'Quick (15 min)',
        description: 'Perfect for quick skill assessment',
        timeInMinutes: 15,
        recommendedFor: [SkillLevel.BEGINNER]
    },
    [InterviewDuration.MEDIUM]: {
        duration: InterviewDuration.MEDIUM,
        label: 'Standard (30 min)',
        description: 'Balanced interview with comprehensive questions',
        timeInMinutes: 30,
        recommendedFor: [SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE]
    },
    [InterviewDuration.LONG]: {
        duration: InterviewDuration.LONG,
        label: 'Extended (45 min)',
        description: 'In-depth technical and behavioral assessment',
        timeInMinutes: 45,
        recommendedFor: [SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED]
    }
};

// Helper functions for configuration access
export const getSkillLevelConfig = (level: SkillLevel): SkillLevelConfig => {
    return SKILL_LEVEL_CONFIGS[level];
};

export const getInterviewTypeConfig = (type: InterviewType): InterviewTypeConfig => {
    return INTERVIEW_TYPE_CONFIGS[type];
};

export const getDurationConfig = (duration: InterviewDuration): DurationConfig => {
    const config = DURATION_CONFIGS[duration];
    if (!config) {
        console.error(`No configuration found for duration: ${duration}`);
        // Return a default config to prevent crashes
        return {
            duration: InterviewDuration.MEDIUM,
            label: 'Default (30 min)',
            description: 'Default duration',
            timeInMinutes: 30,
            recommendedFor: [SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE]
        };
    }
    return config;
};

// Calculate total potential reward
export const calculatePotentialReward = (
    skillLevel: SkillLevel,
    interviewType: InterviewType,
    performanceScore?: number
): number => {
    const skillConfig = getSkillLevelConfig(skillLevel);
    const typeConfig = getInterviewTypeConfig(interviewType);

    const baseReward = typeConfig.baseReward * skillConfig.multiplier;

    if (performanceScore) {
        // Performance bonus calculation
        if (performanceScore >= 90) return baseReward + 0.3;
        if (performanceScore >= 80) return baseReward + 0.2;
        if (performanceScore >= 70) return baseReward + 0.1;
    }

    return baseReward;
};
