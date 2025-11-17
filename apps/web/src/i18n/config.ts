import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { LanguageCode } from '@/lib/language-constants';

export const locales: LanguageCode[] = ['en', 'es', 'fr', 'pt', 'de', 'it', 'zh', 'ja', 'ko', 'ar'];
export const defaultLocale: LanguageCode = 'en';

export default getRequestConfig(async ({ locale }) => {
  const isValidLocale =
    typeof locale === 'string' && locales.includes(locale as LanguageCode);

  if (!isValidLocale) {
    notFound();
  }

  const resolvedLocale = locale as LanguageCode;

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default
  };
});

