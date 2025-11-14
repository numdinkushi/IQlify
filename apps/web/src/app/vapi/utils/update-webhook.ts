import { VapiService } from '../services/VapiService';

/**
 * Utility to update VAPI assistant webhook URL
 * Call this whenever your tunnel URL changes
 */
export async function updateVapiWebhook(
    assistantId: string,
    webhookUrl?: string
): Promise<{ success: boolean; message: string; }> {
    try {
        const vapiService = new VapiService();

        // Use provided URL or get from environment
        const url = webhookUrl || process.env.NEXT_PUBLIC_WEBHOOK_URL;

        if (!url) {
            return {
                success: false,
                message: 'No webhook URL provided and NEXT_PUBLIC_WEBHOOK_URL not set'
            };
        }

        // Ensure URL ends with /vapi/webhook
        const webhookEndpoint = url.endsWith('/vapi/webhook')
            ? url
            : `${url}/vapi/webhook`;

        // Update the assistant with new webhook URL
        await vapiService.setupWebhook(assistantId, webhookEndpoint);

        return {
            success: true,
            message: `Webhook URL updated to: ${webhookEndpoint}`
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to update webhook: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}

/**
 * CLI helper to update webhook URL
 * Usage: node update-webhook.js <assistant-id> [webhook-url]
 */
if (require.main === module) {
    const assistantId = process.argv[2];
    const webhookUrl = process.argv[3];

    if (!assistantId) {
        console.error('Usage: node update-webhook.js <assistant-id> [webhook-url]');
        process.exit(1);
    }

    updateVapiWebhook(assistantId, webhookUrl)
        .then(result => {
            console.log(result.message);
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('Error:', error.message);
            process.exit(1);
        });
}
