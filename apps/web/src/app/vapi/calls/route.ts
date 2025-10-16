import { NextRequest, NextResponse } from 'next/server';
import { VapiService } from '../services/VapiService';

/**
 * API route to fetch all VAPI calls
 * GET /vapi/calls - Fetch all calls with optional pagination
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');

        console.log(`📞 Fetching VAPI calls (limit: ${limit})...`);

        const vapiService = new VapiService();
        const calls = await vapiService.getAllCalls(limit);

        console.log(`✅ Fetched ${calls.length || 0} calls from VAPI`);

        return NextResponse.json({
            success: true,
            calls: calls,
            pagination: {
                limit,
                total: calls.length || 0
            }
        });

    } catch (error) {
        console.error('❌ Error fetching VAPI calls:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch calls',
            },
            { status: 500 }
        );
    }
}
