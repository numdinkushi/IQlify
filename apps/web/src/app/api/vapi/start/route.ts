import { NextRequest, NextResponse } from 'next/server';
import { InterviewConfiguration } from '@/lib/interview-types';
import { VapiService } from '@/app/vapi/services/VapiService';

export async function POST(request: NextRequest) {
    try {
        const { interviewId, configuration } = await request.json();

        if (!interviewId || !configuration) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        console.log('VAPI Start Request:', { interviewId, configuration });

        // Check if VAPI is configured
        const vapiApiKey = process.env.VAPI_API_KEY;
        if (!vapiApiKey) {
            console.error('VAPI_API_KEY not found in environment variables');
            return NextResponse.json(
                { error: 'VAPI API key not configured' },
                { status: 500 }
            );
        }

        // Use the existing VAPI service with explicit API key
        const vapiService = new VapiService(vapiApiKey);

        // Get assistant ID based on interview type
        const assistantId = getAssistantId(configuration.interviewType);
        console.log('Using assistant ID:', assistantId);

        try {
            // Use the existing VAPI workflow system instead of direct call creation
            const workflowResult = await vapiService.triggerWorkflow({
                assistantId,
                workflowType: 'interview',
                parameters: {
                    interviewId,
                    interviewType: configuration.interviewType,
                    skillLevel: configuration.skillLevel,
                    duration: configuration.duration,
                    userId: interviewId, // Use interviewId as userId for now
                }
            });

            console.log('VAPI workflow triggered successfully:', workflowResult);

            return NextResponse.json({
                success: true,
                callId: workflowResult.workflowId || `workflow_${interviewId}`,
                status: 'triggered',
                workflowResult: workflowResult
            });
        } catch (vapiError) {
            console.error('VAPI workflow error:', vapiError);
            return NextResponse.json(
                {
                    error: 'Failed to trigger VAPI workflow',
                    details: vapiError.message,
                    assistantId: assistantId
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('VAPI start error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
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
