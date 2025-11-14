# 🚀 Quick Start - Link Your VAPI Assistant to Workflow

## Your Assistant ID
```
0b058f17-55aa-4636-ad06-445287514862
```

## ⚡ Fastest Way to Get Started

### Step 1: Set Environment Variables

Create `.env.local` in your project root:

```bash
# Required
VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Start Your Server

```bash
npm run dev
```

### Step 3: Link Assistant to Workflow

Run this command in your terminal:

```bash
curl -X POST http://localhost:3000/vapi/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "workflowType": "interview",
    "parameters": {}
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "workflowId": "workflow_xxxxx",
  "status": "active",
  "data": {
    "tools": [...]
  }
}
```

### Step 4: Test It

Go to your VAPI dashboard and test your assistant. It now has these new capabilities:

1. **generate_interview_questions** - Creates interview questions
2. **evaluate_answer** - Evaluates candidate answers
3. **create_assessment** - Creates skills assessments
4. **generate_feedback** - Generates interview feedback

## ✅ That's It!

Your assistant is now connected to the workflow and ready to conduct interviews.

## 📝 What Just Happened?

The `/vapi/workflow` endpoint:
1. Connected to VAPI API using your API key
2. Retrieved your assistant configuration
3. Added workflow-specific tools (functions) to your assistant
4. Configured these tools to call your backend endpoints

Now when someone talks to your assistant, it can:
- Generate interview questions on the fly
- Evaluate answers in real-time
- Create custom assessments
- Provide detailed feedback

## 🔄 Next Steps

### Option 1: Setup Webhook (Optional but Recommended)

For more advanced features, setup a webhook:

```bash
curl -X POST http://localhost:3000/vapi/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "webhookUrl": "http://localhost:3000/vapi/webhook",
    "webhookSecret": "your-secret-key"
  }'
```

**Note:** For webhooks in development, use ngrok:
```bash
ngrok http 3000
# Use the ngrok URL instead of localhost
```

### Option 2: Test Endpoints Directly

Generate questions:
```bash
curl -X POST http://localhost:3000/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Software Engineer",
    "level": "mid",
    "techstack": ["JavaScript", "React"],
    "skills": ["Problem Solving"],
    "amount": 3,
    "platform": "web",
    "userId": "test"
  }'
```

## 🎯 Common Use Cases

### Use Case 1: Automated Interview
Your assistant can now:
1. Ask the candidate about their role
2. Call `generate_interview_questions` to create relevant questions
3. Ask each question
4. Call `evaluate_answer` for each response
5. Call `generate_feedback` at the end

### Use Case 2: Skills Assessment
1. Assistant asks what skills to assess
2. Calls `create_assessment` with the skills
3. Administers the assessment
4. Provides results

### Use Case 3: Real-time Feedback
1. During the interview, assistant evaluates answers
2. Provides immediate feedback
3. Adjusts question difficulty based on performance

## 🛠️ Troubleshooting

### "API key is required"
- Check `.env.local` exists in project root
- Verify variable names match exactly
- Restart dev server

### "Assistant not found"
- Verify your assistant ID is correct
- Check VAPI API key has access to this assistant

### Workflow not working
- Check server is running on correct port
- Verify no firewall blocking requests
- Check logs for detailed errors

## 📚 Learn More

- [Full Documentation](./README.md) - Complete API reference
- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Examples](./examples/) - Code examples and patterns

## 🎉 Success!

Your VAPI assistant is now powered by AI interview capabilities. Test it out in the VAPI dashboard!

**Dashboard deprecation note:** The VAPI dashboard's UI for linking workflows is deprecated. That's why we built this programmatic approach - it's the new recommended way! 🚀


## Your Assistant ID
```
0b058f17-55aa-4636-ad06-445287514862
```

## ⚡ Fastest Way to Get Started

### Step 1: Set Environment Variables

Create `.env.local` in your project root:

```bash
# Required
VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Start Your Server

```bash
npm run dev
```

### Step 3: Link Assistant to Workflow

Run this command in your terminal:

```bash
curl -X POST http://localhost:3000/vapi/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "workflowType": "interview",
    "parameters": {}
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "workflowId": "workflow_xxxxx",
  "status": "active",
  "data": {
    "tools": [...]
  }
}
```

### Step 4: Test It

Go to your VAPI dashboard and test your assistant. It now has these new capabilities:

1. **generate_interview_questions** - Creates interview questions
2. **evaluate_answer** - Evaluates candidate answers
3. **create_assessment** - Creates skills assessments
4. **generate_feedback** - Generates interview feedback

## ✅ That's It!

Your assistant is now connected to the workflow and ready to conduct interviews.

## 📝 What Just Happened?

The `/vapi/workflow` endpoint:
1. Connected to VAPI API using your API key
2. Retrieved your assistant configuration
3. Added workflow-specific tools (functions) to your assistant
4. Configured these tools to call your backend endpoints

Now when someone talks to your assistant, it can:
- Generate interview questions on the fly
- Evaluate answers in real-time
- Create custom assessments
- Provide detailed feedback

## 🔄 Next Steps

### Option 1: Setup Webhook (Optional but Recommended)

For more advanced features, setup a webhook:

```bash
curl -X POST http://localhost:3000/vapi/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "webhookUrl": "http://localhost:3000/vapi/webhook",
    "webhookSecret": "your-secret-key"
  }'
```

**Note:** For webhooks in development, use ngrok:
```bash
ngrok http 3000
# Use the ngrok URL instead of localhost
```

### Option 2: Test Endpoints Directly

Generate questions:
```bash
curl -X POST http://localhost:3000/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Software Engineer",
    "level": "mid",
    "techstack": ["JavaScript", "React"],
    "skills": ["Problem Solving"],
    "amount": 3,
    "platform": "web",
    "userId": "test"
  }'
```

## 🎯 Common Use Cases

### Use Case 1: Automated Interview
Your assistant can now:
1. Ask the candidate about their role
2. Call `generate_interview_questions` to create relevant questions
3. Ask each question
4. Call `evaluate_answer` for each response
5. Call `generate_feedback` at the end

### Use Case 2: Skills Assessment
1. Assistant asks what skills to assess
2. Calls `create_assessment` with the skills
3. Administers the assessment
4. Provides results

### Use Case 3: Real-time Feedback
1. During the interview, assistant evaluates answers
2. Provides immediate feedback
3. Adjusts question difficulty based on performance

## 🛠️ Troubleshooting

### "API key is required"
- Check `.env.local` exists in project root
- Verify variable names match exactly
- Restart dev server

### "Assistant not found"
- Verify your assistant ID is correct
- Check VAPI API key has access to this assistant

### Workflow not working
- Check server is running on correct port
- Verify no firewall blocking requests
- Check logs for detailed errors

## 📚 Learn More

- [Full Documentation](./README.md) - Complete API reference
- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Examples](./examples/) - Code examples and patterns

## 🎉 Success!

Your VAPI assistant is now powered by AI interview capabilities. Test it out in the VAPI dashboard!

**Dashboard deprecation note:** The VAPI dashboard's UI for linking workflows is deprecated. That's why we built this programmatic approach - it's the new recommended way! 🚀



