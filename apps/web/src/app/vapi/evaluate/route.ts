import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '../services/GeminiService';

/**
 * Answer Evaluation Endpoint
 * Evaluates candidate answers during interviews
 */

export async function GET() {
    return NextResponse.json({
        message: "Answer Evaluation API",
        status: "active",
        version: "1.0",
        description: "Evaluates candidate interview answers",
    });
}

export async function POST(request: NextRequest) {
    try {
        const { question, answer, expectedAnswer, context } = await request.json();

        if (!question || !answer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Question and answer are required',
                },
                { status: 400 }
            );
        }

        const geminiService = new GeminiService();

        const evaluationPrompt = `You are an expert technical interviewer. Evaluate this interview answer:
        
**Question**: ${question}

**Candidate's Answer**: ${answer}

${expectedAnswer ? `**Expected Answer Guidelines**: ${expectedAnswer}` : ''}

${context ? `**Interview Context**: ${context}` : ''}

Provide a comprehensive evaluation in JSON format:
{
  "score": <number 0-10>,
  "strengths": [<list of strengths in the answer>],
  "weaknesses": [<list of areas for improvement>],
  "feedback": "<overall constructive feedback>",
  "technicalAccuracy": <number 0-10>,
  "clarity": <number 0-10>,
  "depth": <number 0-10>,
  "suggestions": [<specific suggestions for improvement>]
}

Return ONLY the JSON, no additional text.`;

        const evaluationResponse = await geminiService.generateConversationalResponse(
            'You are an expert technical interviewer evaluating candidate responses.',
            evaluationPrompt
        );

        // Parse the JSON response
        try {
            const jsonMatch = evaluationResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const evaluation = JSON.parse(jsonMatch[0]);
                return NextResponse.json({
                    success: true,
                    evaluation,
                });
            }
        } catch (error) {
            console.error('Error parsing evaluation:', error);
        }

        // Fallback if JSON parsing fails
        return NextResponse.json({
            success: true,
            evaluation: {
                score: 7,
                feedback: evaluationResponse,
                strengths: [],
                weaknesses: [],
                technicalAccuracy: 7,
                clarity: 7,
                depth: 7,
                suggestions: [],
            },
        });
    } catch (error) {
        console.error('Error in evaluate endpoint:', error);
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
 * Answer Evaluation Endpoint
 * Evaluates candidate answers during interviews
 */

export async function GET() {
    return NextResponse.json({
        message: "Answer Evaluation API",
        status: "active",
        version: "1.0",
        description: "Evaluates candidate interview answers",
    });
}

export async function POST(request: NextRequest) {
    try {
        const { question, answer, expectedAnswer, context } = await request.json();

        if (!question || !answer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Question and answer are required',
                },
                { status: 400 }
            );
        }

        const geminiService = new GeminiService();

        const evaluationPrompt = `You are an expert technical interviewer. Evaluate this interview answer:
        
**Question**: ${question}

**Candidate's Answer**: ${answer}

${expectedAnswer ? `**Expected Answer Guidelines**: ${expectedAnswer}` : ''}

${context ? `**Interview Context**: ${context}` : ''}

Provide a comprehensive evaluation in JSON format:
{
  "score": <number 0-10>,
  "strengths": [<list of strengths in the answer>],
  "weaknesses": [<list of areas for improvement>],
  "feedback": "<overall constructive feedback>",
  "technicalAccuracy": <number 0-10>,
  "clarity": <number 0-10>,
  "depth": <number 0-10>,
  "suggestions": [<specific suggestions for improvement>]
}

Return ONLY the JSON, no additional text.`;

        const evaluationResponse = await geminiService.generateConversationalResponse(
            'You are an expert technical interviewer evaluating candidate responses.',
            evaluationPrompt
        );

        // Parse the JSON response
        try {
            const jsonMatch = evaluationResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const evaluation = JSON.parse(jsonMatch[0]);
                return NextResponse.json({
                    success: true,
                    evaluation,
                });
            }
        } catch (error) {
            console.error('Error parsing evaluation:', error);
        }

        // Fallback if JSON parsing fails
        return NextResponse.json({
            success: true,
            evaluation: {
                score: 7,
                feedback: evaluationResponse,
                strengths: [],
                weaknesses: [],
                technicalAccuracy: 7,
                clarity: 7,
                depth: 7,
                suggestions: [],
            },
        });
    } catch (error) {
        console.error('Error in evaluate endpoint:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}



