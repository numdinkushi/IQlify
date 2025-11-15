/**
 * Translation system integrated with LanguageProvider
 */

import { LanguageCode, DEFAULT_LANGUAGE } from './language-constants';
import { translations } from './translations-data';

type TranslationKey = string;
type TranslationValue = string | Record<string, any>;

interface Translations {
    [key: string]: TranslationValue;
}

// Fallback to English for languages without translations yet
const translationMap: Record<LanguageCode, Translations> = {
    en: translations.en,
    es: translations.es,
    fr: translations.en, // Fallback to English
    pt: translations.en,
    de: translations.en,
    it: translations.en,
    zh: translations.en,
    ja: translations.ja,
    ko: translations.en,
    ar: translations.en,
};

/**
 * Loads translations for a specific language (synchronous)
 */
function loadTranslations(language: LanguageCode): Translations {
    return translationMap[language] || translationMap[DEFAULT_LANGUAGE];
}

/**
 * Gets a nested translation value using dot notation
 * Example: 'settings.appearance.theme' -> translations.settings.appearance.theme
 */
function getNestedValue(obj: any, path: string): string | undefined {
    return path.split('.').reduce((current, key) => {
        return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
}

/**
 * Translation hook that provides translation function
 * This will be used by components to get translated strings
 */
export class TranslationService {
    private currentLanguage: LanguageCode = DEFAULT_LANGUAGE;
    private translations: Translations = {};
    private listeners: Set<() => void> = new Set();

    constructor() {
        this.initialize();
    }

    private initialize() {
        this.translations = loadTranslations(this.currentLanguage);
        this.notifyListeners();
    }

    /**
     * Sets the current language and reloads translations
     */
    setLanguage(language: LanguageCode) {
        if (this.currentLanguage === language) {
            return;
        }
        console.log(`[TranslationService] Changing language from ${this.currentLanguage} to ${language}`);
        this.currentLanguage = language;
        this.translations = loadTranslations(language);
        console.log(`[TranslationService] Loaded translations for ${language}`, Object.keys(this.translations));
        this.notifyListeners();
    }

    /**
     * Gets a translation by key
     */
    t(key: TranslationKey, params?: Record<string, string | number>): string {
        const value = getNestedValue(this.translations, key);
        
        if (!value || typeof value !== 'string') {
            console.warn(`[TranslationService] Key "${key}" not found for language "${this.currentLanguage}"`);
            return key;
        }

        if (params) {
            return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
                return params[paramKey]?.toString() || match;
            });
        }

        return value;
    }

    /**
     * Subscribe to language changes
     */
    subscribe(callback: () => void) {
        this.listeners.add(callback);
        return () => {
            this.listeners.delete(callback);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(callback => callback());
    }

    getCurrentLanguage(): LanguageCode {
        return this.currentLanguage;
    }
}

// Singleton instance
let translationService: TranslationService | null = null;

export function getTranslationService(): TranslationService {
    if (!translationService) {
        translationService = new TranslationService();
    }
    return translationService;
}

