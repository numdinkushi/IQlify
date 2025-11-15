import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/app/vapi/services/GeminiService';

/**
 * POST - Analyze interview transcript using Gemini AI
 * This endpoint analyzes an interview transcript and returns grading results
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { transcript, role, level, techstack } = body;

        if (!transcript || typeof transcript !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Transcript is required',
                },
                { status: 400 }
            );
        }

        const geminiService = new GeminiService();
        const aiGrading = await geminiService.analyzeInterviewTranscript(
            transcript,
            role || 'Software Engineer',
            level || 'Mid-level',
            techstack || []
        );

        return NextResponse.json({
            success: true,
            grading: aiGrading,
        });
    } catch (error) {
        console.error('Error analyzing transcript:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

