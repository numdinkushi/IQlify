import { NextRequest, NextResponse } from 'next/server';
import { VapiService } from '../services/VapiService';

/**
 * Assistant Management Endpoint
 * Manages VAPI assistants - get, update, configure
 */

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const assistantId = searchParams.get('assistantId');

        if (!assistantId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID is required',
                },
                { status: 400 }
            );
        }

        const vapiService = new VapiService();
        const assistant = await vapiService.getAssistant(assistantId);

        return NextResponse.json({
            success: true,
            assistant,
        });
    } catch (error) {
        console.error('Error fetching assistant:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

/**
 * PATCH - Update assistant configuration
 */
export async function PATCH(request: NextRequest) {
    try {
        const { assistantId, updates } = await request.json();

        if (!assistantId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID is required',
                },
                { status: 400 }
            );
        }

        const vapiService = new VapiService();
        const updatedAssistant = await vapiService.updateAssistant(assistantId, updates);

        return NextResponse.json({
            success: true,
            assistant: updatedAssistant,
        });
    } catch (error) {
        console.error('Error updating assistant:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

/**
 * POST - Setup webhook for assistant
 */
export async function POST(request: NextRequest) {
    try {
        const { assistantId, webhookUrl, webhookSecret } = await request.json();

        if (!assistantId || !webhookUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID and webhook URL are required',
                },
                { status: 400 }
            );
        }

        // Validate webhook URL for external access
        if (webhookUrl.includes('localhost') || webhookUrl.includes('127.0.0.1')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Webhook URL must be externally accessible (not localhost)',
                    suggestion: 'Use a tunneling service like ngrok, cloudflare tunnel, or deploy to a public server',
                },
                { status: 400 }
            );
        }

        const vapiService = new VapiService();
        const updatedAssistant = await vapiService.setupWebhook(
            assistantId,
            webhookUrl,
            webhookSecret
        );

        return NextResponse.json({
            success: true,
            message: 'Webhook configured successfully',
            assistant: updatedAssistant,
        });
    } catch (error) {
        console.error('Error setting up webhook:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}