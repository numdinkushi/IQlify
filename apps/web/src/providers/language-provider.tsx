'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { LanguageCode, DEFAULT_LANGUAGE } from '@/lib/language-constants';
import { getInitialLanguage, saveLanguageToStorage } from '@/lib/language-utils';
import { getTranslationService } from '@/lib/translations';

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (language: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode; }) {
    const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const initialLanguage = getInitialLanguage();
        setLanguageState(initialLanguage);
        // Initialize translation service with initial language
        getTranslationService().setLanguage(initialLanguage);
    }, []);

    const setLanguage = useCallback((newLanguage: LanguageCode) => {
        setLanguageState(newLanguage);
        saveLanguageToStorage(newLanguage);
        // Update translation service immediately (now synchronous)
        getTranslationService().setLanguage(newLanguage);
    }, []);

    // Always provide context, even before mount (to prevent errors in child components)
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

