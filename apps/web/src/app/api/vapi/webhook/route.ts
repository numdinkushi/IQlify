import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('VAPI Webhook received:', body);

        const { type, data } = body;

        switch (type) {
            case 'call-started':
                await handleCallStarted(data);
                break;

            case 'call-ended':
                await handleCallEnded(data);
                break;

            case 'transcript':
                await handleTranscript(data);
                break;

            case 'function-call':
                await handleFunctionCall(data);
                break;

            case 'call-analysis':
                await handleCallAnalysis(data);
                break;

            default:
                console.log('Unknown VAPI event type:', type);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('VAPI webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handleCallStarted(data: any) {
    console.log('Call started:', data);

    // Update interview status to in_progress
    if (data.callId) {
        try {
            await convex.mutation(api.interviews.updateInterview, {
                interviewId: data.callId as any, // Assuming callId maps to interviewId
                status: 'in_progress'
            });
        } catch (error) {
            console.error('Failed to update interview status:', error);
        }
    }
}

async function handleCallEnded(data: any) {
    console.log('Call ended:', data);

    // The call has ended, but we might not have the analysis yet
    // We'll wait for the call-analysis event for scoring
}

async function handleTranscript(data: any) {
    console.log('Transcript received:', data);

    // Store transcript if needed
    // For now, we'll just log it
}

async function handleFunctionCall(data: any) {
    console.log('Function call received:', data);

    // Handle any function calls during the interview
}

async function handleCallAnalysis(data: any) {
    console.log('Call analysis received:', data);

    // This is where we get the actual interview results
    const { callId, score, feedback, transcript } = data;

    if (callId) {
        try {
            // Calculate earnings based on score
            const earnings = calculateEarnings(score, data.interviewType, data.skillLevel);

            // Update interview with results
            await convex.mutation(api.interviews.updateInterview, {
                interviewId: callId as any,
                status: 'completed',
                score: Math.round(score),
                feedback: feedback || 'Interview completed successfully',
                earnings: earnings,
                completedAt: Date.now()
            });

            // Update user stats
            await convex.mutation(api.interviews.updateUserStatsAfterInterview, {
                userId: data.userId as any,
                score: Math.round(score),
                earnings: earnings
            });

            console.log('Interview completed successfully:', { callId, score, earnings });
        } catch (error) {
            console.error('Failed to process interview completion:', error);
        }
    }
}

function calculateEarnings(score: number, interviewType?: string, skillLevel?: string): number {
    let baseReward = 0.2;

    // Adjust based on interview type
    if (interviewType === 'technical') baseReward = 0.2;
    else if (interviewType === 'soft_skills') baseReward = 0.15;
    else if (interviewType === 'behavioral') baseReward = 0.1;
    else if (interviewType === 'system_design') baseReward = 0.3;

    // Adjust based on skill level
    if (skillLevel === 'intermediate') baseReward *= 1.5;
    else if (skillLevel === 'advanced') baseReward *= 2.0;

    // Adjust based on score
    if (score >= 90) baseReward += 0.3;
    else if (score >= 80) baseReward += 0.2;
    else if (score >= 70) baseReward += 0.1;

    return Math.round(baseReward * 100) / 100;
}
