'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useToastContext } from '@/hooks/useToastContext';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('settings');
  const tToast = useTranslations('toast');
  const toast = useToastContext();

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from the pathname and add the new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
    
    // Show toast notification
    toast.showSuccess(tToast('languageChanged'));
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
      <select
        value={locale}
        onChange={(e) => switchLanguage(e.target.value)}
        className="px-1 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="th">{t('thai')}</option>
        <option value="en">{t('english')}</option>
      </select>
    </div>
  );
} 