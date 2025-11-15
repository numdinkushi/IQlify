import { getRequestConfig } from 'next-intl/server';
import { LanguageCode, DEFAULT_LANGUAGE } from '@/lib/language-constants';

export default getRequestConfig(async () => {
  // For client-side locale switching, we'll use a default locale
  // The actual locale will be managed by NextIntlClientProvider
  const locale = DEFAULT_LANGUAGE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

