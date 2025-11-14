#!/usr/bin/env node

/**
 * Quick script to update VAPI webhook URL
 * Usage: node scripts/update-webhook.js <assistant-id> [webhook-url]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join('=').trim();
            }
        });
    } catch (error) {
        console.log('⚠️  Could not load .env file:', error.message);
    }
}

loadEnvFile();

const assistantId = process.argv[2];
const webhookUrl = process.argv[3] || process.env.NEXT_PUBLIC_WEBHOOK_URL;
const apiKey = process.env.VAPI_API_KEY;

if (!assistantId) {
    console.error('❌ Usage: node scripts/update-webhook.js <assistant-id> [webhook-url]');
    process.exit(1);
}

if (!apiKey) {
    console.error('❌ VAPI_API_KEY environment variable is required');
    process.exit(1);
}

if (!webhookUrl) {
    console.error('❌ Webhook URL required (provide as argument or set NEXT_PUBLIC_WEBHOOK_URL)');
    process.exit(1);
}

// Ensure URL ends with /vapi/webhook
const fullWebhookUrl = webhookUrl.endsWith('/vapi/webhook') 
    ? webhookUrl 
    : `${webhookUrl}/vapi/webhook`;

const postData = JSON.stringify({
    serverUrl: fullWebhookUrl
});

const options = {
    hostname: 'api.vapi.ai',
    port: 443,
    path: `/assistant/${assistantId}`,
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('🔄 Updating VAPI webhook URL...');
console.log(`📡 Assistant ID: ${assistantId}`);
console.log(`🔗 Webhook URL: ${fullWebhookUrl}`);

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Webhook URL updated successfully!');
            console.log('📋 Response:', JSON.parse(data));
        } else {
            console.error('❌ Failed to update webhook URL');
            console.error('📋 Error:', data);
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    process.exit(1);
});

req.write(postData);
req.end();
