import { NextRequest, NextResponse } from 'next/server';
import { InterviewService } from '@/lib/interview-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, score, feedback, earnings } = body;

        // Validate required fields
        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: 'Session ID is required' },
                { status: 400 }
            );
        }

        if (typeof score !== 'number' || score < 0 || score > 100) {
            return NextResponse.json(
                { success: false, error: 'Valid score (0-100) is required' },
                { status: 400 }
            );
        }

        if (typeof earnings !== 'number' || earnings < 0) {
            return NextResponse.json(
                { success: false, error: 'Valid earnings amount is required' },
                { status: 400 }
            );
        }

        // Complete interview session
        const interviewService = InterviewService.getInstance();
        await interviewService.completeInterview(sessionId, {
            sessionId,
            score,
            feedback: feedback || '',
            earnings,
            completedAt: Date.now()
        });

        return NextResponse.json({
            success: true,
            message: 'Interview completed successfully'
        });

    } catch (error) {
        console.error('Error completing interview:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}
