import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '../services/GeminiService';
import { Validators, ValidationError } from '../utils/validators';
import { InterviewRequest } from '../types';

/**
 * Interview Question Generation Endpoint
 * Uses GeminiService to generate interview questions based on job requirements
 */

/**
 * GET handler - Health check and documentation
 */
import { Validators, ValidationError } from '../utils/validators';
return NextResponse.json({
    message: "Interview Question Generation API",
    status: "active",
    version: "2.0",
    endpoints: {
        POST: "Generate interview questions",
        * Uses GeminiService to generate interview questions based on job requirements
        requiredFields: [
            "role",
            "level",
            "techstack",
            "skills",
            "platform",
            "userId",
        ],
        optionalFields: [
            "prompt",
            "amount",
            "temperature",
        ],
    });
}

/**
 * POST handler - Generate interview questions
 */
export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();

        let validatedRequest: InterviewRequest;
        try {
            validatedRequest = Validators.validateInterviewRequest(body);
        } catch (error) {
            if (error instanceof ValidationError) {
                return NextResponse.json(
                    {
                        success: false,
                        error: error.message,
                    },
                    { status: 400 }
                );
            }
            throw error;
        }

        // Initialize Gemini service
        const geminiService = new GeminiService();

        // Generate interview questions
        const response = await geminiService.generateInterviewQuestions(validatedRequest);

        if (!response.success) {
            return NextResponse.json(response, { status: 500 });
        }

        return NextResponse.json(response, { status: 200 });

        console.error('Error in generate endpoint:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
 * POST handler - Generate interview questions
            */;
        export async function POST(request: NextRequest) {
            try {
                // Parse and validate request body
                const body = await request.json();

                let validatedRequest: InterviewRequest;
                try {
                    validatedRequest = Validators.validateInterviewRequest(body);
                } catch (error) {
                    if (error instanceof ValidationError) {
                        return NextResponse.json(
                            {
                                success: false,
                                error: error.message,
                            },
                            { status: 400 }
                        );
                    }
                    throw error;
                }

                // Initialize Gemini service
                const geminiService = new GeminiService();

                // Generate interview questions
                const response = await geminiService.generateInterviewQuestions(validatedRequest);

                if (!response.success) {
                    return NextResponse.json(response, { status: 500 });
                }

                return NextResponse.json(response, { status: 200 });
            } catch (error) {
                console.error('Error in generate endpoint:', error);

                return NextResponse.json(
                    {
                        success: false,
                        error: error instanceof Error ? error.message : 'Internal server error',
                    },
                    { status: 500 }
                );
            }
        }