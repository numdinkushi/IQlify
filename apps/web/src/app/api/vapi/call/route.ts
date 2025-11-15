import { NextRequest, NextResponse } from 'next/server';
import { VapiService } from '@/app/vapi/services/VapiService';

/**
 * GET - Fetch VAPI call data by call ID
 * This endpoint is used to retrieve call data including transcript for grading
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

        const vapiService = new VapiService();
        const callData = await vapiService.getCall(callId);

        return NextResponse.json({
            success: true,
            callData,
        });
    } catch (error) {
        console.error('Error fetching VAPI call:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

