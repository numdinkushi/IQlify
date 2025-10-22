import { useState, useEffect } from 'react';

export function useMinipayPhone() {
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [isMinipay, setIsMinipay] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkMinipayAndGetPhone = async () => {
            try {
                console.log('🔍 Checking MiniPay environment...');
                console.log('window.ethereum:', window.ethereum);
                console.log('isMiniPay:', window.ethereum?.isMiniPay);

                // Check if running in MiniPay
                if (typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
                    setIsMinipay(true);
                    console.log('✅ Running in MiniPay environment');

                    // Try to get phone number from MiniPay
                    try {
                        // @ts-ignore - MiniPay API
                        if (window.ethereum?.minipay?.getPhoneNumber) {
                            console.log('📞 Attempting to get phone number from MiniPay...');
                            // @ts-ignore - MiniPay API
                            const phone = await window.ethereum.minipay.getPhoneNumber();
                            console.log('📞 Phone number received:', phone);
                            setPhoneNumber(phone);
                        } else {
                            // Fallback: try to get from user profile or other methods
                            console.log('⚠️ MiniPay phone number API not available');
                            console.log('Available methods:', Object.keys(window.ethereum?.minipay || {}));
                        }
                    } catch (error) {
                        console.log('❌ Could not get phone number from MiniPay:', error);
                    }
                } else {
                    setIsMinipay(false);
                    console.log('❌ Not running in MiniPay environment');
                    console.log('User agent:', navigator.userAgent);
                }
            } catch (error) {
                console.error('❌ Error checking MiniPay:', error);
                setIsMinipay(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkMinipayAndGetPhone();
    }, []);

    // Format phone number to E.164 format if needed
    const formatPhoneNumber = (phone: string): string => {
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
    };

    return {
        phoneNumber: phoneNumber ? formatPhoneNumber(phoneNumber) : null,
        isMinipay,
        isLoading
    };
}
