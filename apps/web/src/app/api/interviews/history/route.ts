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

        // Get interview history
        const interviewService = InterviewService.getInstance();
        const history = await interviewService.getInterviewHistory(userId);

        return NextResponse.json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Error fetching interview history:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}
