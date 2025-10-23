#!/usr/bin/env node

/**
 * Test script to verify VAPI web call functionality
 * This script tests the VAPI integration without requiring full setup
 */

const https = require('https');

// Configuration
const ASSISTANT_ID = '0b058f17-55aa-4636-ad06-445287514862';
const API_KEY = 'ba249413-c68b-41ee-8e0e-d91ca6ff3e25';

async function testVapiConnection() {
    return new Promise((resolve, reject) => {
        console.log('🔍 Testing VAPI connection...');
        console.log(`📡 Assistant ID: ${ASSISTANT_ID}`);
        console.log(`🔑 API Key: ${API_KEY.substring(0, 8)}...`);

        const options = {
            hostname: 'api.vapi.ai',
            port: 443,
            path: `/assistant/${ASSISTANT_ID}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ VAPI connection successful');
                    const assistant = JSON.parse(data);
                    console.log('📋 Assistant details:');
                    console.log(`   - Name: ${assistant.name}`);
                    console.log(`   - Voice: ${assistant.voice?.provider || 'Unknown'}`);
                    console.log(`   - Model: ${assistant.model?.provider || 'Unknown'}`);
                    console.log(`   - Web Call Enabled: ${assistant.webCallEnabled ? 'Yes' : 'No'}`);
                    console.log(`   - Customer Join Timeout: ${assistant.customerJoinTimeoutSeconds || 'Not set'} seconds`);
                    resolve(true);
                } else {
                    console.error('❌ VAPI connection failed');
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

        req.end();
    });
}

async function testCallCreation() {
    return new Promise((resolve, reject) => {
        console.log('\n🔍 Testing call creation...');

        const callRequest = {
            assistantId: ASSISTANT_ID,
            maxDurationSeconds: 600, // 10 minutes
            customerJoinTimeoutSeconds: 60, // 60 seconds
            metadata: {
                testCall: true,
                timestamp: new Date().toISOString()
            }
        };

        const postData = JSON.stringify(callRequest);

        const options = {
            hostname: 'api.vapi.ai',
            port: 443,
            path: '/call',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    console.log('✅ Call creation successful');
                    const call = JSON.parse(data);
                    console.log(`📞 Call ID: ${call.id}`);
                    console.log(`📊 Status: ${call.status}`);
                    resolve(true);
                } else {
                    console.error('❌ Call creation failed');
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
        console.log('🧪 VAPI Web Call Integration Test\n');
        
        // Test 1: Connection
        await testVapiConnection();
        
        // Test 2: Call Creation
        await testCallCreation();
        
        console.log('\n🎉 All tests passed! VAPI integration is working correctly.');
        console.log('\n📝 Next steps:');
        console.log('1. Test the interview flow in your application');
        console.log('2. Ensure microphone permissions are granted');
        console.log('3. Monitor the VAPI dashboard for call logs');
        console.log('4. Check browser console for any client-side errors');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Verify the VAPI API key is correct');
        console.log('2. Check that the assistant ID exists');
        console.log('3. Ensure your internet connection is working');
        console.log('4. Check VAPI service status');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { testVapiConnection, testCallCreation };
