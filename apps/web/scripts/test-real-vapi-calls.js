#!/usr/bin/env node

/**
 * Test script for real VAPI calls integration
 * This fetches actual calls from VAPI and tests grading with real data
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function fetchRealCalls() {
    console.log('📞 Fetching real VAPI calls...\n');

    try {
        // 1. Fetch all calls from VAPI
        const callsResponse = await makeRequest('GET', '/vapi/calls?limit=5');
        
        if (!callsResponse.success) {
            throw new Error(`Failed to fetch calls: ${callsResponse.error}`);
        }

        console.log(`✅ Found ${callsResponse.calls.length} real calls from VAPI:`);
        callsResponse.calls.forEach((call, index) => {
            console.log(`  ${index + 1}. Call ID: ${call.id}`);
            console.log(`     Status: ${call.status}`);
            console.log(`     Duration: ${call.duration || 'N/A'} seconds`);
            console.log(`     Created: ${new Date(call.createdAt).toLocaleString()}`);
            console.log(`     Assistant: ${call.assistantId || 'N/A'}`);
            console.log('');
        });

        if (callsResponse.calls.length === 0) {
            console.log('⚠️  No calls found. You may need to make some test calls first.');
            return;
        }

        // 2. Pick the first call for testing
        const testCall = callsResponse.calls[0];
        console.log(`🎯 Testing with real call: ${testCall.id}\n`);

        // 3. Test grading with real call ID
        console.log('🧪 Testing grading with real call ID...');
        
        const webhookPayload = {
            message: {
                type: "end-of-call-report",
                call: {
                    id: testCall.id,
                    assistantId: testCall.assistantId
                }
            }
        };

        const webhookResponse = await makeRequest('POST', '/vapi/webhook', webhookPayload);
        console.log('✅ Webhook Response:', JSON.stringify(webhookResponse, null, 2));

        // 4. Wait for processing
        console.log('\n⏳ Waiting for processing...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 5. Fetch the grading results
        console.log('\n📊 Fetching grading results...');
        const gradingResponse = await makeRequest('GET', `/vapi/grading?callId=${testCall.id}`);
        
        if (gradingResponse.success && gradingResponse.grading) {
            const grading = gradingResponse.grading.gradingResults;
            console.log('\n📈 Real Grading Analysis:');
            console.log(`Call ID: ${grading.callId}`);
            console.log(`Overall Score: ${grading.overallScore}/10`);
            console.log(`Recommendation: ${grading.recommendation}`);
            console.log(`Summary: ${grading.summary}`);
            
            if (grading.transcriptLength) {
                console.log(`Transcript Length: ${grading.transcriptLength} characters`);
            }
            
            console.log('\n📊 Section Scores:');
            Object.entries(grading.sections).forEach(([section, data]) => {
                console.log(`  ${section}: ${data.score}/10 - ${data.feedback}`);
            });
            
            if (grading.keyHighlights && grading.keyHighlights.length > 0) {
                console.log('\n🌟 Key Highlights:');
                grading.keyHighlights.forEach((highlight, index) => {
                    console.log(`  ${index + 1}. ${highlight}`);
                });
            }
            
            if (grading.areasForImprovement && grading.areasForImprovement.length > 0) {
                console.log('\n🔧 Areas for Improvement:');
                grading.areasForImprovement.forEach((area, index) => {
                    console.log(`  ${index + 1}. ${area}`);
                });
            }
        } else {
            console.log('❌ No grading found for this call');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch (e) {
                    resolve({ error: 'Invalid JSON response', body });
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

// Run the test
fetchRealCalls().then(() => {
    console.log('\n🎉 Real VAPI calls test completed!');
    process.exit(0);
}).catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
});
