// Configuration constants for VAPI integration

export const VAPI_CONFIG = {
    baseUrl: 'https://api.vapi.ai',
    apiKey: process.env.VAPI_API_KEY || '',
    webhookSecret: process.env.VAPI_WEBHOOK_SECRET || '',
    webhookBaseUrl: 'https://deaths-montreal-citizens-springfield.trycloudflare.com',
    defaultModel: 'gpt-4o',
    defaultVoice: {
        voiceId: 'Elliot',
        provider: 'vapi',
    },
    defaultTranscriber: {
        model: 'nova-2',
        language: 'en',
        provider: 'deepgram',
    },
} as const;

export const GEMINI_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    defaultModel: 'gemini-2.0-flash-001',
    defaultTemperature: 0.7,
    maxOutputTokens: 2048,
} as const;

export const INTERVIEW_CONFIG = {
    defaultAmount: 5,
    minAmount: 3,
    maxAmount: 20,
    supportedLevels: ['junior', 'mid', 'senior', 'lead', 'principal'] as const,
    supportedPlatforms: ['web', 'mobile', 'backend', 'fullstack', 'devops'] as const,
} as const;

export const WORKFLOW_TYPES = {
    INTERVIEW: 'interview',
    ASSESSMENT: 'assessment',
    FEEDBACK: 'feedback',
} as const;

export const WEBHOOK_EVENTS = {
    FUNCTION_CALL: 'function-call',
    CONVERSATION_UPDATE: 'conversation-update',
    END_OF_CALL: 'end-of-call-report',
    STATUS_UPDATE: 'status-update',
} as const;


