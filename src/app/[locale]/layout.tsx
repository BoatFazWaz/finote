import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '../../i18n/routing';
import { ToastProvider } from '@/components/ToastContainer';

async function getMessagesForLocale(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to Thai
    return (await import(`../../../messages/th.json`)).default;
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessagesForLocale(locale);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </NextIntlClientProvider>
  );
}
