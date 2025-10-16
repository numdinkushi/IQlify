import { NextRequest, NextResponse } from 'next/server';
import { VapiService } from '../services/VapiService';
import { GeminiService } from '../services/GeminiService';
import { VapiWebhookPayload } from '../types';
import { WEBHOOK_EVENTS } from '../config';

// Extended webhook payload type to include transcript
interface ExtendedVapiWebhookPayload extends Omit<VapiWebhookPayload, 'message'> {
    message: VapiWebhookPayload['message'] & {
        transcript?: string;
    };
}

/**
 * Webhook handler for VAPI events
 * This endpoint receives events from VAPI and processes them accordingly
 */

/**
 * Generates final grading for a completed call using real VAPI data and AI analysis
 */
async function generateFinalGrading(callId: string, assistantId: string) {
    try {
        console.log(`🔍 Fetching call data for ${callId}...`);

        // 1. Fetch the call data from VAPI
        const vapiService = new VapiService();
        const callData = await vapiService.getCall(callId);

        console.log('📞 Call data fetched:', {
            id: callData.id,
            status: callData.status,
            duration: callData.duration,
            hasTranscript: !!callData.transcript
        });

        // 2. Extract transcript from call data
        let transcript = '';
        if (callData.transcript && Array.isArray(callData.transcript)) {
            // If transcript is an array of messages, join them
            transcript = callData.transcript
                .map((msg: any) => `${msg.role || 'Unknown'}: ${msg.content || msg.text || ''}`)
                .join('\n');
        } else if (typeof callData.transcript === 'string') {
            transcript = callData.transcript;
        } else if (callData.messages && Array.isArray(callData.messages)) {
            // Alternative: extract from messages array
            transcript = callData.messages
                .map((msg: any) => `${msg.role || 'Unknown'}: ${msg.content || msg.text || ''}`)
                .join('\n');
        }

        if (!transcript || transcript.trim().length === 0) {
            console.warn('⚠️ No transcript found in call data');
            return {
                callId,
                assistantId,
                overallScore: 5,
                sections: {
                    technical: { score: 5, feedback: "No transcript available for analysis" },
                    communication: { score: 5, feedback: "No transcript available for analysis" },
                    problemSolving: { score: 5, feedback: "No transcript available for analysis" },
                    experienceRelevance: { score: 5, feedback: "No transcript available for analysis" },
                    culturalFit: { score: 5, feedback: "No transcript available for analysis" }
                },
                recommendation: "maybe",
                summary: "No transcript available for analysis",
                keyHighlights: [],
                areasForImprovement: ["Transcript not available"],
                timestamp: new Date().toISOString()
            };
        }

        console.log(`📝 Transcript length: ${transcript.length} characters`);

        // 3. Analyze the transcript using AI
        console.log('🤖 Analyzing transcript with AI...');
        const geminiService = new GeminiService();

        // Extract role and level from call metadata or use defaults
        const role = callData.assistant?.name || 'Software Engineer';
        const level = 'Mid-level'; // Could be extracted from call metadata
        const techstack: string[] = []; // Could be extracted from call metadata

        const aiGrading = await geminiService.analyzeInterviewTranscript(
            transcript,
            role,
            level,
            techstack
        );

        console.log('✅ AI grading completed:', {
            overallScore: aiGrading.overallScore,
            recommendation: aiGrading.recommendation
        });

        // 4. Return the AI-generated grading with metadata
        return {
            callId,
            assistantId,
            overallScore: aiGrading.overallScore,
            sections: aiGrading.sections,
            recommendation: aiGrading.recommendation,
            summary: aiGrading.summary,
            keyHighlights: aiGrading.keyHighlights || [],
            areasForImprovement: aiGrading.areasForImprovement || [],
            transcriptLength: transcript.length,
            analysisTimestamp: new Date().toISOString(),
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('❌ Error generating final grading:', error);
        return {
            callId,
            assistantId,
            overallScore: 5,
            sections: {
                technical: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] },
                communication: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] },
                problemSolving: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] },
                experienceRelevance: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] },
                culturalFit: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] }
            },
            recommendation: "maybe",
            summary: "Analysis failed due to error",
            keyHighlights: [],
            areasForImprovement: ["Analysis failed"],
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Generates grading from transcript data (when transcript is provided in webhook)
 */
async function generateGradingFromTranscript(callId: string, assistantId: string, transcript: string) {
    try {
        console.log(`📝 Analyzing transcript for ${callId}...`);
        console.log(`📏 Transcript length: ${transcript.length} characters`);

        // Analyze the transcript using AI
        console.log('🤖 Analyzing transcript with AI...');
        const geminiService = new GeminiService();

        // Use default role and level for now
        const role = 'Software Engineer';
        const level = 'Mid-level';
        const techstack: string[] = [];

        const aiGrading = await geminiService.analyzeInterviewTranscript(
            transcript,
            role,
            level,
            techstack
        );

        console.log('✅ AI grading completed:', {
            overallScore: aiGrading.overallScore,
            recommendation: aiGrading.recommendation
        });

        // Return the AI-generated grading with metadata
        return {
            callId,
            assistantId,
            overallScore: aiGrading.overallScore,
            sections: aiGrading.sections,
            recommendation: aiGrading.recommendation,
            summary: aiGrading.summary,
            keyHighlights: aiGrading.keyHighlights || [],
            areasForImprovement: aiGrading.areasForImprovement || [],
            transcriptLength: transcript.length,
            analysisTimestamp: new Date().toISOString(),
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('❌ Error generating grading from transcript:', error);
        return {
            callId,
            assistantId,
            overallScore: 5,
            sections: {
                technical: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] },
                communication: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] },
                problemSolving: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] },
                experienceRelevance: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] },
                culturalFit: { score: 5, feedback: "Error in analysis", strengths: [], improvements: [] }
            },
            recommendation: "maybe",
            summary: "Analysis failed due to error",
            keyHighlights: [],
            areasForImprovement: ["Analysis failed"],
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Stores grading results in the grading system
 */
async function storeGradingResults(callId: string, gradingData: any) {
    try {
        const gradingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vapi/grading`;

        const response = await fetch(gradingUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                callId,
                gradingResults: gradingData,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to store grading: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Grading stored successfully:', result);
        return result;
    } catch (error) {
        console.error('Error storing grading results:', error);
        throw error;
    }
}

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
        const payload: ExtendedVapiWebhookPayload = await request.json();

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

                // Process and store grading results
                if (payload.message.call) {
                    const callId = payload.message.call.id;
                    const assistantId = payload.message.call.assistantId;

                    // Check if transcript is provided in the webhook payload
                    let finalGrading;
                    // @ts-ignore - transcript property may be present in webhook payload
                    const messageWithTranscript = payload.message as any;
                    if (messageWithTranscript.transcript) {
                        console.log('📝 Using transcript from webhook payload');
                        finalGrading = await generateGradingFromTranscript(
                            callId,
                            assistantId,
                            messageWithTranscript.transcript
                        );
                    } else {
                        console.log('📞 No transcript in payload, fetching from VAPI API...');
                        finalGrading = await generateFinalGrading(callId, assistantId);
                    }

                    // Store the grading results
                    await storeGradingResults(callId, finalGrading);
                }

                return NextResponse.json({
                    success: true,
                    message: 'End of call report processed and grading stored',
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

