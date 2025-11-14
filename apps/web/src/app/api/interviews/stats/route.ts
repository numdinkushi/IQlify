import { NextRequest, NextResponse } from 'next/server';
import { InterviewService } from '@/lib/interview-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get interview statistics
        const interviewService = InterviewService.getInstance();
        const stats = await interviewService.getUserInterviewStats(userId);

        return NextResponse.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error fetching interview stats:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}
