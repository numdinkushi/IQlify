import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '../services/GeminiService';

/**
 * Feedback Generation Endpoint
 * Generates comprehensive feedback based on interview performance
 */

export async function GET() {
    return NextResponse.json({
        message: "Feedback Generation API",
        status: "active",
        version: "1.0",
        description: "Generates interview feedback",
    });
}

export async function POST(request: NextRequest) {
    try {
        const {
            interviewId,
            candidateName,
            role,
            scores = {},
            answers = [],
            overallPerformance,
            notes
        } = await request.json();

        if (!interviewId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Interview ID is required',
                },
                { status: 400 }
            );
        }

        const geminiService = new GeminiService();

        const feedbackPrompt = `Generate comprehensive interview feedback for:

**Interview ID**: ${interviewId}
${candidateName ? `**Candidate**: ${candidateName}` : ''}
${role ? `**Role**: ${role}` : ''}

**Performance Scores**: ${JSON.stringify(scores, null, 2)}

${answers.length > 0 ? `**Interview Responses**: 
${answers.map((a: any, i: number) => `
Question ${i + 1}: ${a.question}
Answer: ${a.answer}
Score: ${a.score}/10
`).join('\n')}` : ''}

${overallPerformance ? `**Overall Performance**: ${overallPerformance}` : ''}

${notes ? `**Additional Notes**: ${notes}` : ''}

Generate detailed feedback in JSON format:
{
  "feedbackId": "<unique-id>",
  "overallScore": <average score>,
  "overallAssessment": "<summary of performance>",
  "strengths": [<key strengths>],
  "areasForImprovement": [<specific areas to improve>],
  "technicalSkills": {
    "assessment": "<technical skills evaluation>",
    "score": <0-10>
  },
  "communication": {
    "assessment": "<communication evaluation>",
    "score": <0-10>
  },
  "problemSolving": {
    "assessment": "<problem-solving evaluation>",
    "score": <0-10>
  },
  "recommendation": "strong-hire|hire|maybe|no-hire",
  "detailedFeedback": "<comprehensive feedback>",
  "nextSteps": [<recommended next steps>]
}

Return ONLY the JSON.`;

        const response = await geminiService.generateConversationalResponse(
            'You are an expert interviewer providing constructive feedback.',
            feedbackPrompt
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const feedback = JSON.parse(jsonMatch[0]);
                return NextResponse.json({
                    success: true,
                    feedback,
                });
            }
        } catch (error) {
            console.error('Error parsing feedback:', error);
        }

        // Fallback
        return NextResponse.json({
            success: true,
            feedback: {
                feedbackId: `feedback_${Date.now()}`,
                overallScore: 7,
                overallAssessment: response,
                strengths: [],
                areasForImprovement: [],
                recommendation: 'maybe',
                detailedFeedback: response,
                nextSteps: [],
            },
        });
    } catch (error) {
        console.error('Error in feedback endpoint:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

import { GeminiService } from '../services/GeminiService';

/**
 * Feedback Generation Endpoint
 * Generates comprehensive feedback based on interview performance
 */

export async function GET() {
    return NextResponse.json({
        message: "Feedback Generation API",
        status: "active",
        version: "1.0",
        description: "Generates interview feedback",
    });
}

export async function POST(request: NextRequest) {
    try {
        const {
            interviewId,
            candidateName,
            role,
            scores = {},
            answers = [],
            overallPerformance,
            notes
        } = await request.json();

        if (!interviewId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Interview ID is required',
                },
                { status: 400 }
            );
        }

        const geminiService = new GeminiService();

        const feedbackPrompt = `Generate comprehensive interview feedback for:

**Interview ID**: ${interviewId}
${candidateName ? `**Candidate**: ${candidateName}` : ''}
${role ? `**Role**: ${role}` : ''}

**Performance Scores**: ${JSON.stringify(scores, null, 2)}

${answers.length > 0 ? `**Interview Responses**: 
${answers.map((a: any, i: number) => `
Question ${i + 1}: ${a.question}
Answer: ${a.answer}
Score: ${a.score}/10
`).join('\n')}` : ''}

${overallPerformance ? `**Overall Performance**: ${overallPerformance}` : ''}

${notes ? `**Additional Notes**: ${notes}` : ''}

Generate detailed feedback in JSON format:
{
  "feedbackId": "<unique-id>",
  "overallScore": <average score>,
  "overallAssessment": "<summary of performance>",
  "strengths": [<key strengths>],
  "areasForImprovement": [<specific areas to improve>],
  "technicalSkills": {
    "assessment": "<technical skills evaluation>",
    "score": <0-10>
  },
  "communication": {
    "assessment": "<communication evaluation>",
    "score": <0-10>
  },
  "problemSolving": {
    "assessment": "<problem-solving evaluation>",
    "score": <0-10>
  },
  "recommendation": "strong-hire|hire|maybe|no-hire",
  "detailedFeedback": "<comprehensive feedback>",
  "nextSteps": [<recommended next steps>]
}

Return ONLY the JSON.`;

        const response = await geminiService.generateConversationalResponse(
            'You are an expert interviewer providing constructive feedback.',
            feedbackPrompt
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const feedback = JSON.parse(jsonMatch[0]);
                return NextResponse.json({
                    success: true,
                    feedback,
                });
            }
        } catch (error) {
            console.error('Error parsing feedback:', error);
        }

        // Fallback
        return NextResponse.json({
            success: true,
            feedback: {
                feedbackId: `feedback_${Date.now()}`,
                overallScore: 7,
                overallAssessment: response,
                strengths: [],
                areasForImprovement: [],
                recommendation: 'maybe',
                detailedFeedback: response,
                nextSteps: [],
            },
        });
    } catch (error) {
        console.error('Error in feedback endpoint:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}



