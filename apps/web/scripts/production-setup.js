#!/usr/bin/env node

/**
 * Production webhook setup script
 * Run this once when deploying to production
 */

const https = require('https');

const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const PRODUCTION_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_WEBHOOK_URL;
const API_KEY = process.env.VAPI_API_KEY;

async function setupProductionWebhook() {
    return new Promise((resolve, reject) => {
        if (!ASSISTANT_ID || !PRODUCTION_URL || !API_KEY) {
            console.error('❌ Missing required environment variables:');
            if (!ASSISTANT_ID) console.error('   - VAPI_ASSISTANT_ID');
            if (!PRODUCTION_URL) console.error('   - NEXT_PUBLIC_APP_URL or NEXT_PUBLIC_WEBHOOK_URL');
            if (!API_KEY) console.error('   - VAPI_API_KEY');
            reject(new Error('Missing environment variables'));
            return;
        }

        // Ensure URL ends with /vapi/webhook
        const webhookUrl = PRODUCTION_URL.endsWith('/vapi/webhook')
            ? PRODUCTION_URL
            : `${PRODUCTION_URL}/vapi/webhook`;

        const postData = JSON.stringify({
            serverUrl: webhookUrl
        });

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

        console.log('🏭 Setting up production webhook...');
        console.log(`📡 Assistant ID: ${ASSISTANT_ID}`);
        console.log(`🔗 Production URL: ${webhookUrl}`);

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Production webhook configured successfully!');
                    console.log('🎉 Your VAPI assistant is ready for production use.');
                    console.log(`📋 Webhook URL: ${webhookUrl}`);
                    resolve(true);
                } else {
                    console.error('❌ Failed to setup production webhook');
                    console.error('📋 Error:', data);
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request failed:', error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        await setupProductionWebhook();
        console.log('\n🚀 Production setup complete!');
        console.log('💡 You can now start your production server with: npm run start');
    } catch (error) {
        console.error('\n❌ Production setup failed:', error.message);
        process.exit(1);
    }
}

main();
