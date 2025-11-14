#!/usr/bin/env node

/**
 * Test script for the grading system
 * This simulates storing and retrieving grading results
 */

const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testGradingSystem() {
    console.log('🧪 Testing Grading System...\n');

    // Test 1: Store a mock grading result
    console.log('1️⃣ Storing mock grading result...');
    const mockGrading = {
        callId: 'test-call-123',
        gradingResults: {
            callId: 'test-call-123',
            assistantId: 'test-assistant-456',
            overallScore: 8,
            sections: {
                technical: {
                    score: 8,
                    feedback: "Excellent technical knowledge demonstrated"
                },
                communication: {
                    score: 7,
                    feedback: "Clear communication with minor improvements needed"
                },
                problemSolving: {
                    score: 9,
                    feedback: "Outstanding problem-solving approach"
                }
            },
            recommendation: "hire",
            timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    };

    await storeGrading(mockGrading);
    
    // Test 2: Retrieve the grading result
    console.log('\n2️⃣ Retrieving grading result...');
    await getGrading('test-call-123');
    
    // Test 3: List all gradings
    console.log('\n3️⃣ Listing all gradings...');
    await listAllGradings();
}

async function storeGrading(gradingData) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(gradingData);
        
        const options = {
            hostname: 'localhost',
            port: 54112,
            path: '/vapi/grading',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log('✅ Grading stored:', JSON.parse(data));
                resolve(data);
            });
        });

        req.on('error', (error) => {
            console.error('❌ Error storing grading:', error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function getGrading(callId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 54112,
            path: `/vapi/grading?callId=${callId}`,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log('✅ Grading retrieved:', JSON.parse(data));
                resolve(data);
            });
        });

        req.on('error', (error) => {
            console.error('❌ Error retrieving grading:', error.message);
            reject(error);
        });

        req.end();
    });
}

async function listAllGradings() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 54112,
            path: '/vapi/grading?action=list',
            method: 'PUT'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log('✅ All gradings:', JSON.parse(data));
                resolve(data);
            });
        });

        req.on('error', (error) => {
            console.error('❌ Error listing gradings:', error.message);
            reject(error);
        });

        req.end();
    });
}

// Run the test
testGradingSystem().catch(console.error);
