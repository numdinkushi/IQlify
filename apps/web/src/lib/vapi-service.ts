import { InterviewConfiguration } from './interview-types';

export interface VapiCallConfig {
    assistantId: string;
    onCallStart?: () => void;
    onCallEnd?: () => void;
    onError?: (error: any) => void;
    onMessage?: (message: any) => void;
}

export class VapiService {
    private static instance: VapiService;
    private currentCall: any = null;

    private constructor() { }

    public static getInstance(): VapiService {
        if (!VapiService.instance) {
            VapiService.instance = new VapiService();
        }
        return VapiService.instance;
    }

    /**
     * Start a VAPI call with the given configuration
     */
    async startCall(config: VapiCallConfig): Promise<any> {
        try {
            // Check if VAPI SDK is loaded
            if (typeof window === 'undefined' || !(window as any).Vapi) {
                throw new Error('VAPI SDK not loaded. Please ensure the VAPI script is included.');
            }

            const Vapi = (window as any).Vapi;

            // Create VAPI call instance
            this.currentCall = new Vapi({
                assistantId: config.assistantId,
                onCallStart: config.onCallStart,
                onCallEnd: config.onCallEnd,
                onError: config.onError,
                onMessage: config.onMessage,
            });

            // Start the call
            await this.currentCall.start();

            return this.currentCall;
        } catch (error) {
            console.error('Failed to start VAPI call:', error);
            throw error;
        }
    }

    /**
     * End the current VAPI call
     */
    async endCall(): Promise<void> {
        try {
            if (this.currentCall) {
                await this.currentCall.end();
                this.currentCall = null;
            }
        } catch (error) {
            console.error('Failed to end VAPI call:', error);
            throw error;
        }
    }

    /**
     * Get the current call instance
     */
    getCurrentCall(): any {
        return this.currentCall;
    }

    /**
     * Check if a call is currently active
     */
    isCallActive(): boolean {
        return this.currentCall !== null;
    }

    /**
     * Get assistant ID based on interview configuration
     */
    getAssistantId(configuration: InterviewConfiguration): string {
        const assistantMap: Record<string, string> = {
            'technical': process.env.NEXT_PUBLIC_VAPI_TECHNICAL_ASSISTANT_ID || 'default-technical',
            'soft_skills': process.env.NEXT_PUBLIC_VAPI_SOFT_SKILLS_ASSISTANT_ID || 'default-soft-skills',
            'behavioral': process.env.NEXT_PUBLIC_VAPI_BEHAVIORAL_ASSISTANT_ID || 'default-behavioral',
            'system_design': process.env.NEXT_PUBLIC_VAPI_SYSTEM_DESIGN_ASSISTANT_ID || 'default-system-design'
        };

        return assistantMap[configuration.interviewType] || 'default';
    }

    /**
     * Build VAPI parameters from interview configuration
     */
    buildVapiParameters(configuration: InterviewConfiguration): Record<string, any> {
        return {
            skillLevel: configuration.skillLevel,
            interviewType: configuration.interviewType,
            duration: configuration.duration,
            preparationTime: configuration.preparationTime,
            timestamp: Date.now(),
            // Add any additional parameters needed by VAPI
            context: {
                interviewType: configuration.interviewType,
                skillLevel: configuration.skillLevel,
                duration: configuration.duration
            }
        };
    }

    /**
     * Initialize VAPI SDK (call this before using the service)
     */
    async initializeVapi(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Check if VAPI is already loaded
            if (typeof window !== 'undefined' && (window as any).Vapi) {
                resolve();
                return;
            }

            // Load VAPI SDK if not already loaded
            const script = document.createElement('script');
            script.src = 'https://cdn.vapi.ai/vapi.js'; // Replace with actual VAPI SDK URL
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load VAPI SDK'));
            document.head.appendChild(script);
        });
    }

    /**
     * Handle VAPI webhook events
     */
    handleWebhookEvent(event: any): void {
        console.log('VAPI webhook event:', event);

        switch (event.type) {
            case 'call-started':
                console.log('Call started:', event.data);
                break;
            case 'call-ended':
                console.log('Call ended:', event.data);
                break;
            case 'transcript':
                console.log('Transcript:', event.data);
                break;
            case 'function-call':
                console.log('Function call:', event.data);
                break;
            default:
                console.log('Unknown event type:', event.type);
        }
    }
}
