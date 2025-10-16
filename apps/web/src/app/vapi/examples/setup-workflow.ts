/**
 * Example: Setting up a workflow for your VAPI assistant
 * 
 * This script demonstrates how to connect your VAPI assistant to an interview workflow.
 * Run this after deploying your application to set up the workflow.
 */

const ASSISTANT_ID = "0b058f17-55aa-4636-ad06-445287514862"; // Your assistant ID
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function setupInterviewWorkflow() {
    console.log('🚀 Setting up interview workflow...');

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/workflow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assistantId: ASSISTANT_ID,
                workflowType: 'interview',
                parameters: {
                    defaultLevel: 'mid',
                    defaultAmount: 5,
                },
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Workflow setup successful!');
            console.log('📋 Workflow ID:', result.workflowId);
            console.log('🔧 Tools added:', result.data.tools.length);
            console.log('\nYour assistant now has the following capabilities:');
            result.data.tools.forEach((tool: any) => {
                console.log(`  - ${tool.function.name}: ${tool.function.description}`);
            });
        } else {
            console.error('❌ Workflow setup failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error setting up workflow:', error);
    }
}

async function setupWebhook() {
    console.log('\n🔗 Setting up webhook...');

    try {
        const webhookUrl = `${API_BASE_URL}/vapi/webhook`;

        const response = await fetch(`${API_BASE_URL}/vapi/assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assistantId: ASSISTANT_ID,
                webhookUrl,
                webhookSecret: process.env.VAPI_WEBHOOK_SECRET,
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Webhook setup successful!');
            console.log('🔗 Webhook URL:', webhookUrl);
            console.log('\nYour assistant will now send events to this webhook.');
        } else {
            console.error('❌ Webhook setup failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error setting up webhook:', error);
    }
}

// Run the setup
async function main() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  VAPI Workflow Setup for IQlify       ║');
    console.log('╚════════════════════════════════════════╝\n');

    await setupInterviewWorkflow();
    await setupWebhook();

    console.log('\n✨ Setup complete! Your assistant is ready to conduct interviews.');
    console.log('\n📝 Next steps:');
    console.log('1. Test your assistant in the VAPI dashboard');
    console.log('2. Make a test call to verify the workflow');
    console.log('3. Check the webhook endpoint is receiving events');
}

// Uncomment to run:
// main();

export { setupInterviewWorkflow, setupWebhook };

 * Example: Setting up a workflow for your VAPI assistant
 * 
 * This script demonstrates how to connect your VAPI assistant to an interview workflow.
 * Run this after deploying your application to set up the workflow.
 */

const ASSISTANT_ID = "0b058f17-55aa-4636-ad06-445287514862"; // Your assistant ID
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function setupInterviewWorkflow() {
    console.log('🚀 Setting up interview workflow...');

    try {
        const response = await fetch(`${API_BASE_URL}/vapi/workflow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assistantId: ASSISTANT_ID,
                workflowType: 'interview',
                parameters: {
                    defaultLevel: 'mid',
                    defaultAmount: 5,
                },
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Workflow setup successful!');
            console.log('📋 Workflow ID:', result.workflowId);
            console.log('🔧 Tools added:', result.data.tools.length);
            console.log('\nYour assistant now has the following capabilities:');
            result.data.tools.forEach((tool: any) => {
                console.log(`  - ${tool.function.name}: ${tool.function.description}`);
            });
        } else {
            console.error('❌ Workflow setup failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error setting up workflow:', error);
    }
}

async function setupWebhook() {
    console.log('\n🔗 Setting up webhook...');

    try {
        const webhookUrl = `${API_BASE_URL}/vapi/webhook`;

        const response = await fetch(`${API_BASE_URL}/vapi/assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assistantId: ASSISTANT_ID,
                webhookUrl,
                webhookSecret: process.env.VAPI_WEBHOOK_SECRET,
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Webhook setup successful!');
            console.log('🔗 Webhook URL:', webhookUrl);
            console.log('\nYour assistant will now send events to this webhook.');
        } else {
            console.error('❌ Webhook setup failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Error setting up webhook:', error);
    }
}

// Run the setup
async function main() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  VAPI Workflow Setup for IQlify       ║');
    console.log('╚════════════════════════════════════════╝\n');

    await setupInterviewWorkflow();
    await setupWebhook();

    console.log('\n✨ Setup complete! Your assistant is ready to conduct interviews.');
    console.log('\n📝 Next steps:');
    console.log('1. Test your assistant in the VAPI dashboard');
    console.log('2. Make a test call to verify the workflow');
    console.log('3. Check the webhook endpoint is receiving events');
}

// Uncomment to run:
// main();

export { setupInterviewWorkflow, setupWebhook };



