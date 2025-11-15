'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useState, useEffect } from 'react';
import { useLanguage } from './language-provider';
import { LanguageCode, DEFAULT_LANGUAGE } from '@/lib/language-constants';

// Preload English messages synchronously as fallback
import enMessages from '../../messages/en.json';

// Dynamically import messages
const messageLoaders: Record<LanguageCode, () => Promise<any>> = {
  en: () => Promise.resolve({ default: enMessages }),
  es: () => import('../../messages/es.json'),
  fr: () => import('../../messages/fr.json'),
  pt: () => import('../../messages/pt.json'),
  de: () => import('../../messages/de.json'),
  it: () => import('../../messages/it.json'),
  zh: () => import('../../messages/zh.json'),
  ja: () => import('../../messages/ja.json'),
  ko: () => import('../../messages/ko.json'),
  ar: () => import('../../messages/ar.json'),
};

interface IntlProviderProps {
  children: ReactNode;
}

export function IntlProvider({ children }: IntlProviderProps) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<any>(enMessages); // Start with English as fallback
  const [currentLocale, setCurrentLocale] = useState<LanguageCode>(language);

  // Load messages on mount and whenever language changes
  useEffect(() => {
    let cancelled = false;
    
    console.log(`[IntlProvider] Loading messages for language: ${language}`);
    
    // Load messages for the current language
    messageLoaders[language]()
      .then((module) => {
        if (!cancelled) {
          const loadedMessages = module.default || module;
          console.log(`[IntlProvider] Messages loaded for ${language}:`, Object.keys(loadedMessages));
          setMessages(loadedMessages);
          setCurrentLocale(language);
        }
      })
      .catch((error) => {
        console.error(`[IntlProvider] Failed to load ${language}, using English fallback:`, error);
        // Use English as fallback
        if (!cancelled) {
          setMessages(enMessages);
          setCurrentLocale(DEFAULT_LANGUAGE);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  // Always provide the context with messages - use English as fallback if needed
  // Key forces complete re-render when locale changes
  return (
    <NextIntlClientProvider locale={currentLocale} messages={messages} key={`intl-${currentLocale}-${language}`}>
      {children}
    </NextIntlClientProvider>
  );
}

