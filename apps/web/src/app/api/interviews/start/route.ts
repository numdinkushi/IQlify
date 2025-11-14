import { NextRequest, NextResponse } from 'next/server';
import { InterviewService } from '@/lib/interview-service';
import { InterviewConfiguration } from '@/lib/interview-types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, configuration } = body;

        // Validate required fields
        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        if (!configuration) {
            return NextResponse.json(
                { success: false, error: 'Interview configuration is required' },
                { status: 400 }
            );
        }

        // Validate configuration
        const { skillLevel, interviewType, duration, preparationTime } = configuration;
        if (!skillLevel || !interviewType || !duration || !preparationTime) {
            return NextResponse.json(
                { success: false, error: 'Invalid interview configuration' },
                { status: 400 }
            );
        }

        // Start interview session
        const interviewService = InterviewService.getInstance();
        const session = await interviewService.startInterview(userId, configuration);

        return NextResponse.json({
            success: true,
            data: session
        });

    } catch (error) {
        console.error('Error starting interview:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}
