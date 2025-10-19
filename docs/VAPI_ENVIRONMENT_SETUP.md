# VAPI Environment Variables Setup

## 🔧 **Required Environment Variables**

Add these to your `.env.local` file in the `apps/web` directory:

```bash
# VAPI Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_TECHNICAL_ASSISTANT_ID=your_technical_assistant_id
VAPI_SOFT_SKILLS_ASSISTANT_ID=your_soft_skills_assistant_id
VAPI_BEHAVIORAL_ASSISTANT_ID=your_behavioral_assistant_id
VAPI_SYSTEM_DESIGN_ASSISTANT_ID=your_system_design_assistant_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEBHOOK_URL=https://your-ngrok-url.ngrok.io

# Existing Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
CONVEX_DEPLOY_KEY=your_convex_deploy_key_here

# Cloudinary Configuration (if using image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🎯 **How to Get VAPI Assistant IDs**

1. **Go to VAPI Dashboard**: https://dashboard.vapi.ai
2. **Navigate to Assistants**: Click on "Assistants" in the sidebar
3. **Create or Select Assistant**: 
   - For Technical interviews: Create an assistant focused on coding/technical skills
   - For Soft Skills: Create an assistant for communication/leadership
   - For Behavioral: Create an assistant for behavioral questions
   - For System Design: Create an assistant for architecture/system design
4. **Copy Assistant ID**: Each assistant will have a unique ID (e.g., `0b058f17-55aa-4636-ad06-445287514862`)

## 🚀 **Testing the Integration**

Once you've set up the environment variables:

1. **Start the development server**:
   ```bash
   cd apps/web
   npm run dev
   ```

2. **Test the VAPI workflow endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/vapi/start \
     -H "Content-Type: application/json" \
     -d '{
       "interviewId": "test_interview_123",
       "configuration": {
         "interviewType": "technical",
         "skillLevel": "intermediate",
         "duration": 30
       }
     }'
   ```

3. **Expected Response**:
   ```json
   {
     "success": true,
     "callId": "workflow_test_interview_123",
     "status": "triggered",
     "workflowResult": { ... }
   }
   ```

## 🔍 **Troubleshooting**

### **Error: "VAPI API key not configured"**
- Make sure `VAPI_API_KEY` is set in your `.env.local` file
- Restart your development server after adding the variable

### **Error: "Assistant ID not found"**
- Make sure you've created assistants in your VAPI dashboard
- Copy the correct assistant IDs to your environment variables

### **Error: "Failed to trigger VAPI workflow"**
- Check that your VAPI API key is valid
- Verify the assistant IDs exist in your VAPI account
- Check the browser console for detailed error messages

## 📱 **For MiniPay Testing**

If you're testing in MiniPay environment:

1. **Use ngrok for webhooks**:
   ```bash
   ngrok http 3000
   ```

2. **Update webhook URL**:
   ```bash
   NEXT_PUBLIC_WEBHOOK_URL=https://your-ngrok-url.ngrok.io
   ```

3. **Test in MiniPay browser** with the ngrok URL

## 🎤 **Interview Flow**

Once configured, the interview flow will be:

1. **User selects interview configuration** (skill level, type, duration)
2. **System creates interview record** in Convex database
3. **VAPI workflow is triggered** with appropriate assistant
4. **User is redirected** to real interview interface
5. **Real-time audio conversation** with AI interviewer
6. **VAPI webhooks handle completion** and scoring
7. **Results are saved** to database with earnings

The system now uses **real VAPI endpoints** instead of mock data!
