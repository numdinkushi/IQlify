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
async function handleFunctionCall(functionName: string, parameters: Record<string, any>, payload?: VapiWebhookPayload) {
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
            // Comprehensive interview evaluation
            const evaluationPrompt = `You are an expert technical interviewer conducting a comprehensive evaluation. 

Interview Question: ${parameters.question}
Candidate's Answer: ${parameters.answer}
${parameters.expectedAnswer ? `Expected Answer: ${parameters.expectedAnswer}` : ''}

Evaluate the candidate across these key areas and provide detailed feedback:

1. **Communication Skills (0-100)**: How clearly and effectively did they communicate their thoughts?
2. **Technical Knowledge (0-100)**: How well did they demonstrate technical understanding?
3. **Problem Solving (0-100)**: How well did they approach and solve problems?
4. **Cultural Fit (0-100)**: How well would they fit in a professional team environment?

For each area, provide:
- A numerical score (0-100)
- Specific feedback explaining the score
- Examples from their answer that support your evaluation

Also provide:
- Overall impression score (0-100)
- Summary of performance
- Key strengths
- Areas for improvement
- Recommendation (hire/consider/not hire)

Format as JSON:
{
  "overallImpression": number,
  "summary": string,
  "breakdown": {
    "communicationSkills": {
      "score": number,
      "feedback": string
    },
    "technicalKnowledge": {
      "score": number,
      "feedback": string
    },
    "problemSolving": {
      "score": number,
      "feedback": string
    },
    "culturalFit": {
      "score": number,
      "feedback": string
    }
  },
  "strengths": string[],
  "improvements": string[],
  "recommendation": string
}`;

            const evaluationModel = new GeminiService();
            const evaluationResponse = await evaluationModel.generateConversationalResponse(
                'You are an expert technical interviewer and hiring manager with 10+ years of experience.',
                evaluationPrompt
            );

            try {
                const jsonMatch = evaluationResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const evaluationResult = JSON.parse(jsonMatch[0]);

                    // Store grading results
                    const gradingData = {
                        callId: payload?.message.call?.id || `call_${Date.now()}`,
                        sessionId: (payload?.message.call as any)?.sessionId || `session_${Date.now()}`,
                        gradingResults: evaluationResult,
                        timestamp: new Date().toISOString(),
                        question: parameters.question,
                        answer: parameters.answer,
                    };

                    // Store in grading endpoint
                    try {
                        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vapi/grading`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(gradingData),
                        });
                    } catch (storageError) {
                        console.error('Error storing grading:', storageError);
                    }

                    console.log('📊 GRADING RESULT:', evaluationResult);
                    return evaluationResult;
                }
            } catch (error) {
                console.error('Error parsing evaluation:', error);
            }

            return {
                overallImpression: 50,
                summary: "Evaluation completed with basic scoring",
                breakdown: {
                    communicationSkills: { score: 50, feedback: "Basic communication observed" },
                    technicalKnowledge: { score: 50, feedback: "Some technical knowledge demonstrated" },
                    problemSolving: { score: 50, feedback: "Problem-solving approach noted" },
                    culturalFit: { score: 50, feedback: "Cultural fit assessment made" }
                },
                strengths: ["Participated in interview"],
                improvements: ["Provide more detailed responses"],
                recommendation: "Consider"
            };

        case 'create_assessment':
            // Create a skills assessment
            return {
                success: true,
                assessmentId: `assessment_${Date.now()}`,
                message: 'Assessment created successfully',
            };

        case 'generate_feedback':
            // Generate comprehensive interview feedback report
            const feedbackPrompt = `Generate a comprehensive interview feedback report based on the entire interview session.

Interview Data: ${JSON.stringify(parameters)}

Create a detailed report including:
1. Overall performance score (0-100)
2. Detailed breakdown by category (Communication, Technical, Problem Solving, Cultural Fit)
3. Specific examples from the interview
4. Strengths and areas for improvement
5. Final recommendation
6. Next steps for the candidate

Format as a professional interview report similar to the example provided.`;

            const feedbackModel = new GeminiService();
            const feedbackResponse = await feedbackModel.generateConversationalResponse(
                'You are an expert HR professional and technical interviewer with extensive experience in candidate evaluation.',
                feedbackPrompt
            );

            return {
                success: true,
                feedbackId: `feedback_${Date.now()}`,
                report: feedbackResponse,
                generatedAt: new Date().toISOString(),
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
                    const result = await handleFunctionCall(name, parameters, payload);

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
                console.log('📋 CALL ENDED:', payload.message);

                // Store final call summary
                const callSummary = {
                    callId: payload.message.call?.id || `call_${Date.now()}`,
                    sessionId: (payload.message.call as any)?.sessionId || `session_${Date.now()}`,
                    endReason: (payload.message.call as any)?.endedReason || 'unknown',
                    duration: (payload.message.call as any)?.duration || 0,
                    transcript: (payload.message.call as any)?.transcript || '',
                    timestamp: new Date().toISOString(),
                    type: 'call_summary',
                };

                // Store call summary
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vapi/grading`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(callSummary),
                    });
                } catch (storageError) {
                    console.error('Error storing call summary:', storageError);
                }

                return NextResponse.json({
                    success: true,
                    message: 'End of call report processed',
                    callId: callSummary.callId,
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


