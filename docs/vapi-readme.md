# VAPI Integration for IQlify

A comprehensive, modular VAPI integration for conducting AI-powered interviews. Built with **TypeScript**, following **SOLID principles**, and implementing **DRY** best practices.

## 🏗️ Architecture

The integration follows a clean, service-oriented architecture:

```
vapi/
├── types/           # TypeScript type definitions
├── services/        # Service layer (VapiService, GeminiService)
├── config/          # Configuration and constants
├── utils/           # Utility functions and validators
├── generate/        # Interview question generation endpoint
├── evaluate/        # Answer evaluation endpoint
├── assessment/      # Skills assessment endpoint
├── feedback/        # Feedback generation endpoint
├── workflow/        # Workflow management endpoint
├── assistant/       # Assistant management endpoint
└── webhook/         # Webhook handler endpoint
```

## 🚀 Features

- **Modular Design**: Each component has a single responsibility
- **Type-Safe**: Full TypeScript support with comprehensive types
- **Service Layer**: Abstracted business logic in dedicated services
- **Validation**: Input validation with detailed error messages
- **Workflow Support**: Easy integration with VAPI workflows
- **Webhook Handling**: Complete webhook implementation for VAPI events

## 📋 Prerequisites

1. **VAPI Account**: Get your API key from [VAPI Dashboard](https://dashboard.vapi.ai)
2. **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Environment Variables**: Configure your `.env.local`

## ⚙️ Configuration

Create a `.env.local` file in your project root:

```env
# VAPI Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_WEBHOOK_SECRET=your_webhook_secret_here

# Gemini Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Application URL (for webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔌 API Endpoints

### 1. Generate Interview Questions
**POST** `/api/vapi/generate`

Generate AI-powered interview questions based on job requirements.

```typescript
// Request
{
  "role": "Senior Full Stack Developer",
  "level": "senior",
  "techstack": ["React", "Node.js", "PostgreSQL"],
  "skills": ["System Design", "API Development", "Testing"],
  "amount": 5,
  "platform": "web",
  "userId": "user_123",
  "prompt": "Focus on scalability and best practices"
}

// Response
{
  "success": true,
  "questions": [
    {
      "id": "1",
      "question": "How would you design a scalable REST API...",
      "difficulty": "hard",
      "category": "system-design",
      "expectedAnswer": "Should mention...",
      "followUpQuestions": ["What about..."]
    }
  ],
  "metadata": {
    "role": "Senior Full Stack Developer",
    "level": "senior",
    "techstack": ["React", "Node.js", "PostgreSQL"],
    "generatedAt": "2025-10-15T10:30:00Z"
  }
}
```

### 2. Evaluate Answers
**POST** `/api/vapi/evaluate`

Evaluate candidate answers with AI-powered assessment.

```typescript
// Request
{
  "question": "Explain React hooks and their benefits",
  "answer": "Hooks allow you to use state in functional components...",
  "expectedAnswer": "Should cover useState, useEffect, custom hooks...",
  "context": "Senior React Developer Interview"
}

// Response
{
  "success": true,
  "evaluation": {
    "score": 8,
    "technicalAccuracy": 9,
    "clarity": 8,
    "depth": 7,
    "strengths": ["Clear explanation", "Good examples"],
    "weaknesses": ["Could mention useCallback"],
    "feedback": "Strong understanding of hooks...",
    "suggestions": ["Discuss performance optimization"]
  }
}
```

### 3. Create Assessment
**POST** `/api/vapi/assessment`

Create comprehensive skills assessments.

```typescript
// Request
{
  "skills": ["JavaScript", "TypeScript", "React"],
  "difficulty": "medium",
  "assessmentType": "technical"
}

// Response
{
  "success": true,
  "assessment": {
    "assessmentId": "assessment_12345",
    "title": "JavaScript, TypeScript, React Assessment",
    "estimatedTime": "45 minutes",
    "questions": [...]
  }
}
```

### 4. Generate Feedback
**POST** `/api/vapi/feedback`

Generate comprehensive interview feedback.

```typescript
// Request
{
  "interviewId": "int_12345",
  "candidateName": "John Doe",
  "role": "Full Stack Developer",
  "scores": {
    "technical": 8,
    "communication": 9,
    "problemSolving": 7
  },
  "answers": [...],
  "overallPerformance": "strong"
}

// Response
{
  "success": true,
  "feedback": {
    "feedbackId": "feedback_12345",
    "overallScore": 8,
    "recommendation": "hire",
    "strengths": [...],
    "areasForImprovement": [...],
    "detailedFeedback": "..."
  }
}
```

### 5. Trigger Workflow
**POST** `/api/vapi/workflow`

Connect your VAPI assistant to a workflow.

```typescript
// Request
{
  "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
  "workflowType": "interview",
  "parameters": {
    "role": "Full Stack Developer",
    "level": "senior"
  }
}

// Response
{
  "success": true,
  "workflowId": "workflow_12345",
  "status": "active",
  "data": {
    "tools": [...]
  }
}
```

### 6. Webhook Handler
**POST** `/api/vapi/webhook`

Handles VAPI webhook events (function calls, conversation updates, etc.).

## 🔧 Service Classes

### VapiService
Handles all VAPI API interactions:
- `getAssistant(id)` - Fetch assistant details
- `updateAssistant(id, updates)` - Update assistant configuration
- `addToolsToAssistant(id, tools)` - Add workflow tools
- `triggerWorkflow(request)` - Set up workflow for assistant
- `setupWebhook(id, url)` - Configure webhook URL

### GeminiService
Handles AI generation:
- `generateInterviewQuestions(request)` - Generate questions
- `generateConversationalResponse(context, message)` - Generate responses

## 📝 Usage Examples

### Connecting Your Assistant to a Workflow

```typescript
import { VapiService } from './services/VapiService';

// Initialize service
const vapiService = new VapiService();

// Trigger interview workflow
const result = await vapiService.triggerWorkflow({
  assistantId: "your-assistant-id",
  workflowType: "interview",
  parameters: {
    role: "Software Engineer",
    level: "mid"
  }
});

console.log('Workflow active:', result.success);
```

### Setting Up Webhook

```typescript
// Setup webhook for your assistant
const assistant = await vapiService.setupWebhook(
  "your-assistant-id",
  "https://your-domain.com/api/vapi/webhook",
  "your-webhook-secret"
);

console.log('Webhook configured:', assistant.serverUrl);
```

### Programmatic Question Generation

```typescript
import { GeminiService } from './services/GeminiService';

const geminiService = new GeminiService();

const response = await geminiService.generateInterviewQuestions({
  role: "Backend Developer",
  level: "senior",
  techstack: ["Node.js", "PostgreSQL", "Redis"],
  skills: ["API Design", "Database Optimization"],
  amount: 5,
  platform: "backend",
  userId: "user_123"
});

console.log('Generated questions:', response.questions);
```

## 🔗 Linking Assistant to Workflow (The Main Use Case)

There are **three ways** to link your VAPI assistant to a workflow:

### Method 1: Using the Workflow API (Recommended)

This is the easiest way and adds tools directly to your assistant:

```bash
curl -X POST https://your-domain.com/api/vapi/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "workflowType": "interview",
    "parameters": {}
  }'
```

This will:
1. Fetch your assistant from VAPI
2. Add workflow-specific tools (functions) to it
3. Configure the tools to call your endpoints

### Method 2: Using Server URL (Webhook)

Configure your assistant to use a webhook for all interactions:

```bash
curl -X POST https://your-domain.com/api/vapi/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "webhookUrl": "https://your-domain.com/api/vapi/webhook",
    "webhookSecret": "your-secret"
  }'
```

### Method 3: Assistant Overrides (Runtime)

When creating a call, override the assistant with workflow tools:

```typescript
const vapiService = new VapiService();

await vapiService.createCall({
  assistantId: "0b058f17-55aa-4636-ad06-445287514862",
  assistantOverrides: {
    model: {
      tools: [
        // Your workflow tools
      ]
    }
  }
});
```

## 🎯 Best Practices

1. **Environment Variables**: Never hardcode API keys
2. **Error Handling**: All services include comprehensive error handling
3. **Validation**: Always validate input before processing
4. **Type Safety**: Use TypeScript types for all API interactions
5. **Logging**: Services log errors for debugging
6. **Modular**: Import only what you need

## 🐛 Troubleshooting

### Webhook not receiving events
- Ensure your webhook URL is publicly accessible
- Check that `NEXT_PUBLIC_APP_URL` is set correctly
- Verify webhook secret matches in both places

### API Key errors
- Verify `.env.local` is in the correct location
- Restart your dev server after adding environment variables
- Check API keys are valid and active

### Type errors
- Ensure you're using the types from `./types`
- Check that request bodies match the expected interface

## 📚 Additional Resources

- [VAPI Documentation](https://docs.vapi.ai)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🤝 Contributing

This integration follows SOLID principles:
- **S**ingle Responsibility: Each service/endpoint has one job
- **O**pen/Closed: Extend functionality without modifying existing code
- **L**iskov Substitution: Services can be swapped with compatible implementations
- **I**nterface Segregation: Clean, focused interfaces
- **D**ependency Inversion: Depend on abstractions, not concretions

When adding features, maintain this structure!

## 📄 License

Part of the IQlify project.


A comprehensive, modular VAPI integration for conducting AI-powered interviews. Built with **TypeScript**, following **SOLID principles**, and implementing **DRY** best practices.

## 🏗️ Architecture

The integration follows a clean, service-oriented architecture:

```
vapi/
├── types/           # TypeScript type definitions
├── services/        # Service layer (VapiService, GeminiService)
├── config/          # Configuration and constants
├── utils/           # Utility functions and validators
├── generate/        # Interview question generation endpoint
├── evaluate/        # Answer evaluation endpoint
├── assessment/      # Skills assessment endpoint
├── feedback/        # Feedback generation endpoint
├── workflow/        # Workflow management endpoint
├── assistant/       # Assistant management endpoint
└── webhook/         # Webhook handler endpoint
```

## 🚀 Features

- **Modular Design**: Each component has a single responsibility
- **Type-Safe**: Full TypeScript support with comprehensive types
- **Service Layer**: Abstracted business logic in dedicated services
- **Validation**: Input validation with detailed error messages
- **Workflow Support**: Easy integration with VAPI workflows
- **Webhook Handling**: Complete webhook implementation for VAPI events

## 📋 Prerequisites

1. **VAPI Account**: Get your API key from [VAPI Dashboard](https://dashboard.vapi.ai)
2. **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Environment Variables**: Configure your `.env.local`

## ⚙️ Configuration

Create a `.env.local` file in your project root:

```env
# VAPI Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_WEBHOOK_SECRET=your_webhook_secret_here

# Gemini Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Application URL (for webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔌 API Endpoints

### 1. Generate Interview Questions
**POST** `/api/vapi/generate`

Generate AI-powered interview questions based on job requirements.

```typescript
// Request
{
  "role": "Senior Full Stack Developer",
  "level": "senior",
  "techstack": ["React", "Node.js", "PostgreSQL"],
  "skills": ["System Design", "API Development", "Testing"],
  "amount": 5,
  "platform": "web",
  "userId": "user_123",
  "prompt": "Focus on scalability and best practices"
}

// Response
{
  "success": true,
  "questions": [
    {
      "id": "1",
      "question": "How would you design a scalable REST API...",
      "difficulty": "hard",
      "category": "system-design",
      "expectedAnswer": "Should mention...",
      "followUpQuestions": ["What about..."]
    }
  ],
  "metadata": {
    "role": "Senior Full Stack Developer",
    "level": "senior",
    "techstack": ["React", "Node.js", "PostgreSQL"],
    "generatedAt": "2025-10-15T10:30:00Z"
  }
}
```

### 2. Evaluate Answers
**POST** `/api/vapi/evaluate`

Evaluate candidate answers with AI-powered assessment.

```typescript
// Request
{
  "question": "Explain React hooks and their benefits",
  "answer": "Hooks allow you to use state in functional components...",
  "expectedAnswer": "Should cover useState, useEffect, custom hooks...",
  "context": "Senior React Developer Interview"
}

// Response
{
  "success": true,
  "evaluation": {
    "score": 8,
    "technicalAccuracy": 9,
    "clarity": 8,
    "depth": 7,
    "strengths": ["Clear explanation", "Good examples"],
    "weaknesses": ["Could mention useCallback"],
    "feedback": "Strong understanding of hooks...",
    "suggestions": ["Discuss performance optimization"]
  }
}
```

### 3. Create Assessment
**POST** `/api/vapi/assessment`

Create comprehensive skills assessments.

```typescript
// Request
{
  "skills": ["JavaScript", "TypeScript", "React"],
  "difficulty": "medium",
  "assessmentType": "technical"
}

// Response
{
  "success": true,
  "assessment": {
    "assessmentId": "assessment_12345",
    "title": "JavaScript, TypeScript, React Assessment",
    "estimatedTime": "45 minutes",
    "questions": [...]
  }
}
```

### 4. Generate Feedback
**POST** `/api/vapi/feedback`

Generate comprehensive interview feedback.

```typescript
// Request
{
  "interviewId": "int_12345",
  "candidateName": "John Doe",
  "role": "Full Stack Developer",
  "scores": {
    "technical": 8,
    "communication": 9,
    "problemSolving": 7
  },
  "answers": [...],
  "overallPerformance": "strong"
}

// Response
{
  "success": true,
  "feedback": {
    "feedbackId": "feedback_12345",
    "overallScore": 8,
    "recommendation": "hire",
    "strengths": [...],
    "areasForImprovement": [...],
    "detailedFeedback": "..."
  }
}
```

### 5. Trigger Workflow
**POST** `/api/vapi/workflow`

Connect your VAPI assistant to a workflow.

```typescript
// Request
{
  "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
  "workflowType": "interview",
  "parameters": {
    "role": "Full Stack Developer",
    "level": "senior"
  }
}

// Response
{
  "success": true,
  "workflowId": "workflow_12345",
  "status": "active",
  "data": {
    "tools": [...]
  }
}
```

### 6. Webhook Handler
**POST** `/api/vapi/webhook`

Handles VAPI webhook events (function calls, conversation updates, etc.).

## 🔧 Service Classes

### VapiService
Handles all VAPI API interactions:
- `getAssistant(id)` - Fetch assistant details
- `updateAssistant(id, updates)` - Update assistant configuration
- `addToolsToAssistant(id, tools)` - Add workflow tools
- `triggerWorkflow(request)` - Set up workflow for assistant
- `setupWebhook(id, url)` - Configure webhook URL

### GeminiService
Handles AI generation:
- `generateInterviewQuestions(request)` - Generate questions
- `generateConversationalResponse(context, message)` - Generate responses

## 📝 Usage Examples

### Connecting Your Assistant to a Workflow

```typescript
import { VapiService } from './services/VapiService';

// Initialize service
const vapiService = new VapiService();

// Trigger interview workflow
const result = await vapiService.triggerWorkflow({
  assistantId: "your-assistant-id",
  workflowType: "interview",
  parameters: {
    role: "Software Engineer",
    level: "mid"
  }
});

console.log('Workflow active:', result.success);
```

### Setting Up Webhook

```typescript
// Setup webhook for your assistant
const assistant = await vapiService.setupWebhook(
  "your-assistant-id",
  "https://your-domain.com/api/vapi/webhook",
  "your-webhook-secret"
);

console.log('Webhook configured:', assistant.serverUrl);
```

### Programmatic Question Generation

```typescript
import { GeminiService } from './services/GeminiService';

const geminiService = new GeminiService();

const response = await geminiService.generateInterviewQuestions({
  role: "Backend Developer",
  level: "senior",
  techstack: ["Node.js", "PostgreSQL", "Redis"],
  skills: ["API Design", "Database Optimization"],
  amount: 5,
  platform: "backend",
  userId: "user_123"
});

console.log('Generated questions:', response.questions);
```

## 🔗 Linking Assistant to Workflow (The Main Use Case)

There are **three ways** to link your VAPI assistant to a workflow:

### Method 1: Using the Workflow API (Recommended)

This is the easiest way and adds tools directly to your assistant:

```bash
curl -X POST https://your-domain.com/api/vapi/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "workflowType": "interview",
    "parameters": {}
  }'
```

This will:
1. Fetch your assistant from VAPI
2. Add workflow-specific tools (functions) to it
3. Configure the tools to call your endpoints

### Method 2: Using Server URL (Webhook)

Configure your assistant to use a webhook for all interactions:

```bash
curl -X POST https://your-domain.com/api/vapi/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "webhookUrl": "https://your-domain.com/api/vapi/webhook",
    "webhookSecret": "your-secret"
  }'
```

### Method 3: Assistant Overrides (Runtime)

When creating a call, override the assistant with workflow tools:

```typescript
const vapiService = new VapiService();

await vapiService.createCall({
  assistantId: "0b058f17-55aa-4636-ad06-445287514862",
  assistantOverrides: {
    model: {
      tools: [
        // Your workflow tools
      ]
    }
  }
});
```

## 🎯 Best Practices

1. **Environment Variables**: Never hardcode API keys
2. **Error Handling**: All services include comprehensive error handling
3. **Validation**: Always validate input before processing
4. **Type Safety**: Use TypeScript types for all API interactions
5. **Logging**: Services log errors for debugging
6. **Modular**: Import only what you need

## 🐛 Troubleshooting

### Webhook not receiving events
- Ensure your webhook URL is publicly accessible
- Check that `NEXT_PUBLIC_APP_URL` is set correctly
- Verify webhook secret matches in both places

### API Key errors
- Verify `.env.local` is in the correct location
- Restart your dev server after adding environment variables
- Check API keys are valid and active

### Type errors
- Ensure you're using the types from `./types`
- Check that request bodies match the expected interface

## 📚 Additional Resources

- [VAPI Documentation](https://docs.vapi.ai)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🤝 Contributing

This integration follows SOLID principles:
- **S**ingle Responsibility: Each service/endpoint has one job
- **O**pen/Closed: Extend functionality without modifying existing code
- **L**iskov Substitution: Services can be swapped with compatible implementations
- **I**nterface Segregation: Clean, focused interfaces
- **D**ependency Inversion: Depend on abstractions, not concretions

When adding features, maintain this structure!

## 📄 License

Part of the IQlify project.



