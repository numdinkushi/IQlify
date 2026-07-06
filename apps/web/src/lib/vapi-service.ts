import { InterviewConfiguration } from './interview-types';

import { LanguageCode } from '@/lib/language-constants';

export interface VapiCallConfig {
    assistantId: string;
    duration?: number; // Duration in minutes
    language?: LanguageCode; // Language for the interview
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
            console.log('🔍 [VAPI] Starting call initialization...');
            console.log('🔍 [VAPI] Config received:', config);

            // Validate assistant ID
            if (!config.assistantId) {
                console.error('❌ [VAPI] Assistant ID validation failed');
                throw new Error('Assistant ID is required for VAPI calls');
            }
            console.log('✅ [VAPI] Assistant ID validated:', config.assistantId);

            // Client-side calls use the public web token (not the private API key)
            const apiKey =
                process.env.NEXT_PUBLIC_VAPI_WEBTOKEN ||
                process.env.NEXT_PUBLIC_VAPI_API_KEY;
            if (!apiKey) {
                throw new Error(
                    'VAPI public key is required. Set NEXT_PUBLIC_VAPI_WEBTOKEN in your environment.'
                );
            }
            console.log('🔑 [VAPI] Using public API key for client-side calls:', `${apiKey.substring(0, 8)}...`);

            // Import VAPI SDK dynamically
            console.log('📦 [VAPI] Importing VAPI SDK...');
            const Vapi = (await import('@vapi-ai/web')).default;
            console.log('✅ [VAPI] SDK imported successfully');
            console.log('📦 [VAPI] VAPI SDK version:', Vapi.toString());

            console.log('🏗️ [VAPI] Creating VAPI instance...');
            // Create VAPI instance with public key
            this.currentCall = new Vapi(apiKey);
            console.log('✅ [VAPI] Instance created:', this.currentCall);

            // Set up event handlers BEFORE starting the call
            console.log('🎧 [VAPI] Setting up event handlers...');
            if (config.onCallStart) {
                this.currentCall.on('call-start', (...args: any[]) => {
                    console.log('🎉 [VAPI] Call start event triggered:', args);
                    config.onCallStart?.();
                });
            }
            if (config.onCallEnd) {
                this.currentCall.on('call-end', (...args: any[]) => {
                    console.log('📞 [VAPI] Call end event triggered:', args);
                    config.onCallEnd?.();
                });
            }
            if (config.onError) {
                this.currentCall.on('error', (...args: any[]) => {
                    console.log('❌ [VAPI] Error event triggered:', args);
                    config.onError?.(args[0]);
                });
            }
            if (config.onMessage) {
                this.currentCall.on('message', (...args: any[]) => {
                    console.log('💬 [VAPI] Message event triggered:', args);
                    config.onMessage?.(args[0]);
                });
            }
            console.log('✅ [VAPI] Event handlers set up');

            // Start the call with assistant ID - this will trigger the web call
            console.log('🚀 [VAPI] Starting web call with assistant ID:', config.assistantId);

            // For web calls, we need to ensure microphone permissions are granted
            // The VAPI SDK will handle this, but we can pre-request to avoid delays
            try {
                console.log('🎤 [VAPI] Pre-requesting microphone permission...');
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                console.log('✅ [VAPI] Microphone permission granted');
                // Stop the stream as VAPI will create its own
                stream.getTracks().forEach(track => track.stop());
            } catch (micError) {
                console.warn('⚠️ [VAPI] Microphone permission pre-request failed:', micError);
                // Don't throw error here, let VAPI handle it
            }

            // Prepare assistant overrides with duration and language if specified
            const assistantOverrides: any = {};
            if (config.duration) {
                assistantOverrides.maxDurationSeconds = config.duration * 60; // Convert minutes to seconds
                console.log('⏱️ [VAPI] Setting call duration:', `${config.duration} minutes (${assistantOverrides.maxDurationSeconds} seconds)`);
            }

            // Set language for transcriber and assistant
            if (config.language) {
                // Import helpers
                const { getTranscriberConfig } = await import('@/app/vapi/config');
                const { SUPPORTED_LANGUAGES } = await import('@/lib/language-constants');

                const transcriberConfig = getTranscriberConfig(config.language);
                const langInfo = SUPPORTED_LANGUAGES[config.language];

                // Set transcriber language for speech-to-text
                assistantOverrides.transcriber = transcriberConfig;
                console.log('🌐 [VAPI] Setting transcriber language:', config.language, 'Config:', transcriberConfig);

                // Override model to ensure AI responds in the selected language
                // IMPORTANT: Must include provider field for VAPI validation
                // Using OpenAI as default provider (matches assistant configuration)
                assistantOverrides.model = {
                    provider: 'openai',
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert technical interviewer for IQlify. 

CRITICAL LANGUAGE REQUIREMENT: You MUST conduct this entire interview in ${langInfo.nativeName} (${langInfo.name}). 
- All your questions must be asked in ${langInfo.nativeName}
- All your responses and feedback must be in ${langInfo.nativeName}
- All your evaluations and assessments must be written in ${langInfo.nativeName}
- Do NOT switch to English or any other language at any point
- If the candidate responds in a different language, acknowledge it but continue in ${langInfo.nativeName}

Be conversational and interactive. Ask ONE question at a time and WAIT for their response. Keep your messages SHORT and conversational.`
                        }
                    ]
                };
                console.log('🌐 [VAPI] Model override configured with provider:', assistantOverrides.model.provider);

                // Override first message to be in the selected language
                const firstMessages: Record<LanguageCode, string> = {
                    en: `Hi! I'm your technical interviewer today. What role are you applying for?`,
                    es: `¡Hola! Soy tu entrevistador técnico hoy. ¿Para qué puesto estás aplicando?`,
                    fr: `Bonjour ! Je suis votre intervieweur technique aujourd'hui. Pour quel poste postulez-vous ?`,
                    pt: `Olá! Sou seu entrevistador técnico hoje. Para qual cargo você está se candidatando?`,
                    de: `Hallo! Ich bin heute Ihr technischer Interviewer. Für welche Position bewerben Sie sich?`,
                    it: `Ciao! Sono il tuo intervistatore tecnico oggi. Per quale ruolo ti stai candidando?`,
                    zh: `你好！我是你今天的技術面試官。你申請的是什麼職位？`,
                    ja: `こんにちは！今日はあなたの技術面接官です。どの役職に応募していますか？`,
                    ko: `안녕하세요! 오늘 제가 여러분의 기술 면접관입니다. 어떤 직책에 지원하고 계신가요?`,
                    ar: `مرحباً! أنا مقابلك التقني اليوم. ما هو المنصب الذي تتقدم له؟`
                };

                assistantOverrides.firstMessage = firstMessages[config.language] || firstMessages.en;
                console.log('🌐 [VAPI] First message set to:', assistantOverrides.firstMessage);

                console.log('🌐 [VAPI] Language configured:', config.language, `(${langInfo.nativeName})`);
            } else {
                console.log('🌐 [VAPI] No language specified, using default (English)');
            }

            // Use the correct VAPI Web SDK method for starting web calls with duration and language
            const startResult = await this.currentCall.start(config.assistantId, assistantOverrides);
            console.log('✅ [VAPI] Call start result:', startResult);
            console.log('🌐 [VAPI] Final language configuration:', config.language || 'default (English)');

            console.log('✅ [VAPI] Call started successfully');
            return this.currentCall;
        } catch (error) {
            console.error('❌ [VAPI] Failed to start call - Full error details:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                config,
                currentCall: this.currentCall
            });
            throw error;
        }
    }

    /**
     * End the current VAPI call
     */
    async endCall(): Promise<void> {
        try {
            console.log('🔍 [VAPI] Ending call...');
            console.log('🔍 [VAPI] Current call instance:', this.currentCall);

            if (this.currentCall) {
                console.log('🛑 [VAPI] Stopping call...');
                await this.currentCall.stop();
                this.currentCall = null;
                console.log('✅ [VAPI] Call ended successfully');
            } else {
                console.log('⚠️ [VAPI] No active call to end');
            }
        } catch (error) {
            console.error('❌ [VAPI] Failed to end call:', error);
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
     * Format phone number to E.164 format
     */
    private formatPhoneNumber(phone: string): string {
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');

        // If it doesn't start with country code, assume it's a US number
        if (digits.length === 10) {
            return `+1${digits}`;
        }

        // If it already has country code
        if (digits.length === 11 && digits.startsWith('1')) {
            return `+${digits}`;
        }

        // If it already starts with +
        if (phone.startsWith('+')) {
            return phone;
        }

        // Default: add +1 if no country code
        return `+1${digits}`;
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
