import { NextRequest, NextResponse } from 'next/server';

/**
 * Interview Grading Storage and Retrieval
 * 
 * This endpoint handles storing and retrieving interview grading results
 */

// In-memory storage (in production, use a database like PostgreSQL or MongoDB)
const gradingStorage = new Map<string, any>();

/**
 * POST - Store grading results
 */
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

        const id = callId || sessionId;
        const gradingRecord = {
            id,
            callId: callId || null,
            sessionId: sessionId || null,
            gradingResults,
            timestamp: timestamp || new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };

        gradingStorage.set(id, gradingRecord);

        return NextResponse.json({
            success: true,
            message: 'Grading results stored successfully',
            gradingId: id,
        });
    } catch (error) {
        console.error('Error storing grading:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

/**
 * GET - Retrieve grading results
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const callId = searchParams.get('callId');
        const sessionId = searchParams.get('sessionId');
        const gradingId = searchParams.get('gradingId');

        if (!callId && !sessionId && !gradingId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Call ID, Session ID, or Grading ID is required',
                },
                { status: 400 }
            );
        }

        const id = gradingId || callId || sessionId;
        const gradingRecord = gradingStorage.get(id!);

        if (!gradingRecord) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Grading results not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            grading: gradingRecord,
        });
    } catch (error) {
        console.error('Error retrieving grading:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

/**
 * GET - List all grading records (for admin/debugging)
 */
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'list') {
            const allGradings = Array.from(gradingStorage.values());
            return NextResponse.json({
                success: true,
                gradings: allGradings,
                count: allGradings.length,
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Invalid action. Use ?action=list to list all gradings',
            },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error listing gradings:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
