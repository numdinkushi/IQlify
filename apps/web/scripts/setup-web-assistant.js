#!/usr/bin/env node

/**
 * Setup VAPI assistant for web-based calls
 * This script configures the assistant to properly handle web calls
 */

const https = require('https');

// Configuration from environment
const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || '0b058f17-55aa-4636-ad06-445287514862';
const API_KEY = process.env.VAPI_API_KEY;
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || process.env.NEXT_PUBLIC_APP_URL;

async function setupWebAssistant() {
    return new Promise((resolve, reject) => {
        if (!API_KEY) {
            console.error('❌ Missing VAPI_API_KEY environment variable');
            reject(new Error('VAPI_API_KEY is required'));
            return;
        }

        // Ensure webhook URL ends with /vapi/webhook
        const webhookUrl = WEBHOOK_URL ? 
            (WEBHOOK_URL.endsWith('/vapi/webhook') ? WEBHOOK_URL : `${WEBHOOK_URL}/vapi/webhook`) :
            null;

        // Assistant configuration for web calls
        const assistantConfig = {
            // Enable web calls
            webCallEnabled: true,
            
            // Increase customer join timeout for web calls
            customerJoinTimeoutSeconds: 60,
            
            // Set up proper transcriber for web calls
            transcriber: {
                model: 'nova-2',
                language: 'en',
                provider: 'deepgram'
            },
            
            // Configure voice for better web call experience
            voice: {
                provider: '11labs',
                voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
                stability: 0.5,
                similarityBoost: 0.75
            },
            
            // Set up proper first message for interviews
            firstMessage: "Hello! I'm your AI interviewer. I'm ready to begin the technical interview. Please make sure your microphone is working and speak clearly. Let's start with a brief introduction about yourself.",
            
            // Configure end call message
            endCallMessage: "Thank you for completing the interview. Your responses have been recorded and will be evaluated. Have a great day!",
            
            // Add webhook URL if available
            ...(webhookUrl && { serverUrl: webhookUrl }),
            
            // Set up proper model configuration
            model: {
                provider: 'openai',
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI technical interviewer conducting a professional interview. 

Your role:
- Conduct structured technical interviews
- Ask relevant questions based on the skill level and interview type
- Provide clear, professional feedback
- Maintain a conversational but professional tone
- Adapt your questions based on the candidate's responses

Guidelines:
- Start with introductions and background questions
- Ask technical questions appropriate to the skill level
- Listen actively and ask follow-up questions
- Provide constructive feedback when appropriate
- Keep the interview within the allocated time
- End professionally when time is up

Remember: You are conducting a real interview, so be professional, thorough, and fair in your assessment.`
                    }
                ]
            }
        };

        const postData = JSON.stringify(assistantConfig);

        const options = {
            hostname: 'api.vapi.ai',
            port: 443,
            path: `/assistant/${ASSISTANT_ID}`,
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log('🔧 Setting up VAPI assistant for web calls...');
        console.log(`📡 Assistant ID: ${ASSISTANT_ID}`);
        console.log(`🔗 Webhook URL: ${webhookUrl || 'Not set'}`);

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Assistant configured successfully for web calls');
                    console.log('📋 Configuration applied:');
                    console.log('   - Web calls enabled');
                    console.log('   - Customer join timeout: 60 seconds');
                    console.log('   - Transscriber: Deepgram Nova-2');
                    console.log('   - Voice: 11labs Rachel');
                    console.log('   - First message configured for interviews');
                    console.log('   - Model: GPT-4o-mini with interview system prompt');
                    if (webhookUrl) {
                        console.log(`   - Webhook URL: ${webhookUrl}`);
                    }
                    resolve(true);
                } else {
                    console.error('❌ Failed to configure assistant');
                    console.error(`Status: ${res.statusCode}`);
                    console.error(`Response: ${data}`);
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request failed:', error);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        await setupWebAssistant();
        console.log('\n🎉 Setup complete! Your assistant is now configured for web-based interviews.');
        console.log('\n📝 Next steps:');
        console.log('1. Test the interview flow in your application');
        console.log('2. Check the VAPI dashboard for call logs');
        console.log('3. Ensure microphone permissions are granted in the browser');
        console.log('4. Monitor webhook events if configured');
    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { setupWebAssistant };
