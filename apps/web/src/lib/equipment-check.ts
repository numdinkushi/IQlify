import { EquipmentStatus, EquipmentCheckResult } from './interview-types';

// Equipment Check Service
// Single Responsibility: Handle all equipment validation
export class EquipmentCheckService {
    private static instance: EquipmentCheckService;

    private constructor() { }

    public static getInstance(): EquipmentCheckService {
        if (!EquipmentCheckService.instance) {
            EquipmentCheckService.instance = new EquipmentCheckService();
        }
        return EquipmentCheckService.instance;
    }

    // Check microphone access and quality
    private async checkMicrophone(): Promise<{ hasAccess: boolean; quality: 'good' | 'poor' | 'unknown'; }> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Basic quality check - in a real app, you'd analyze audio levels
            const audioTracks = stream.getAudioTracks();
            const hasAudio = audioTracks.length > 0;

            // Clean up the stream
            stream.getTracks().forEach(track => track.stop());

            return {
                hasAccess: hasAudio,
                quality: hasAudio ? 'good' : 'poor'
            };
        } catch (error) {
            console.warn('Microphone check failed:', error);
            return { hasAccess: false, quality: 'poor' };
        }
    }

    // Check audio output capability
    private async checkAudioOutput(): Promise<boolean> {
        try {
            // Create a test audio context
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Test if we can create audio (very brief)
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.01);

            return true;
        } catch (error) {
            console.warn('Audio output check failed:', error);
            return false;
        }
    }

    // Check internet connection quality
    private async checkInternetConnection(): Promise<{ isConnected: boolean; speed: 'fast' | 'medium' | 'slow'; }> {
        try {
            const startTime = performance.now();
            const response = await fetch('/api/ping', {
                method: 'HEAD',
                cache: 'no-cache'
            });
            const endTime = performance.now();

            const latency = endTime - startTime;
            const isConnected = response.ok;

            let speed: 'fast' | 'medium' | 'slow' = 'medium';
            if (latency < 100) speed = 'fast';
            else if (latency > 500) speed = 'slow';

            return { isConnected, speed };
        } catch (error) {
            console.warn('Internet connection check failed:', error);
            return { isConnected: false, speed: 'slow' };
        }
    }

    // Check browser compatibility
    private checkBrowserCompatibility(): boolean {
        const requiredFeatures = [
            'mediaDevices' in navigator,
            'getUserMedia' in navigator.mediaDevices,
            'AudioContext' in window || 'webkitAudioContext' in window,
            'fetch' in window,
            'Promise' in window
        ];

        return requiredFeatures.every(feature => feature);
    }

    // Main equipment check method
    public async performEquipmentCheck(): Promise<EquipmentCheckResult> {
        const issues: string[] = [];
        const recommendations: string[] = [];

        // Check microphone
        const micCheck = await this.checkMicrophone();
        const microphone = micCheck.hasAccess;
        if (!microphone) {
            issues.push('Microphone access denied or not available');
            recommendations.push('Please allow microphone access and ensure your microphone is working');
        } else if (micCheck.quality === 'poor') {
            issues.push('Microphone quality may be poor');
            recommendations.push('Check your microphone settings and try a different microphone if possible');
        }

        // Check audio output
        const audio = await this.checkAudioOutput();
        if (!audio) {
            issues.push('Audio output not available');
            recommendations.push('Check your speakers/headphones and audio settings');
        }

        // Check internet connection
        const internetCheck = await this.checkInternetConnection();
        const internet = internetCheck.isConnected;
        if (!internet) {
            issues.push('No internet connection');
            recommendations.push('Please check your internet connection');
        } else if (internetCheck.speed === 'slow') {
            issues.push('Slow internet connection detected');
            recommendations.push('Consider using a faster internet connection for better interview experience');
        }

        // Check browser compatibility
        const browser = this.checkBrowserCompatibility();
        if (!browser) {
            issues.push('Browser not fully compatible');
            recommendations.push('Please use a modern browser like Chrome, Firefox, or Safari');
        }

        const equipmentStatus: EquipmentStatus = {
            microphone,
            audio,
            internet,
            browser
        };

        const canProceed = microphone && audio && internet && browser;

        return {
            status: equipmentStatus,
            issues,
            recommendations,
            canProceed
        };
    }

    // Quick equipment status check (for UI display)
    public async getQuickStatus(): Promise<EquipmentStatus> {
        try {
            const micCheck = await this.checkMicrophone();
            const audio = await this.checkAudioOutput();
            const internetCheck = await this.checkInternetConnection();
            const browser = this.checkBrowserCompatibility();

            return {
                microphone: micCheck.hasAccess,
                audio,
                internet: internetCheck.isConnected,
                browser
            };
        } catch (error) {
            console.warn('Quick equipment check failed:', error);
            return {
                microphone: false,
                audio: false,
                internet: false,
                browser: false
            };
        }
    }
}
