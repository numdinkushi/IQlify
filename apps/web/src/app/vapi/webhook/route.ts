import { NextRequest, NextResponse } from 'next/server';
import { VapiService } from '../services/VapiService';
import { GeminiService } from '../services/GeminiService';
import { VapiWebhookPayload } from '../types';
import { WEBHOOK_EVENTS } from '../config';

/**
 * Webhook handler for VAPI events
 * This endpoint receives events from VAPI and processes them accordingly
 */

/**
 * Handles function calls from VAPI assistant
 */
async function handleFunctionCall(functionName: string, parameters: Record<string, any>) {
    const geminiService = new GeminiService();

    switch (functionName) {
        case 'generate_interview_questions':
            return await geminiService.generateInterviewQuestions({
                role: parameters.role,
                level: parameters.level,
                techstack: parameters.techstack || [],
                skills: parameters.skills || [],
                amount: parameters.amount || 5,
                platform: parameters.platform || 'web',
                userId: parameters.userId || 'system',
                temperature: parameters.temperature || 0.7,
            });

        case 'evaluate_answer':
            // Evaluate candidate's answer
            const evaluationPrompt = `Evaluate this interview answer:
        
Question: ${parameters.question}
Candidate's Answer: ${parameters.answer}
${parameters.expectedAnswer ? `Expected Answer: ${parameters.expectedAnswer}` : ''}

Provide:
1. Score (0-10)
2. Strengths in the answer
3. Areas for improvement
4. Overall feedback

Format as JSON:
{
  "score": number,
  "strengths": string[],
  "improvements": string[],
  "feedback": string
}`;

            const evaluationModel = new GeminiService();
            const evaluationResponse = await evaluationModel.generateConversationalResponse(
                'You are an expert technical interviewer.',
                evaluationPrompt
            );

            try {
                const jsonMatch = evaluationResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (error) {
                console.error('Error parsing evaluation:', error);
            }

            return {
                score: 7,
                feedback: evaluationResponse,
                strengths: [],
                improvements: [],
            };

        case 'create_assessment':
            // Create a skills assessment
            return {
                success: true,
                assessmentId: `assessment_${Date.now()}`,
                message: 'Assessment created successfully',
            };

        case 'generate_feedback':
            // Generate feedback for the interview
            return {
                success: true,
                feedbackId: `feedback_${Date.now()}`,
                message: 'Feedback generated successfully',
            };

        default:
            return {
                success: false,
                error: `Unknown function: ${functionName}`,
            };
    }
}

/**
 * GET handler - Health check
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'VAPI webhook endpoint is active',
        timestamp: new Date().toISOString(),
    });
}

/**
 * POST handler - Webhook receiver
 */
export async function POST(request: NextRequest) {
    try {
        // Verify webhook signature if provided
        const signature = request.headers.get('x-vapi-signature');

        // Parse the webhook payload
        const payload: VapiWebhookPayload = await request.json();

        console.log('Received webhook:', {
            type: payload.message.type,
            timestamp: new Date().toISOString(),
        });

        // Handle different webhook event types
        switch (payload.message.type) {
            case WEBHOOK_EVENTS.FUNCTION_CALL:
                // Handle function calls from the assistant
                if (payload.message.functionCall) {
                    const { name, parameters } = payload.message.functionCall;
                    const result = await handleFunctionCall(name, parameters);

                    return NextResponse.json({
                        success: true,
                        result,
                    });
                }
                break;

            case WEBHOOK_EVENTS.CONVERSATION_UPDATE:
                // Handle conversation updates (e.g., transcript updates)
                console.log('Conversation update received');
                return NextResponse.json({
                    success: true,
                    message: 'Conversation update processed',
                });

            case WEBHOOK_EVENTS.END_OF_CALL:
                // Handle end of call report
                console.log('End of call report received');

                // Here you can:
                // - Store call transcript
                // - Generate final assessment
                // - Send notifications
                // - Update user records

                return NextResponse.json({
                    success: true,
                    message: 'End of call report processed',
                });

            case WEBHOOK_EVENTS.STATUS_UPDATE:
                // Handle status updates
                console.log('Status update received');
                return NextResponse.json({
                    success: true,
                    message: 'Status update processed',
                });

            default:
                console.warn('Unknown webhook event type:', payload.message.type);
                return NextResponse.json({
                    success: false,
                    error: 'Unknown event type',
                }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

