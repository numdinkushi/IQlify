import { InterviewRequest } from '../types';
import { INTERVIEW_CONFIG } from '../config';

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class Validators {
    static validateInterviewRequest(request: Partial<InterviewRequest>): InterviewRequest {
        const errors: string[] = [];

        if (!request.role || request.role.trim().length === 0) {
            errors.push('Role is required');
        }

        if (!request.level) {
            errors.push('Level is required');
        } else if (!INTERVIEW_CONFIG.supportedLevels.includes(request.level as any)) {
            errors.push(`Level must be one of: ${INTERVIEW_CONFIG.supportedLevels.join(', ')}`);
        }

        if (!request.techstack || !Array.isArray(request.techstack) || request.techstack.length === 0) {
            errors.push('Techstack must be a non-empty array');
        }

        if (!request.skills || !Array.isArray(request.skills) || request.skills.length === 0) {
            errors.push('Skills must be a non-empty array');
        }

        if (request.amount !== undefined) {
            if (typeof request.amount !== 'number' || request.amount < INTERVIEW_CONFIG.minAmount || request.amount > INTERVIEW_CONFIG.maxAmount) {
                errors.push(`Amount must be between ${INTERVIEW_CONFIG.minAmount} and ${INTERVIEW_CONFIG.maxAmount}`);
            }
        }

        if (!request.platform || request.platform.trim().length === 0) {
            errors.push('Platform is required');
        }

        if (!request.userId || request.userId.trim().length === 0) {
            errors.push('UserId is required');
        }

        if (errors.length > 0) {
            throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
        }

        return {
            role: request.role!,
            level: request.level!,
            techstack: request.techstack!,
            skills: request.skills!,
            amount: request.amount || INTERVIEW_CONFIG.defaultAmount,
            platform: request.platform!,
            userId: request.userId!,
            prompt: request.prompt || '',
            temperature: request.temperature || 0.7,
        };
    }

    static validateWebhookSignature(signature: string, payload: string, secret: string): boolean {
        // Implement HMAC signature validation if VAPI provides it
        // For now, we'll do a basic check
        return signature === secret;
    }

    static sanitizeInput(input: string): string {
        return input.trim().replace(/[<>]/g, '');
    }
}

import { INTERVIEW_CONFIG } from '../config';

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class Validators {
    static validateInterviewRequest(request: Partial<InterviewRequest>): InterviewRequest {
        const errors: string[] = [];

        if (!request.role || request.role.trim().length === 0) {
            errors.push('Role is required');
        }

        if (!request.level) {
            errors.push('Level is required');
        } else if (!INTERVIEW_CONFIG.supportedLevels.includes(request.level as any)) {
            errors.push(`Level must be one of: ${INTERVIEW_CONFIG.supportedLevels.join(', ')}`);
        }

        if (!request.techstack || !Array.isArray(request.techstack) || request.techstack.length === 0) {
            errors.push('Techstack must be a non-empty array');
        }

        if (!request.skills || !Array.isArray(request.skills) || request.skills.length === 0) {
            errors.push('Skills must be a non-empty array');
        }

        if (request.amount !== undefined) {
            if (typeof request.amount !== 'number' || request.amount < INTERVIEW_CONFIG.minAmount || request.amount > INTERVIEW_CONFIG.maxAmount) {
                errors.push(`Amount must be between ${INTERVIEW_CONFIG.minAmount} and ${INTERVIEW_CONFIG.maxAmount}`);
            }
        }

        if (!request.platform || request.platform.trim().length === 0) {
            errors.push('Platform is required');
        }

        if (!request.userId || request.userId.trim().length === 0) {
            errors.push('UserId is required');
        }

        if (errors.length > 0) {
            throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
        }

        return {
            role: request.role!,
            level: request.level!,
            techstack: request.techstack!,
            skills: request.skills!,
            amount: request.amount || INTERVIEW_CONFIG.defaultAmount,
            platform: request.platform!,
            userId: request.userId!,
            prompt: request.prompt || '',
            temperature: request.temperature || 0.7,
        };
    }

    static validateWebhookSignature(signature: string, payload: string, secret: string): boolean {
        // Implement HMAC signature validation if VAPI provides it
        // For now, we'll do a basic check
        return signature === secret;
    }

    static sanitizeInput(input: string): string {
        return input.trim().replace(/[<>]/g, '');
    }
}



