import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    console.log('🌐 [SERVER] Web call endpoint - no server-side call needed');

    // For web calls, we don't need server-side processing
    // The VAPI Web SDK handles everything client-side
    return NextResponse.json({
        success: true,
        message: 'Web call - handled client-side',
        callType: 'web'
    });
}

