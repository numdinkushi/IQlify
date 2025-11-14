# 🚀 Human-Readable Workflow Configuration

This system allows you to define VAPI workflows in a human-readable format. Simply edit the configuration files and the system automatically handles the VAPI integration.

## 📁 File Structure

```
workflows/
├── index.ts              # Main workflow definitions
├── examples/
│   └── custom-workflow.ts # Examples of custom workflows
└── README.md             # This file
```

## 🎯 How It Works

1. **Define your workflow** in human-readable configuration
2. **Add it to the registry** 
3. **Trigger it** via the API
4. **System automatically** handles VAPI integration

## 📝 Quick Start

### 1. Edit Existing Workflows

Open `/workflows/index.ts` and modify the workflow configurations:

```typescript
export const INTERVIEW_WORKFLOW: WorkflowConfig = {
    name: "Technical Interview",
    description: "Your custom description here",
    type: "interview",
    
    systemPrompt: `Your custom system prompt here.
    
    This tells the AI how to behave during the interview.`,
    
    firstMessage: `Your custom greeting message here.
    
    This is what the assistant says when the call starts.`,
    
    functions: [
        {
            name: "your_custom_function",
            description: "What this function does",
            parameters: [
                {
                    name: "param1",
                    type: "string",
                    description: "What this parameter is for",
                    required: true,
                    enum: ["option1", "option2"] // Optional: restrict to specific values
                }
            ]
        }
    ]
};
```

### 2. Add New Workflows

Create a new workflow configuration and add it to the registry:

```typescript
// In index.ts, add your workflow
export const MY_CUSTOM_WORKFLOW: WorkflowConfig = {
    name: "My Custom Workflow",
    description: "Does something awesome",
    type: "interview", // Use existing type or extend the system
    systemPrompt: "Your system prompt...",
    firstMessage: "Your first message...",
    functions: [
        // Your function definitions
    ]
};

// Add to registry
export const WORKFLOW_REGISTRY = {
    interview: INTERVIEW_WORKFLOW,
    assessment: ASSESSMENT_WORKFLOW,
    feedback: FEEDBACK_WORKFLOW,
    myCustom: MY_CUSTOM_WORKFLOW, // <-- Add your workflow here
} as const;
```

### 3. Trigger the Workflow

```bash
curl -X POST http://localhost:3000/vapi/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "your-assistant-id",
    "workflowType": "myCustom",
    "parameters": {}
  }'
```

## 🔧 Configuration Options

### WorkflowConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Display name of the workflow |
| `description` | string | Description of what the workflow does |
| `type` | string | Workflow type (interview, assessment, feedback) |
| `systemPrompt` | string | AI behavior instructions |
| `firstMessage` | string | Initial message when call starts |
| `functions` | FunctionConfig[] | Array of available functions |

### FunctionConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Function name (must match webhook handler) |
| `description` | string | What the function does |
| `parameters` | ParameterConfig[] | Function parameters |
| `endpoint` | string | Optional: custom endpoint URL |

### ParameterConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Parameter name |
| `type` | string | Data type (string, number, array, boolean, object) |
| `description` | string | What this parameter is for |
| `required` | boolean | Whether parameter is required |
| `enum` | string[] | Optional: allowed values |
| `defaultValue` | any | Optional: default value |

## 📚 Examples

### Example 1: Customer Support Workflow

```typescript
export const CUSTOMER_SUPPORT_WORKFLOW: WorkflowConfig = {
    name: "Customer Support",
    description: "Helps customers with common issues",
    type: "interview",
    
    systemPrompt: `You are a helpful customer support agent. 
    Be friendly, patient, and solution-oriented.`,
    
    firstMessage: `Hello! How can I help you today?`,
    
    functions: [
        {
            name: "search_knowledge_base",
            description: "Searches for solutions in our knowledge base",
            parameters: [
                {
                    name: "query",
                    type: "string",
                    description: "Customer's question or issue",
                    required: true
                }
            ]
        }
    ]
};
```

### Example 2: Sales Qualification Workflow

```typescript
export const SALES_WORKFLOW: WorkflowConfig = {
    name: "Sales Qualification",
    description: "Qualifies leads and gathers requirements",
    type: "interview",
    
    systemPrompt: `You are a sales specialist. 
    Ask qualifying questions to understand customer needs.`,
    
    firstMessage: `Hi! I'd love to learn about your company's needs.`,
    
    functions: [
        {
            name: "qualify_lead",
            description: "Gathers company and requirement information",
            parameters: [
                {
                    name: "company_size",
                    type: "string",
                    description: "Size of the company",
                    required: true,
                    enum: ["startup", "small", "medium", "enterprise"]
                }
            ]
        }
    ]
};
```

## 🔄 What Happens When You Trigger a Workflow

1. **System reads** your workflow configuration
2. **Creates function definitions** from your config
3. **Updates assistant** with new tools and system prompt
4. **Sets first message** to your custom greeting
5. **Returns confirmation** with workflow details

## 🎨 Customization Tips

### System Prompts
- Be specific about the AI's role and behavior
- Include step-by-step instructions
- Mention how to use the available functions
- Set the tone (professional, friendly, etc.)

### First Messages
- Make them welcoming and clear
- Ask for the information you need
- Set expectations for the conversation
- Keep them concise but informative

### Function Parameters
- Use descriptive names and descriptions
- Set appropriate data types
- Use `enum` for restricted choices
- Make parameters `required: false` when optional

## 🐛 Troubleshooting

### Workflow Not Found
```
Error: Workflow type 'myCustom' not found in registry
```
**Solution**: Make sure you added your workflow to `WORKFLOW_REGISTRY`

### Function Not Working
```
Error: Unknown function: my_function
```
**Solution**: Make sure you have a corresponding handler in `/vapi/webhook/route.ts`

### Parameter Validation Errors
```
Error: Invalid parameter type
```
**Solution**: Check that your parameter types match the schema (string, number, array, etc.)

## 🚀 Advanced Usage

### Dynamic Workflows
You can create workflows that change based on parameters:

```typescript
export function createDynamicWorkflow(baseType: string, options: any): WorkflowConfig {
    const workflow = { /* base config */ };
    
    if (options.includeFeedback) {
        workflow.functions.push({
            name: "provide_feedback",
            // ... feedback function config
        });
    }
    
    return workflow;
}
```

### Custom Endpoints
You can specify custom endpoints for specific functions:

```typescript
{
    name: "custom_function",
    description: "Uses a custom endpoint",
    endpoint: "https://my-custom-api.com/endpoint",
    parameters: [/* ... */]
}
```

## 📞 Support

If you need help creating custom workflows:
1. Check the examples in `/examples/custom-workflow.ts`
2. Look at existing workflows in `index.ts`
3. Test with simple configurations first
4. Use the webhook logs to debug function calls

Happy workflow building! 🎉
