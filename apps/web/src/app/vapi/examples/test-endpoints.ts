/**
 * Example: Testing VAPI endpoints
 * 
 * This script demonstrates how to use all the VAPI endpoints.
 * Useful for testing and understanding the API.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Test interview question generation
 */
export async function testGenerateQuestions() {
    console.log('🧪 Testing question generation...\n');

    const requestBody = {
        role: "Full Stack Developer",
        level: "senior",
        techstack: ["React", "Node.js", "PostgreSQL", "AWS"],
        skills: ["System Design", "API Development", "Database Design", "DevOps"],
        amount: 5,
        platform: "web",
        userId: "test_user_123",
        prompt: "Focus on scalability and real-world scenarios",
        temperature: 0.7,
    };

    console.log('📤 Request:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Questions generated successfully!\n');
            console.log(`📊 Generated ${result.questions.length} questions:\n`);

            result.questions.forEach((q: any, idx: number) => {
                console.log(`${idx + 1}. [${q.difficulty}] ${q.question}`);
                console.log(`   Category: ${q.category}`);
                if (q.followUpQuestions?.length > 0) {
                    console.log(`   Follow-ups: ${q.followUpQuestions.length}`);
                }
                console.log();
            });

            return result.questions;
        } else {
            console.error('❌ Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

/**
 * Test answer evaluation
 */
export async function testEvaluateAnswer() {
    console.log('🧪 Testing answer evaluation...\n');

    const requestBody = {
        question: "Explain the differences between REST and GraphQL, and when you would use each.",
        answer: "REST uses multiple endpoints with standard HTTP methods like GET, POST, PUT, DELETE. Each endpoint returns a fixed data structure. GraphQL uses a single endpoint and lets clients specify exactly what data they need using a query language. I'd use REST for simple CRUD operations and public APIs where caching is important. GraphQL is better for complex data requirements, mobile apps with bandwidth constraints, and when you need to aggregate data from multiple sources.",
        expectedAnswer: "Should cover: REST's resource-based approach, GraphQL's query flexibility, over-fetching/under-fetching issues, caching differences, use cases for each.",
        context: "Senior Full Stack Developer Interview",
    };

    console.log('📤 Evaluating answer for:');
    console.log(`   Question: ${requestBody.question}\n`);

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Evaluation complete!\n');
            const eval_data = result.evaluation;

            console.log(`📊 Overall Score: ${eval_data.score}/10`);
            console.log(`🎯 Technical Accuracy: ${eval_data.technicalAccuracy}/10`);
            console.log(`💬 Clarity: ${eval_data.clarity}/10`);
            console.log(`📚 Depth: ${eval_data.depth}/10\n`);

            console.log('💪 Strengths:');
            eval_data.strengths?.forEach((s: string) => console.log(`   • ${s}`));

            console.log('\n🔧 Areas for Improvement:');
            eval_data.weaknesses?.forEach((w: string) => console.log(`   • ${w}`));

            console.log('\n📝 Feedback:');
            console.log(`   ${eval_data.feedback}\n`);

            return eval_data;
        } else {
            console.error('❌ Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

/**
 * Test assessment creation
 */
export async function testCreateAssessment() {
    console.log('🧪 Testing assessment creation...\n');

    const requestBody = {
        skills: ["JavaScript", "TypeScript", "React", "Node.js"],
        difficulty: "medium",
        assessmentType: "technical",
    };

    console.log('📤 Creating assessment for:', requestBody.skills.join(', '));

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/assessment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Assessment created!\n');
            const assessment = result.assessment;

            console.log(`📋 Title: ${assessment.title}`);
            console.log(`⏱️  Estimated Time: ${assessment.estimatedTime}`);
            console.log(`❓ Questions: ${assessment.questions?.length || 0}\n`);

            return assessment;
        } else {
            console.error('❌ Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

/**
 * Test feedback generation
 */
export async function testGenerateFeedback() {
    console.log('🧪 Testing feedback generation...\n');

    const requestBody = {
        interviewId: "int_test_12345",
        candidateName: "Jane Doe",
        role: "Senior Full Stack Developer",
        scores: {
            technical: 8,
            communication: 9,
            problemSolving: 7,
            systemDesign: 8,
        },
        answers: [
            {
                question: "Explain microservices architecture",
                answer: "Microservices break down applications into small, independent services...",
                score: 8,
            },
            {
                question: "How do you handle API versioning?",
                answer: "I use URL versioning like /api/v1/...",
                score: 7,
            },
        ],
        overallPerformance: "strong",
        notes: "Candidate showed excellent communication and deep technical knowledge",
    };

    console.log('📤 Generating feedback for:', requestBody.candidateName);

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Feedback generated!\n');
            const feedback = result.feedback;

            console.log(`📊 Overall Score: ${feedback.overallScore}/10`);
            console.log(`🎯 Recommendation: ${feedback.recommendation}\n`);

            console.log('💪 Strengths:');
            feedback.strengths?.forEach((s: string) => console.log(`   • ${s}`));

            console.log('\n📈 Areas for Improvement:');
            feedback.areasForImprovement?.forEach((a: string) => console.log(`   • ${a}`));

            console.log('\n📝 Detailed Feedback:');
            console.log(`   ${feedback.detailedFeedback}\n`);

            return feedback;
        } else {
            console.error('❌ Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

/**
 * Run all tests
 */
export async function runAllTests() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  VAPI Endpoints Testing Suite         ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('Testing all endpoints...\n');
    console.log('═'.repeat(50) + '\n');

    await testGenerateQuestions();
    console.log('\n' + '═'.repeat(50) + '\n');

    await testEvaluateAnswer();
    console.log('\n' + '═'.repeat(50) + '\n');

    await testCreateAssessment();
    console.log('\n' + '═'.repeat(50) + '\n');

    await testGenerateFeedback();
    console.log('\n' + '═'.repeat(50) + '\n');

    console.log('✨ All tests completed!');
}

// Uncomment to run all tests:
// runAllTests();

/**
 * Example: Testing VAPI endpoints
 * 
 * This script demonstrates how to use all the VAPI endpoints.
 * Useful for testing and understanding the API.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Test interview question generation
 */
export async function testGenerateQuestions() {
    console.log('🧪 Testing question generation...\n');

    const requestBody = {
        role: "Full Stack Developer",
        level: "senior",
        techstack: ["React", "Node.js", "PostgreSQL", "AWS"],
        skills: ["System Design", "API Development", "Database Design", "DevOps"],
        amount: 5,
        platform: "web",
        userId: "test_user_123",
        prompt: "Focus on scalability and real-world scenarios",
        temperature: 0.7,
    };

    console.log('📤 Request:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Questions generated successfully!\n');
            console.log(`📊 Generated ${result.questions.length} questions:\n`);

            result.questions.forEach((q: any, idx: number) => {
                console.log(`${idx + 1}. [${q.difficulty}] ${q.question}`);
                console.log(`   Category: ${q.category}`);
                if (q.followUpQuestions?.length > 0) {
                    console.log(`   Follow-ups: ${q.followUpQuestions.length}`);
                }
                console.log();
            });

            return result.questions;
        } else {
            console.error('❌ Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

/**
 * Test answer evaluation
 */
export async function testEvaluateAnswer() {
    console.log('🧪 Testing answer evaluation...\n');

    const requestBody = {
        question: "Explain the differences between REST and GraphQL, and when you would use each.",
        answer: "REST uses multiple endpoints with standard HTTP methods like GET, POST, PUT, DELETE. Each endpoint returns a fixed data structure. GraphQL uses a single endpoint and lets clients specify exactly what data they need using a query language. I'd use REST for simple CRUD operations and public APIs where caching is important. GraphQL is better for complex data requirements, mobile apps with bandwidth constraints, and when you need to aggregate data from multiple sources.",
        expectedAnswer: "Should cover: REST's resource-based approach, GraphQL's query flexibility, over-fetching/under-fetching issues, caching differences, use cases for each.",
        context: "Senior Full Stack Developer Interview",
    };

    console.log('📤 Evaluating answer for:');
    console.log(`   Question: ${requestBody.question}\n`);

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Evaluation complete!\n');
            const eval_data = result.evaluation;

            console.log(`📊 Overall Score: ${eval_data.score}/10`);
            console.log(`🎯 Technical Accuracy: ${eval_data.technicalAccuracy}/10`);
            console.log(`💬 Clarity: ${eval_data.clarity}/10`);
            console.log(`📚 Depth: ${eval_data.depth}/10\n`);

            console.log('💪 Strengths:');
            eval_data.strengths?.forEach((s: string) => console.log(`   • ${s}`));

            console.log('\n🔧 Areas for Improvement:');
            eval_data.weaknesses?.forEach((w: string) => console.log(`   • ${w}`));

            console.log('\n📝 Feedback:');
            console.log(`   ${eval_data.feedback}\n`);

            return eval_data;
        } else {
            console.error('❌ Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

/**
 * Test assessment creation
 */
export async function testCreateAssessment() {
    console.log('🧪 Testing assessment creation...\n');

    const requestBody = {
        skills: ["JavaScript", "TypeScript", "React", "Node.js"],
        difficulty: "medium",
        assessmentType: "technical",
    };

    console.log('📤 Creating assessment for:', requestBody.skills.join(', '));

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/assessment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Assessment created!\n');
            const assessment = result.assessment;

            console.log(`📋 Title: ${assessment.title}`);
            console.log(`⏱️  Estimated Time: ${assessment.estimatedTime}`);
            console.log(`❓ Questions: ${assessment.questions?.length || 0}\n`);

            return assessment;
        } else {
            console.error('❌ Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

/**
 * Test feedback generation
 */
export async function testGenerateFeedback() {
    console.log('🧪 Testing feedback generation...\n');

    const requestBody = {
        interviewId: "int_test_12345",
        candidateName: "Jane Doe",
        role: "Senior Full Stack Developer",
        scores: {
            technical: 8,
            communication: 9,
            problemSolving: 7,
            systemDesign: 8,
        },
        answers: [
            {
                question: "Explain microservices architecture",
                answer: "Microservices break down applications into small, independent services...",
                score: 8,
            },
            {
                question: "How do you handle API versioning?",
                answer: "I use URL versioning like /api/v1/...",
                score: 7,
            },
        ],
        overallPerformance: "strong",
        notes: "Candidate showed excellent communication and deep technical knowledge",
    };

    console.log('📤 Generating feedback for:', requestBody.candidateName);

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Feedback generated!\n');
            const feedback = result.feedback;

            console.log(`📊 Overall Score: ${feedback.overallScore}/10`);
            console.log(`🎯 Recommendation: ${feedback.recommendation}\n`);

            console.log('💪 Strengths:');
            feedback.strengths?.forEach((s: string) => console.log(`   • ${s}`));

            console.log('\n📈 Areas for Improvement:');
            feedback.areasForImprovement?.forEach((a: string) => console.log(`   • ${a}`));

            console.log('\n📝 Detailed Feedback:');
            console.log(`   ${feedback.detailedFeedback}\n`);

            return feedback;
        } else {
            console.error('❌ Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

/**
 * Run all tests
 */
export async function runAllTests() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  VAPI Endpoints Testing Suite         ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('Testing all endpoints...\n');
    console.log('═'.repeat(50) + '\n');

    await testGenerateQuestions();
    console.log('\n' + '═'.repeat(50) + '\n');

    await testEvaluateAnswer();
    console.log('\n' + '═'.repeat(50) + '\n');

    await testCreateAssessment();
    console.log('\n' + '═'.repeat(50) + '\n');

    await testGenerateFeedback();
    console.log('\n' + '═'.repeat(50) + '\n');

    console.log('✨ All tests completed!');
}

// Uncomment to run all tests:
// runAllTests();



