import { NextRequest, NextResponse } from 'next/server';
import { InterviewConfiguration } from '@/lib/interview-types';

export async function POST(request: NextRequest) {
    try {
        const { interviewId, configuration } = await request.json();

        if (!interviewId || !configuration) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Get VAPI API key from environment
        const vapiApiKey = process.env.VAPI_API_KEY;
        if (!vapiApiKey) {
            return NextResponse.json(
                { error: 'VAPI API key not configured' },
                { status: 500 }
            );
        }

        // Get assistant ID based on interview type
        const assistantId = getAssistantId(configuration.interviewType);

        // Create VAPI call
        const vapiResponse = await fetch('https://api.vapi.ai/call', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${vapiApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assistantId,
                customer: {
                    number: '+1234567890', // This would be the user's phone number in a real implementation
                },
                // Add interview context
                context: {
                    interviewId,
                    interviewType: configuration.interviewType,
                    skillLevel: configuration.skillLevel,
                    duration: configuration.duration,
                },
                // Webhook URL for call events
                webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/webhook`,
            }),
        });

        if (!vapiResponse.ok) {
            const errorData = await vapiResponse.json();
            console.error('VAPI API error:', errorData);
            return NextResponse.json(
                { error: 'Failed to create VAPI call' },
                { status: 500 }
            );
        }

        const callData = await vapiResponse.json();

        return NextResponse.json({
            success: true,
            callId: callData.id,
            status: callData.status,
        });

    } catch (error) {
        console.error('VAPI start error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function getAssistantId(interviewType: string): string {
    const assistantMap: Record<string, string> = {
        'technical': process.env.VAPI_TECHNICAL_ASSISTANT_ID || 'default-technical',
        'soft_skills': process.env.VAPI_SOFT_SKILLS_ASSISTANT_ID || 'default-soft-skills',
        'behavioral': process.env.VAPI_BEHAVIORAL_ASSISTANT_ID || 'default-behavioral',
        'system_design': process.env.VAPI_SYSTEM_DESIGN_ASSISTANT_ID || 'default-system-design',
    };

    return assistantMap[interviewType] || 'default';
}
