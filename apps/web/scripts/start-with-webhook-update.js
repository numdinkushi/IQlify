#!/usr/bin/env node

/**
 * Startup script that updates VAPI webhook URL before starting the server
 * Usage: npm run dev:webhook or npm run start:webhook
 */

// Load environment variables from .env file
const fs = require('fs');
const path = require('path');

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

const { spawn } = require('child_process');
const https = require('https');

// Configuration
const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;
const API_KEY = process.env.VAPI_API_KEY;

async function updateWebhookUrl() {
    return new Promise((resolve, reject) => {
        if (!ASSISTANT_ID || !WEBHOOK_URL || !API_KEY) {
            console.log('⚠️  Skipping webhook update - missing required environment variables:');
            if (!ASSISTANT_ID) console.log('   - VAPI_ASSISTANT_ID');
            if (!WEBHOOK_URL) console.log('   - NEXT_PUBLIC_WEBHOOK_URL');
            if (!API_KEY) console.log('   - VAPI_API_KEY');
            resolve(false);
            return;
        }

        // Ensure URL ends with /vapi/webhook
        const fullWebhookUrl = WEBHOOK_URL.endsWith('/vapi/webhook')
            ? WEBHOOK_URL
            : `${WEBHOOK_URL}/vapi/webhook`;

        const postData = JSON.stringify({
            serverUrl: fullWebhookUrl
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

        console.log('🔄 Updating VAPI webhook URL...');
        console.log(`📡 Assistant ID: ${ASSISTANT_ID}`);
        console.log(`🔗 Webhook URL: ${fullWebhookUrl}`);

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Webhook URL updated successfully!');
                    resolve(true);
                } else {
                    console.error('❌ Failed to update webhook URL');
                    console.error('📋 Error:', data);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request failed:', error.message);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

function startServer(command) {
    console.log(`🚀 Starting server with: ${command}`);
    
    const child = spawn('npm', ['run', command], {
        stdio: 'inherit',
        shell: true
    });

    child.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
    });

    child.on('error', (error) => {
        console.error('Failed to start server:', error);
    });

    return child;
}

async function main() {
    const command = process.argv[2] || 'dev';
    
    console.log('🎯 Starting IQlify with automatic webhook update...\n');
    
    // Update webhook URL first
    const webhookUpdated = await updateWebhookUrl();
    
    if (webhookUpdated) {
        console.log('✅ Ready to start server\n');
    } else {
        console.log('⚠️  Starting server without webhook update\n');
    }
    
    // Start the server
    startServer(command);
}

main().catch(error => {
    console.error('❌ Startup failed:', error);
    process.exit(1);
});
