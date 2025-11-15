/**
 * Translation hook that integrates with LanguageProvider
 */

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/providers/language-provider';
import { getTranslationService, TranslationService } from '@/lib/translations';

export function useTranslation() {
    const { language } = useLanguage();
    const [service] = useState<TranslationService>(() => getTranslationService());
    const [updateCounter, setUpdateCounter] = useState(0);

    useEffect(() => {
        console.log(`[useTranslation] Language changed to: ${language}`);
        service.setLanguage(language);
        setUpdateCounter(prev => prev + 1);
    }, [language, service]);

    useEffect(() => {
        const unsubscribe = service.subscribe(() => {
            setUpdateCounter(prev => prev + 1);
        });
        return unsubscribe;
    }, [service]);

    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        return service.t(key, params);
    }, [service, updateCounter]);

    return { t, language };
}

