/**
 * Language detection and utility functions
 */

import { LanguageCode, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './language-constants';

const STORAGE_KEY = 'iqlify-language';

/**
 * Detects browser/system language and maps to supported language code
 * Falls back to default language if browser language is not supported
 */
export function detectBrowserLanguage(): LanguageCode {
    if (typeof window === 'undefined') {
        return DEFAULT_LANGUAGE;
    }

    const browserLang = navigator.language || navigator.languages?.[0] || '';
    
    if (!browserLang) {
        return DEFAULT_LANGUAGE;
    }

    const langCode = browserLang.toLowerCase().split('-')[0] as LanguageCode;
    
    if (langCode in SUPPORTED_LANGUAGES) {
        return langCode;
    }

    return DEFAULT_LANGUAGE;
}

/**
 * Gets language from localStorage
 * Returns null if not found or invalid
 */
export function getStoredLanguage(): LanguageCode | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
        return null;
    }

    if (stored in SUPPORTED_LANGUAGES) {
        return stored as LanguageCode;
    }

    return null;
}

/**
 * Saves language to localStorage
 */
export function saveLanguageToStorage(language: LanguageCode): void {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(STORAGE_KEY, language);
}

/**
 * Gets the initial language based on priority:
 * 1. Stored language (localStorage)
 * 2. Browser/system language
 * 3. Default language (English)
 */
export function getInitialLanguage(): LanguageCode {
    const stored = getStoredLanguage();
    if (stored) {
        return stored;
    }

    return detectBrowserLanguage();
}

