import { NextRequest, NextResponse } from 'next/server';

/**
 * Grading API endpoint - Proxy to the actual grading logic
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const callId = searchParams.get('callId');

        if (!callId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Call ID is required',
                },
                { status: 400 }
            );
        }

        // Import the grading logic from the vapi directory
        const { generateFinalGrading, storeGradingResults } = await import('../../../vapi/grading/route');

        // For now, return a mock response since we don't have stored grading yet
        // In a real implementation, this would fetch from a database
        const mockGradingData = {
            overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
            detailedFeedback: 'Great interview performance! You demonstrated strong technical skills and clear communication.',
            strengths: ['Strong technical knowledge', 'Good communication skills', 'Problem-solving ability'],
            areasForImprovement: ['Practice more coding problems', 'Improve time management'],
            recommendation: 'hire',
            technicalSkills: {
                assessment: 'Strong technical foundation with good problem-solving approach',
                score: 8
            },
            communication: {
                assessment: 'Clear and articulate communication throughout the interview',
                score: 9
            },
            problemSolving: {
                assessment: 'Good analytical thinking and systematic approach to problems',
                score: 8
            }
        };

        return NextResponse.json({
            success: true,
            gradingResults: mockGradingData,
            callId: callId,
        });

    } catch (error) {
        console.error('Error fetching grading results:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const gradingData = await request.json();
        const { callId, sessionId, gradingResults, timestamp } = gradingData;

        if (!callId && !sessionId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Call ID or Session ID is required',
                },
                { status: 400 }
            );
        }

        // Store grading results (in a real implementation, this would save to a database)
        console.log('Storing grading results:', { callId, sessionId, gradingResults });

        return NextResponse.json({
            success: true,
            message: 'Grading results stored successfully',
            gradingId: callId || sessionId,
        });

    } catch (error) {
        console.error('Error storing grading results:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
