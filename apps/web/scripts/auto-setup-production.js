#!/usr/bin/env node

/**
 * Auto-setup script that runs webhook configuration in production
 * This can be integrated into your deployment pipeline
 */

const https = require('https');

const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const PRODUCTION_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_WEBHOOK_URL;
const API_KEY = process.env.VAPI_API_KEY;

// Only run in production
const NODE_ENV = process.env.NODE_ENV;

async function autoSetupProduction() {
    // Skip if not in production
    if (NODE_ENV !== 'production') {
        console.log('ℹ️  Skipping production setup - not in production environment');
        return true;
    }

    // Skip if missing required variables
    if (!ASSISTANT_ID || !PRODUCTION_URL || !API_KEY) {
        console.log('⚠️  Skipping production setup - missing environment variables');
        return true; // Don't fail the deployment
    }

    return new Promise((resolve) => {
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

        console.log('🏭 Auto-setting up production webhook...');
        console.log(`🔗 URL: ${webhookUrl}`);

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Production webhook auto-configured!');
                    resolve(true);
                } else {
                    console.error('⚠️  Failed to auto-configure webhook (non-fatal)');
                    console.error('📋 Error:', data);
                    resolve(true); // Don't fail deployment
                }
            });
        });

        req.on('error', (error) => {
            console.error('⚠️  Webhook setup failed (non-fatal):', error.message);
            resolve(true); // Don't fail deployment
        });

        req.setTimeout(10000, () => {
            console.error('⚠️  Webhook setup timed out (non-fatal)');
            resolve(true); // Don't fail deployment
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        await autoSetupProduction();
        console.log('🚀 Auto-setup complete');
    } catch (error) {
        console.error('❌ Auto-setup failed:', error.message);
        // Don't exit with error code - let deployment continue
    }
}

main();
