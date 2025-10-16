import { NextRequest, NextResponse } from 'next/server';
import { VapiService } from '../services/VapiService';
import { WorkflowTriggerRequest } from '../types';

/**
 * Workflow Trigger Endpoint
 * Triggers and manages VAPI workflows for assistants
 */

export async function GET() {
    return NextResponse.json({
        message: "VAPI Workflow Management API",
        status: "active",
        version: "1.0",
        description: "Triggers and manages workflows for VAPI assistants",
        supportedWorkflows: ['interview', 'assessment', 'feedback'],
    });
}

/**
 * POST - Trigger a workflow
 */
export async function POST(request: NextRequest) {
    try {
        const body: WorkflowTriggerRequest = await request.json();
        const { assistantId, workflowType, parameters } = body;

        // Validate required fields
        if (!assistantId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID is required',
                },
                { status: 400 }
            );
        }

        if (!workflowType) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Workflow type is required',
                },
                { status: 400 }
            );
        }

        const validWorkflows = ['interview', 'assessment', 'feedback'];
        if (!validWorkflows.includes(workflowType)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid workflow type. Must be one of: ${validWorkflows.join(', ')}`,
                },
                { status: 400 }
            );
        }

        // Initialize VAPI service
        const vapiService = new VapiService();

        // Trigger the workflow
        const result = await vapiService.triggerWorkflow({
            assistantId,
            workflowType,
            parameters: parameters || {},
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in workflow endpoint:', error);
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
 * PUT - Update a workflow
 */
export async function PUT(request: NextRequest) {
    try {
        const { assistantId, workflowId, updates } = await request.json();

        if (!assistantId || !workflowId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID and Workflow ID are required',
                },
                { status: 400 }
            );
        }

        // Here you would implement workflow update logic
        // For now, return a success response
        return NextResponse.json({
            success: true,
            message: 'Workflow updated successfully',
            workflowId,
        });
    } catch (error) {
        console.error('Error updating workflow:', error);
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
 * DELETE - Remove a workflow
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const assistantId = searchParams.get('assistantId');
        const workflowId = searchParams.get('workflowId');

        if (!assistantId || !workflowId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID and Workflow ID are required',
                },
                { status: 400 }
            );
        }

        // Here you would implement workflow removal logic
        return NextResponse.json({
            success: true,
            message: 'Workflow removed successfully',
            workflowId,
        });
    } catch (error) {
        console.error('Error removing workflow:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

import { VapiService } from '../services/VapiService';
import { WorkflowTriggerRequest } from '../types';

/**
 * Workflow Trigger Endpoint
 * Triggers and manages VAPI workflows for assistants
 */

export async function GET() {
    return NextResponse.json({
        message: "VAPI Workflow Management API",
        status: "active",
        version: "1.0",
        description: "Triggers and manages workflows for VAPI assistants",
        supportedWorkflows: ['interview', 'assessment', 'feedback'],
    });
}

/**
 * POST - Trigger a workflow
 */
export async function POST(request: NextRequest) {
    try {
        const body: WorkflowTriggerRequest = await request.json();
        const { assistantId, workflowType, parameters } = body;

        // Validate required fields
        if (!assistantId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID is required',
                },
                { status: 400 }
            );
        }

        if (!workflowType) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Workflow type is required',
                },
                { status: 400 }
            );
        }

        const validWorkflows = ['interview', 'assessment', 'feedback'];
        if (!validWorkflows.includes(workflowType)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid workflow type. Must be one of: ${validWorkflows.join(', ')}`,
                },
                { status: 400 }
            );
        }

        // Initialize VAPI service
        const vapiService = new VapiService();

        // Trigger the workflow
        const result = await vapiService.triggerWorkflow({
            assistantId,
            workflowType,
            parameters: parameters || {},
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in workflow endpoint:', error);
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
 * PUT - Update a workflow
 */
export async function PUT(request: NextRequest) {
    try {
        const { assistantId, workflowId, updates } = await request.json();

        if (!assistantId || !workflowId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID and Workflow ID are required',
                },
                { status: 400 }
            );
        }

        // Here you would implement workflow update logic
        // For now, return a success response
        return NextResponse.json({
            success: true,
            message: 'Workflow updated successfully',
            workflowId,
        });
    } catch (error) {
        console.error('Error updating workflow:', error);
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
 * DELETE - Remove a workflow
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const assistantId = searchParams.get('assistantId');
        const workflowId = searchParams.get('workflowId');

        if (!assistantId || !workflowId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Assistant ID and Workflow ID are required',
                },
                { status: 400 }
            );
        }

        // Here you would implement workflow removal logic
        return NextResponse.json({
            success: true,
            message: 'Workflow removed successfully',
            workflowId,
        });
    } catch (error) {
        console.error('Error removing workflow:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}



