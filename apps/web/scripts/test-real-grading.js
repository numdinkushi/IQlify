#!/usr/bin/env node

/**
 * Test script for real VAPI grading integration
 * This simulates a real interview transcript and tests the AI grading system
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Sample interview transcript for testing
const sampleTranscript = `
Assistant: Hello! Welcome to our technical interview. I'm excited to learn about your experience. Let's start with a brief introduction.

Candidate: Hi! Thank you for having me. I'm a software engineer with 5 years of experience, primarily working with JavaScript, React, and Node.js. I've been working at a fintech startup for the past 3 years where I've built several microservices and led a team of 3 developers.

Assistant: That's great! Can you tell me about a challenging technical problem you've solved recently?

Candidate: Sure! Last quarter, we had a performance issue where our API response times were increasing from 200ms to over 2 seconds. I investigated and found that our database queries weren't optimized and we had N+1 query problems. I implemented query optimization, added proper indexing, and introduced Redis caching. This reduced our response times back to under 100ms and improved our user experience significantly.

Assistant: Excellent problem-solving approach! How do you handle code reviews and maintain code quality in your team?

Candidate: We have a structured code review process. Every PR requires at least two approvals, and we use automated tools like ESLint and Prettier. I also encourage my team to write unit tests for new features and we aim for at least 80% test coverage. I believe in constructive feedback and learning from each other's code.

Assistant: That's a solid approach. Can you explain how you would design a scalable chat application?

Candidate: I'd design it with a microservices architecture. The core components would be: a WebSocket service for real-time messaging, a message service for storing and retrieving messages, a user service for authentication and user management, and a notification service. I'd use Redis for caching and session management, and a message queue like RabbitMQ for handling high-volume message processing. For the database, I'd use a combination of PostgreSQL for relational data and MongoDB for message storage with proper sharding.

Assistant: Great architectural thinking! One final question: How do you stay updated with the latest technologies and best practices?

Candidate: I'm an active learner. I follow tech blogs, participate in online communities like Stack Overflow and GitHub, and attend local meetups and conferences. I also contribute to open-source projects and maintain a personal blog where I share my learning experiences. I believe in continuous learning and adapting to new technologies while maintaining a strong foundation in core computer science principles.

Assistant: Thank you for your time! You've demonstrated strong technical knowledge, problem-solving skills, and good communication. We'll be in touch soon.
`;

async function testRealGrading() {
    console.log('🧪 Testing Real VAPI Grading Integration...\n');

    try {
        // 1. Test webhook with sample transcript
        console.log('📤 Sending webhook with sample transcript...');
        
        const webhookPayload = {
            message: {
                type: "end-of-call-report",
                call: {
                    id: "test-real-call-123",
                    assistantId: "test-assistant-456"
                },
                transcript: sampleTranscript
            }
        };

        const webhookResponse = await makeRequest('POST', '/vapi/webhook', webhookPayload);
        console.log('✅ Webhook Response:', JSON.stringify(webhookResponse, null, 2));

        // 2. Wait a moment for processing
        console.log('\n⏳ Waiting for processing...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 3. Fetch the grading results
        console.log('\n📊 Fetching grading results...');
        const gradingResponse = await makeRequest('GET', '/vapi/grading?callId=test-real-call-123');
        console.log('✅ Grading Results:', JSON.stringify(gradingResponse, null, 2));

        // 4. Analyze the results
        if (gradingResponse.success && gradingResponse.grading) {
            const grading = gradingResponse.grading.gradingResults;
            console.log('\n📈 Grading Analysis:');
            console.log(`Overall Score: ${grading.overallScore}/10`);
            console.log(`Recommendation: ${grading.recommendation}`);
            console.log(`Summary: ${grading.summary}`);
            
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
testRealGrading().then(() => {
    console.log('\n🎉 Test completed successfully!');
    process.exit(0);
}).catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
});
