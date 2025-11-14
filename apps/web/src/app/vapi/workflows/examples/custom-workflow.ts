/**
 * EXAMPLE: How to create custom workflows
 * 
 * This file shows you how to define your own workflows in a human-readable format.
 * Simply edit the configuration objects below and the system will automatically
 * handle the VAPI integration.
 */

import { WorkflowConfig, FunctionConfig, ParameterConfig } from '../index';

/**
 * EXAMPLE 1: Simple Customer Support Workflow
 * 
 * This workflow helps customer support agents handle common queries
 */
export const CUSTOMER_SUPPORT_WORKFLOW: WorkflowConfig = {
    name: "Customer Support Assistant",
    description: "Helps customer support agents handle common queries and escalate complex issues",
    type: "interview", // Using existing type for now

    systemPrompt: `You are a helpful customer support assistant for IQlify. Your role is to:

1. Greet customers warmly and ask how you can help
2. Listen to their issue or question
3. Use the available tools to find solutions or escalate if needed
4. Provide clear, helpful responses
5. Follow up to ensure the issue is resolved

Be patient, empathetic, and solution-oriented.`,

    firstMessage: `Hello! Welcome to IQlify Customer Support. I'm here to help you today. 

What can I assist you with? Please describe your question or issue, and I'll do my best to help you resolve it.`,

    functions: [
        {
            name: "search_knowledge_base",
            description: "Searches the knowledge base for relevant articles and solutions",
            parameters: [
                {
                    name: "query",
                    type: "string",
                    description: "The customer's question or issue to search for",
                    required: true
                },
                {
                    name: "category",
                    type: "string",
                    description: "Category to search in",
                    required: false,
                    enum: ["technical", "billing", "account", "general"]
                }
            ]
        },
        {
            name: "escalate_to_human",
            description: "Escalates the issue to a human support agent",
            parameters: [
                {
                    name: "issue_description",
                    type: "string",
                    description: "Description of the issue that needs human attention",
                    required: true
                },
                {
                    name: "urgency",
                    type: "string",
                    description: "Urgency level of the issue",
                    required: true,
                    enum: ["low", "medium", "high", "critical"]
                },
                {
                    name: "customer_id",
                    type: "string",
                    description: "Customer ID for tracking",
                    required: false
                }
            ]
        }
    ]
};

/**
 * EXAMPLE 2: Sales Qualification Workflow
 * 
 * This workflow helps sales teams qualify leads and understand customer needs
 */
export const SALES_QUALIFICATION_WORKFLOW: WorkflowConfig = {
    name: "Sales Qualification",
    description: "Qualifies leads and gathers information about customer needs and budget",
    type: "interview",

    systemPrompt: `You are a professional sales qualification specialist for IQlify. Your role is to:

1. Greet potential customers and introduce IQlify
2. Ask qualifying questions to understand their needs
3. Use tools to gather information about their requirements
4. Provide relevant information about IQlify's solutions
5. Schedule follow-up meetings if appropriate

Be consultative, not pushy. Focus on understanding their needs first.`,

    firstMessage: `Hello! Thank you for your interest in IQlify. I'm here to help you learn more about how our platform can benefit your organization.

To better assist you, could you tell me a bit about your company and what challenges you're currently facing with learning and development?`,

    functions: [
        {
            name: "qualify_company",
            description: "Gathers information about the company and their needs",
            parameters: [
                {
                    name: "company_name",
                    type: "string",
                    description: "Name of the company",
                    required: true
                },
                {
                    name: "company_size",
                    type: "string",
                    description: "Size of the company",
                    required: true,
                    enum: ["startup", "small", "medium", "enterprise"]
                },
                {
                    name: "industry",
                    type: "string",
                    description: "Industry the company operates in",
                    required: true
                },
                {
                    name: "current_challenges",
                    type: "array",
                    description: "List of current challenges they're facing",
                    required: false,
                    defaultValue: []
                }
            ]
        },
        {
            name: "assess_budget_timeline",
            description: "Assesses budget and timeline for implementation",
            parameters: [
                {
                    name: "budget_range",
                    type: "string",
                    description: "Budget range for the solution",
                    required: true,
                    enum: ["under_10k", "10k_50k", "50k_100k", "over_100k"]
                },
                {
                    name: "timeline",
                    type: "string",
                    description: "Desired implementation timeline",
                    required: true,
                    enum: ["immediate", "1_3_months", "3_6_months", "6_months_plus"]
                },
                {
                    name: "decision_makers",
                    type: "array",
                    description: "List of decision makers involved",
                    required: false,
                    defaultValue: []
                }
            ]
        }
    ]
};

/**
 * EXAMPLE 3: How to add a new workflow type
 * 
 * To add a completely new workflow type, you would:
 * 
 * 1. Add the new type to the WorkflowConfig interface in index.ts
 * 2. Add the new workflow to the WORKFLOW_REGISTRY
 * 3. Update the VapiService to handle the new type
 * 4. Add corresponding webhook handlers if needed
 */

/**
 * EXAMPLE 4: Dynamic workflow with conditional functions
 * 
 * You can create workflows that have different functions based on parameters
 */
export function createDynamicWorkflow(baseType: string, customizations: any): WorkflowConfig {
    const baseWorkflow: WorkflowConfig = {
        name: `Custom ${baseType}`,
        description: `Customized ${baseType} workflow`,
        type: baseType as any,
        systemPrompt: "Custom system prompt",
        firstMessage: "Custom first message",
        functions: []
    };

    // Add functions based on customizations
    if (customizations.includeFeedback) {
        baseWorkflow.functions.push({
            name: "provide_feedback",
            description: "Provides detailed feedback",
            parameters: [
                {
                    name: "performance_data",
                    type: "object",
                    description: "Performance data to analyze",
                    required: true
                }
            ]
        });
    }

    return baseWorkflow;
}

/**
 * USAGE EXAMPLES:
 * 
 * 1. To use a custom workflow, add it to the WORKFLOW_REGISTRY in index.ts:
 * 
 *    export const WORKFLOW_REGISTRY = {
 *        interview: INTERVIEW_WORKFLOW,
 *        assessment: ASSESSMENT_WORKFLOW,
 *        feedback: FEEDBACK_WORKFLOW,
 *        customerSupport: CUSTOMER_SUPPORT_WORKFLOW,  // <-- Add your custom workflow
 *        salesQualification: SALES_QUALIFICATION_WORKFLOW,  // <-- Add another
 *    } as const;
 * 
 * 2. Then trigger it using the workflow endpoint:
 * 
 *    curl -X POST http://localhost:3000/vapi/workflow \
 *      -H "Content-Type: application/json" \
 *      -d '{
 *        "assistantId": "your-assistant-id",
 *        "workflowType": "customerSupport",
 *        "parameters": {}
 *      }'
 * 
 * 3. The system will automatically:
 *    - Create the appropriate function definitions
 *    - Update the assistant's system prompt
 *    - Set the first message
 *    - Configure all parameters and validation rules
 */
