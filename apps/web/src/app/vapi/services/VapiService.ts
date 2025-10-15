import { VAPI_CONFIG } from '../config';
import {
    VapiAssistant,
    VapiTool,
    VapiCallRequest,
    WorkflowTriggerRequest,
    WorkflowResponse,
} from '../types';
import { WORKFLOW_REGISTRY, WorkflowConfig, FunctionConfig } from '../workflows';

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

        if (!this.apiKey) {
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

        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
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
            const response = await fetch(`${this.baseUrl}/call`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(callRequest),
            });

            if (!response.ok) {
                await this.handleApiError(response);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating call:', error);
            throw error;
        }
    }

    /**
     * Triggers a workflow for the assistant using readable workflow definitions
     */
    async triggerWorkflow(request: WorkflowTriggerRequest): Promise<WorkflowResponse> {
        try {
            const { assistantId, workflowType, parameters } = request;

            // Get workflow configuration from registry
            const workflowConfig = WORKFLOW_REGISTRY[workflowType];
            if (!workflowConfig) {
                return {
                    success: false,
                    error: `Workflow type '${workflowType}' not found in registry`,
                };
            }

            // Create tools from workflow configuration
            const tools = this.createToolsFromConfig(workflowConfig);

            // Update assistant with workflow tools and configuration
            await this.addToolsToAssistant(assistantId, tools);

            // Update assistant with workflow-specific system prompt and first message
            await this.updateAssistantConfig(assistantId, workflowConfig);

            return {
                success: true,
                workflowId: `workflow_${Date.now()}`,
                status: 'active',
                data: {
                    tools,
                    workflow: workflowConfig.name,
                    description: workflowConfig.description
                },
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
     * Creates tools from workflow configuration
     */
    private createToolsFromConfig(workflowConfig: WorkflowConfig): VapiTool[] {
        return workflowConfig.functions.map((funcConfig: FunctionConfig) => ({
            type: 'function',
            function: {
                name: funcConfig.name,
                description: funcConfig.description,
                parameters: this.buildParametersSchema(funcConfig.parameters),
            },
        }));
    }

    /**
     * Builds parameter schema from function configuration
     */
    private buildParametersSchema(parameters: any[]): any {
        const properties: Record<string, any> = {};
        const required: string[] = [];

        parameters.forEach(param => {
            properties[param.name] = {
                type: param.type,
                description: param.description,
            };

            if (param.enum) {
                properties[param.name].enum = param.enum;
            }

            if (param.required) {
                required.push(param.name);
            }
        });

        return {
            type: 'object',
            properties,
            required,
        };
    }

    /**
     * Updates assistant configuration with workflow-specific settings
     */
    private async updateAssistantConfig(assistantId: string, workflowConfig: WorkflowConfig): Promise<void> {
        const updates = {
            model: {
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: workflowConfig.systemPrompt,
                    },
                ],
                provider: 'openai',
            },
            firstMessage: workflowConfig.firstMessage,
        };

        await this.updateAssistant(assistantId, updates);
    }

    /**
     * Creates workflow tools based on workflow type (DEPRECATED - use createToolsFromConfig instead)
     */
    private createWorkflowTools(workflowType: string, parameters: Record<string, any>): VapiTool[] {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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


