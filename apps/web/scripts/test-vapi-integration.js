#!/usr/bin/env node

/**
 * Test script for VAPI integration
 * Tests the real VAPI workflow system
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonBody = JSON.parse(body);
                    resolve(jsonBody);
                } catch (e) {
                    resolve({ success: false, error: 'Invalid JSON response', body });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testVapiIntegration() {
    console.log('🧪 Testing VAPI Integration...\n');

    try {
        // Test 1: Check if VAPI start endpoint is working
        console.log('1️⃣ Testing VAPI start endpoint...');
        
        const testData = {
            interviewId: 'test_interview_123',
            configuration: {
                interviewType: 'technical',
                skillLevel: 'intermediate',
                duration: 30
            }
        };

        const response = await makeRequest('POST', '/api/vapi/start', testData);
        
        if (response.success) {
            console.log('✅ VAPI start endpoint working!');
            console.log(`   Call ID: ${response.callId}`);
            console.log(`   Status: ${response.status}`);
        } else {
            console.log('❌ VAPI start endpoint failed:');
            console.log(`   Error: ${response.error}`);
            console.log(`   Details: ${response.details || 'No details provided'}`);
            
            if (response.error === 'VAPI API key not configured') {
                console.log('\n💡 Solution: Add VAPI_API_KEY to your .env.local file');
                console.log('   See docs/VAPI_ENVIRONMENT_SETUP.md for details');
            }
        }

        // Test 2: Check VAPI workflow endpoint
        console.log('\n2️⃣ Testing VAPI workflow endpoint...');
        
        const workflowData = {
            assistantId: 'test_assistant_123',
            workflowType: 'interview',
            parameters: {
                interviewId: 'test_interview_123',
                interviewType: 'technical',
                skillLevel: 'intermediate'
            }
        };

        const workflowResponse = await makeRequest('POST', '/vapi/workflow', workflowData);
        
        if (workflowResponse.success) {
            console.log('✅ VAPI workflow endpoint working!');
        } else {
            console.log('❌ VAPI workflow endpoint failed:');
            console.log(`   Error: ${workflowResponse.error}`);
        }

        // Test 3: Check VAPI calls endpoint
        console.log('\n3️⃣ Testing VAPI calls endpoint...');
        
        const callsResponse = await makeRequest('GET', '/vapi/calls?limit=5');
        
        if (callsResponse.success) {
            console.log('✅ VAPI calls endpoint working!');
            console.log(`   Found ${callsResponse.calls.length} calls`);
        } else {
            console.log('❌ VAPI calls endpoint failed:');
            console.log(`   Error: ${callsResponse.error}`);
        }

        console.log('\n🎯 Integration Test Summary:');
        console.log('   - VAPI Start: ' + (response.success ? '✅' : '❌'));
        console.log('   - VAPI Workflow: ' + (workflowResponse.success ? '✅' : '❌'));
        console.log('   - VAPI Calls: ' + (callsResponse.success ? '✅' : '❌'));

        if (!response.success && response.error === 'VAPI API key not configured') {
            console.log('\n📋 Next Steps:');
            console.log('1. Add VAPI_API_KEY to your .env.local file');
            console.log('2. Create assistants in VAPI dashboard');
            console.log('3. Add assistant IDs to environment variables');
            console.log('4. See docs/VAPI_ENVIRONMENT_SETUP.md for complete setup');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure your development server is running:');
        console.log('   cd apps/web && npm run dev');
    }
}

// Run the test
testVapiIntegration();
