// VAPI Types
export interface VapiAssistant {
    id: string;
    orgId: string;
    name: string;
    voice: {
        voiceId: string;
        provider: string;
    };
    model: {
        model: string;
        messages: Array<{
            role: string;
            content: string;
        }>;
        provider: string;
        tools?: VapiTool[];
    };
    firstMessage?: string;
    voicemailMessage?: string;
    endCallMessage?: string;
    transcriber?: {
        model: string;
        language: string;
        provider: string;
    };
    serverUrl?: string;
    serverUrlSecret?: string;
    isServerUrlSecretSet?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VapiTool {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: 'object';
            properties: Record<string, any>;
            required?: string[];
        };
    };
    server?: {
        url: string;
        method: 'POST' | 'GET';
        headers?: Record<string, string>;
    };
}

export interface VapiWebhookPayload {
    message: {
        type: 'function-call' | 'conversation-update' | 'end-of-call-report' | 'status-update';
        functionCall?: {
            name: string;
            parameters: Record<string, any>;
        };
        call?: {
            id: string;
            assistantId: string;
            status: string;
        };
    };
}

export interface VapiCallRequest {
    assistantId: string;
    phoneNumberId?: string;
    customer?: {
        number: string;
        name?: string;
    };
    assistantOverrides?: Partial<VapiAssistant>;
}

// Application Types
export interface InterviewRequest {
    prompt?: string;
    role: string;
    level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
    techstack: string[];
    skills: string[];
    amount: number;
    platform: string;
    userId: string;
    temperature?: number;
}

export interface Question {
    id: string;
    question: string;
    difficulty: string;
    category: string;
    expectedAnswer?: string;
    followUpQuestions?: string[];
}

export interface InterviewResponse {
    success: boolean;
    questions?: Question[];
    error?: string;
    metadata?: {
        role: string;
        level: string;
        techstack: string[];
        generatedAt: string;
    };
}

export interface WorkflowTriggerRequest {
    assistantId: string;
    workflowType: 'interview' | 'assessment' | 'feedback';
    parameters: Record<string, any>;
}

export interface WorkflowResponse {
    success: boolean;
    workflowId?: string;
    status?: string;
    data?: any;
    error?: string;
}


