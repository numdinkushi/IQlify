import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { LanguageCode } from '@/lib/language-constants';

export const locales: LanguageCode[] = ['en', 'es', 'fr', 'pt', 'de', 'it', 'zh', 'ja', 'ko', 'ar'];
export const defaultLocale: LanguageCode = 'en';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as LanguageCode)) {
    notFound();
  }

  return {
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

