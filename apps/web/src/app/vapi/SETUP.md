# Setup Guide for VAPI Integration

## 🚀 Quick Start

### 1. Install Dependencies

Your project should already have these, but verify:

```bash
npm install @google/generative-ai
```

### 2. Configure Environment Variables

Create or update your `.env.local` file in the root of your project:

```env
# VAPI Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_WEBHOOK_SECRET=your_webhook_secret_here

# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get your API keys:**
- VAPI: https://dashboard.vapi.ai/account
- Gemini: https://makersuite.google.com/app/apikey

### 3. Test Your Endpoints

Start your development server:

```bash
npm run dev
```

Test the health endpoint:

```bash
curl http://localhost:3000/vapi/generate
```

You should see a JSON response with API information.

### 4. Link Your VAPI Assistant

You have your assistant ID: `0b058f17-55aa-4636-ad06-445287514862`

Choose one of these methods to link it to the workflow:

#### Option A: Use the Workflow API (Easiest)

```bash
curl -X POST http://localhost:3000/vapi/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "workflowType": "interview",
    "parameters": {}
  }'
```

This automatically adds all the necessary tools to your assistant.

#### Option B: Setup Webhook

```bash
curl -X POST http://localhost:3000/vapi/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "0b058f17-55aa-4636-ad06-445287514862",
    "webhookUrl": "http://localhost:3000/vapi/webhook",
    "webhookSecret": "your-secret-here"
  }'
```

**Note:** For local development, you'll need to expose your localhost using ngrok or similar:

```bash
ngrok http 3000
# Then use the ngrok URL in your webhook setup
```

### 5. Test the Integration

#### Generate Interview Questions

```bash
curl -X POST http://localhost:3000/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Full Stack Developer",
    "level": "senior",
    "techstack": ["React", "Node.js"],
    "skills": ["API Development"],
    "amount": 3,
    "platform": "web",
    "userId": "test_user"
  }'
```

#### Evaluate an Answer

```bash
curl -X POST http://localhost:3000/vapi/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces.",
    "expectedAnswer": "Should mention components, virtual DOM, declarative"
  }'
```

## 🔧 Troubleshooting

### "API key is required" Error
- Check that your `.env.local` file exists
- Verify the environment variable names match exactly
- Restart your dev server after adding environment variables

### Webhook Not Working
- For local development, use ngrok or similar to expose localhost
- Make sure your webhook URL is publicly accessible
- Check webhook logs in the VAPI dashboard

### TypeScript Errors
- Run `npm run type-check` to see all type errors
- Ensure all imports use the correct paths
- Verify `tsconfig.json` includes the vapi directory

## 📝 Project Structure

```
vapi/
├── types/              # TypeScript definitions
│   └── index.ts
├── services/           # Business logic
│   ├── VapiService.ts
│   └── GeminiService.ts
├── config/             # Configuration
│   └── index.ts
├── utils/              # Utilities
│   └── validators.ts
├── generate/           # Generate questions endpoint
│   └── route.ts
├── evaluate/           # Evaluate answers endpoint
│   └── route.ts
├── assessment/         # Create assessments endpoint
│   └── route.ts
├── feedback/           # Generate feedback endpoint
│   └── route.ts
├── workflow/           # Workflow management endpoint
│   └── route.ts
├── assistant/          # Assistant management endpoint
│   └── route.ts
├── webhook/            # Webhook handler endpoint
│   └── route.ts
└── examples/           # Usage examples
    ├── setup-workflow.ts
    └── test-endpoints.ts
```

## 🎯 Next Steps

1. ✅ Test all endpoints locally
2. ✅ Link your assistant to the workflow
3. ✅ Test the assistant in VAPI dashboard
4. ✅ Deploy to production
5. ✅ Update webhook URLs to production URLs
6. ✅ Monitor webhook logs

## 🆘 Need Help?

- Check the [main README](./README.md) for detailed API documentation
- Review the [examples](./examples/) folder for usage patterns
- Test endpoints using the test script: `examples/test-endpoints.ts`

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use strong webhook secrets (32+ characters)
- Validate all webhook signatures in production
- Use HTTPS for all webhook URLs in production
- Rate limit your endpoints in production

## 📊 Monitoring

To monitor your VAPI integration:

1. Check VAPI dashboard for call logs
2. Monitor webhook delivery in VAPI dashboard
3. Check your application logs for errors
4. Set up error tracking (e.g., Sentry)

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Webhook URLs use HTTPS
- [ ] API keys are secure and not exposed
- [ ] Error handling tested
- [ ] Rate limiting implemented
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Backup webhook handlers ready
- [ ] Documentation updated
- [ ] Team trained on the system


