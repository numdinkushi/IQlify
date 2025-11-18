import { NextRequest, NextResponse } from 'next/server';
import { VapiService } from '@/app/vapi/services/VapiService';

/**
 * GET - Fetch VAPI call data by call ID
 * This endpoint is used to retrieve call data including transcript for grading
 */
/**
 * Validates if a string is a valid UUID format
 */
function isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

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

        // Validate that callId is a valid UUID format (VAPI requires UUIDs)
        if (!isValidUUID(callId)) {
            console.warn('⚠️ [VAPI] Invalid call ID format (not a UUID):', callId);
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid call ID format. Expected UUID, got: ${callId.substring(0, 20)}...`,
                    details: 'VAPI requires call IDs to be in UUID format. This call ID appears to be a fallback timestamp-based ID.',
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

