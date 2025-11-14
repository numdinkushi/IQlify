import { NextRequest, NextResponse } from 'next/server';

/**
 * Interview Evaluation API endpoint
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Interview evaluation endpoint is active',
        timestamp: new Date().toISOString(),
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { interviewId, candidateName, role, scores, answers, overallPerformance, notes } = body;

        if (!interviewId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Interview ID is required',
                },
                { status: 400 }
            );
        }

        console.log('🎯 [EVALUATE] Fetching grading for interview:', interviewId);

        // Try to fetch actual grading from the grading system
        try {
            const gradingResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vapi/grading?callId=${interviewId}`);
            if (gradingResponse.ok) {
                const gradingData = await gradingResponse.json();
                if (gradingData.success && gradingData.gradingResults) {
                    console.log('✅ [EVALUATE] Found stored grading results');
                    return NextResponse.json({
                        success: true,
                        ...gradingData.gradingResults
                    });
                }
            }
        } catch (error) {
            console.warn('⚠️ [EVALUATE] Could not fetch stored grading, returning fallback');
        }

        // FALLBACK: Return failed interview result if no grading found
        console.log('⚠️ [EVALUATE] No grading found, returning failed interview result');
        return NextResponse.json({
            success: true,
            feedbackId: `feedback_${Date.now()}`,
            overallScore: 0, // Failed interview
            overallAssessment: 'Interview could not be evaluated. Please complete a full interview to receive a score.',
            strengths: [],
            areasForImprovement: [
                'Complete the full interview session',
                'Ensure stable internet connection',
                'Respond to all interviewer questions',
                'Provide detailed answers'
            ],
            summary: 'Interview could not be evaluated. A complete interview session is required for evaluation.',
            recommendation: 'no-hire',
            keyHighlights: [],
            isFailedInterview: true
        });

    } catch (error) {
        console.error('Error evaluating interview:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
