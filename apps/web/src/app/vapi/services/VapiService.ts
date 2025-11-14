import { VAPI_CONFIG } from '../config';
import {
    VapiAssistant,
    VapiTool,
    VapiCallRequest,
    WorkflowTriggerRequest,
    WorkflowResponse,
} from '../types';

/**
 * Service class for interacting with VAPI API
 * Follows Single Responsibility Principle - handles only VAPI API operations
 */
export class VapiService {
    private baseUrl: string;
    private apiKey: string;

    constructor(apiKey?: string, baseUrl?: string) {
        this.apiKey = apiKey || VAPI_CONFIG.apiKey;
        this.baseUrl = baseUrl || VAPI_CONFIG.baseUrl;

        // Only throw error on server side or when explicitly providing an empty API key
        if (!this.apiKey && (typeof window === 'undefined' || apiKey !== undefined)) {
            throw new Error('VAPI API key is required');
        }
    }

    /**
     * Gets headers for VAPI API requests
     */
    private getHeaders(): HeadersInit {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * Handles API errors consistently
     */
    private async handleApiError(response: Response): Promise<never> {
        const errorText = await response.text();
        let errorMessage = `VAPI API Error: ${response.status} ${response.statusText}`;

        console.error('🚨 [VAPI-SERVICE] API Error Details:');
        console.error('🚨 [VAPI-SERVICE] Status:', response.status);
        console.error('🚨 [VAPI-SERVICE] Status Text:', response.statusText);
        console.error('🚨 [VAPI-SERVICE] Response Body:', errorText);

        try {
            const errorJson = JSON.parse(errorText);
            console.error('🚨 [VAPI-SERVICE] Parsed Error JSON:', errorJson);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            console.error('🚨 [VAPI-SERVICE] Could not parse error as JSON, using raw text');
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    /**
     * Gets the appropriate base URL for webhooks
     * Prioritizes external URLs over localhost for webhook functionality
     */
    private getWebhookBaseUrl(): string {
        // Check for explicit webhook URL first
        const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
        if (webhookUrl) {
            return webhookUrl;
        }

        // Check for app URL (could be tunnel service or production)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (appUrl && !appUrl.includes('localhost')) {
            return appUrl;
        }

        // For localhost, warn about webhook limitations
        if (appUrl?.includes('localhost') || !appUrl) {
            console.warn('⚠️  Webhook Warning: Using localhost URL. Webhooks will not work with VAPI unless you use a tunneling service or deploy to production.');
            console.warn('   Set NEXT_PUBLIC_WEBHOOK_URL to your external URL (tunnel service or production) for webhook functionality.');
        }

        return appUrl || 'http://localhost:3000';
    }

    /**
     * Fetches an assistant by ID
     */
    async getAssistant(assistantId: string): Promise<VapiAssistant> {
        try {
            const response = await fetch(`${this.baseUrl}/assistant/${assistantId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                await this.handleApiError(response);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching assistant:', error);
            throw error;
        }
    }

    /**
     * Updates an assistant with new configuration
     */
    async updateAssistant(
        assistantId: string,
        updates: Partial<VapiAssistant>
    ): Promise<VapiAssistant> {
        try {
            const response = await fetch(`${this.baseUrl}/assistant/${assistantId}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                await this.handleApiError(response);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating assistant:', error);
            throw error;
        }
    }

    /**
     * Adds tools to an assistant
     */
    async addToolsToAssistant(assistantId: string, tools: VapiTool[]): Promise<VapiAssistant> {
        try {
            const assistant = await this.getAssistant(assistantId);
            const existingTools = assistant.model.tools || [];

            const updatedAssistant = await this.updateAssistant(assistantId, {
                model: {
                    ...assistant.model,
                    tools: [...existingTools, ...tools],
                },
            });

            return updatedAssistant;
        } catch (error) {
            console.error('Error adding tools to assistant:', error);
            throw error;
        }
    }

    /**
     * Creates a new call with the assistant
     */
    async createCall(callRequest: VapiCallRequest): Promise<any> {
        try {
            console.log('🌐 [VAPI-SERVICE] Creating call with request:', JSON.stringify(callRequest, null, 2));
            console.log('🌐 [VAPI-SERVICE] Using base URL:', this.baseUrl);
            console.log('🌐 [VAPI-SERVICE] Using headers:', this.getHeaders());

            const response = await fetch(`${this.baseUrl}/call`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(callRequest),
            });

            console.log('🌐 [VAPI-SERVICE] Response status:', response.status);
            console.log('🌐 [VAPI-SERVICE] Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                console.error('❌ [VAPI-SERVICE] API call failed with status:', response.status);
                await this.handleApiError(response);
            }

            const result = await response.json();
            console.log('✅ [VAPI-SERVICE] Call created successfully:', JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            console.error('❌ [VAPI-SERVICE] Error creating call:', error);
            throw error;
        }
    }

    /**
     * Fetches call details including transcript from VAPI API
     */
    async getCall(callId: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/call/${callId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                await this.handleApiError(response);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching call:', error);
            throw error;
        }
    }

    /**
     * Fetches call recording from VAPI API
     */
    async getCallRecording(callId: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/call/${callId}/recording`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                await this.handleApiError(response);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching call recording:', error);
            throw error;
        }
    }

    /**
     * Fetches all calls from VAPI API
     */
    async getAllCalls(limit: number = 10): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/call?limit=${limit}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                await this.handleApiError(response);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching all calls:', error);
            throw error;
        }
    }

    /**
     * Triggers a workflow for the assistant
     */
    async triggerWorkflow(request: WorkflowTriggerRequest): Promise<WorkflowResponse> {
        try {
            const { assistantId, workflowType, parameters } = request;

            // Create tools for the workflow
            const tools = this.createWorkflowTools(workflowType, parameters);

            // Update assistant with workflow tools
            await this.addToolsToAssistant(assistantId, tools);

            // Create an actual VAPI call for web-based interviews
            const callRequest: any = {
                assistantId: assistantId,
                // For web calls, we don't specify customer phone number
                // The client-side SDK will handle the connection
                maxDurationSeconds: (parameters.duration || 10) * 60, // Convert minutes to seconds
                customerJoinTimeoutSeconds: 60, // Give user 60 seconds to join
                metadata: {
                    interviewId: parameters.interviewId,
                    interviewType: parameters.interviewType,
                    skillLevel: parameters.skillLevel,
                    userId: parameters.userId,
                    callType: 'web'
                }
            };

            const callResult = await this.createCall(callRequest);

            return {
                success: true,
                workflowId: callResult.id || `workflow_${Date.now()}`,
                status: 'active',
                data: { tools, callResult },
            };
        } catch (error) {
            console.error('Error triggering workflow:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    /**
     * Creates workflow tools based on workflow type
     */
    private createWorkflowTools(workflowType: string, parameters: Record<string, any>): VapiTool[] {
        // Use environment URL or external URL for webhooks
        const baseUrl = this.getWebhookBaseUrl();

        switch (workflowType) {
            case 'interview':
                return [
                    {
                        type: 'function',
                        function: {
                            name: 'generate_interview_questions',
                            description: 'Generates interview questions based on role and requirements',
                            parameters: {
                                type: 'object',
                                properties: {
                                    role: { type: 'string', description: 'Job role/position' },
                                    level: {
                                        type: 'string',
                                        description: 'Experience level',
                                        enum: ['junior', 'mid', 'senior', 'lead', 'principal']
                                    },
                                    techstack: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'Technologies and frameworks'
                                    },
                                    amount: { type: 'number', description: 'Number of questions' },
                                },
                                required: ['role', 'level', 'techstack'],
                            },
                        },
                    },
                    {
                        type: 'function',
                        function: {
                            name: 'evaluate_answer',
                            description: 'Evaluates a candidates answer to an interview question',
                            parameters: {
                                type: 'object',
                                properties: {
                                    question: { type: 'string' },
                                    answer: { type: 'string' },
                                    expectedAnswer: { type: 'string' },
                                },
                                required: ['question', 'answer'],
                            },
                        },
                    },
                ];

            case 'assessment':
                return [
                    {
                        type: 'function',
                        function: {
                            name: 'create_assessment',
                            description: 'Creates a skills assessment for the candidate',
                            parameters: {
                                type: 'object',
                                properties: {
                                    skills: { type: 'array', items: { type: 'string' } },
                                    difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
                                },
                                required: ['skills'],
                            },
                        },
                    },
                ];

            case 'feedback':
                return [
                    {
                        type: 'function',
                        function: {
                            name: 'generate_feedback',
                            description: 'Generates feedback based on interview performance',
                            parameters: {
                                type: 'object',
                                properties: {
                                    interviewId: { type: 'string' },
                                    scores: { type: 'object' },
                                },
                                required: ['interviewId'],
                            },
                        },
                    },
                ];

            default:
                return [];
        }
    }

    /**
     * Sets up server URL for webhook handling
     */
    async setupWebhook(assistantId: string, webhookUrl: string, secret?: string): Promise<VapiAssistant> {
        try {
            return await this.updateAssistant(assistantId, {
                serverUrl: webhookUrl,
                serverUrlSecret: secret || VAPI_CONFIG.webhookSecret,
            });
        } catch (error) {
            console.error('Error setting up webhook:', error);
            throw error;
        }
    }
}

