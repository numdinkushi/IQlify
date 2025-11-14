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

        // Try to fetch actual grading from stored results via VAPI grading storage
        console.log('🔍 [GRADING] Fetching grading for callId:', callId);

        try {
            const vapiGradingResponse = await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vapi/grading?callId=${callId}`
            );

            if (vapiGradingResponse.ok) {
                const vapiGradingData = await vapiGradingResponse.json();
                if (vapiGradingData.success && vapiGradingData.grading) {
                    console.log('✅ [GRADING] Found stored grading results');
                    return NextResponse.json({
                        success: true,
                        gradingResults: vapiGradingData.grading.gradingResults,
                        callId: callId,
                    });
                }
            }
        } catch (error) {
            console.warn('⚠️ [GRADING] Could not fetch from VAPI grading storage:', error);
        }

        // No stored grading found
        console.log('⚠️ [GRADING] No grading found for callId:', callId);
        return NextResponse.json({
            success: true,
            gradingResults: null,
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
