import { NextIntlClientProvider } from 'next-intl';
import { routing } from '../../i18n/routing';
import { ToastProvider } from '@/components/ToastContainer';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import Footer from '@/components/Footer';

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const isThai = locale === 'th';
  
  return {
    title: {
      default: isThai ? 'Finote - ระบบติดตามรายได้และค่าใช้จ่าย by North' : 'Finote - Personal Finance Management App',
      template: isThai ? '%s | Finote - ระบบจัดการการเงินส่วนบุคคล' : '%s | Finote - Personal Finance App'
    },
    description: isThai 
      ? 'Finote - แอปพลิเคชันจัดการการเงินส่วนบุคคลที่ครบครัน พร้อม AI Assistant สำหรับติดตามรายได้ ค่าใช้จ่าย งบประมาณ และเป้าหมายทางการเงิน'
      : 'Finote - Comprehensive personal finance management app with AI Assistant for tracking income, expenses, budgets, and financial goals. Free, secure, and easy to use.',
    keywords: isThai 
      ? 'การเงินส่วนบุคคล, ติดตามค่าใช้จ่าย, งบประมาณ, เป้าหมายทางการเงิน, AI Assistant, จัดการเงิน, บันทึกรายได้, ควบคุมค่าใช้จ่าย'
      : 'personal finance, expense tracker, budget management, financial goals, AI assistant, money management, income tracking, expense control, financial planning',
    authors: [{ name: 'North', url: 'https://github.com/north' }],
    creator: 'North',
    publisher: 'Finote',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://finote.app'),
    alternates: {
      canonical: '/',
      languages: {
        'th': '/th',
        'en': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      alternateLocale: locale === 'th' ? 'en' : 'th',
      title: isThai ? 'Finote - ระบบติดตามรายได้และค่าใช้จ่าย' : 'Finote - Personal Finance Management',
      description: isThai 
        ? 'แอปพลิเคชันจัดการการเงินส่วนบุคคลที่ครบครัน พร้อม AI Assistant สำหรับติดตามรายได้ ค่าใช้จ่าย งบประมาณ และเป้าหมายทางการเงิน'
        : 'Comprehensive personal finance management app with AI Assistant for tracking income, expenses, budgets, and financial goals.',
      url: 'https://finote.app',
      siteName: 'Finote',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: isThai ? 'Finote - ระบบจัดการการเงินส่วนบุคคล' : 'Finote - Personal Finance Management',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isThai ? 'Finote - ระบบติดตามรายได้และค่าใช้จ่าย' : 'Finote - Personal Finance Management',
      description: isThai 
        ? 'แอปพลิเคชันจัดการการเงินส่วนบุคคลที่ครบครัน พร้อม AI Assistant'
        : 'Comprehensive personal finance management app with AI Assistant',
      images: ['/og-image.png'],
      creator: '@finote_app',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
  };
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
        <StructuredData locale={locale} />
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </ToastProvider>
    </NextIntlClientProvider>
  );
}
