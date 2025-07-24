'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Currency, getCurrencySymbol } from '@/utils/currencyUtils';
import { DollarSign } from 'lucide-react';
import { useToastContext } from '@/hooks/useToastContext';

export default function CurrencySwitcher() {
  const t = useTranslations('currency');
  const tToast = useTranslations('toast');
  const toast = useToastContext();
  const [currency, setCurrency] = useState<Currency>('THB');

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = localStorage.getItem('finote_currency') as Currency;
    if (savedCurrency && (savedCurrency === 'THB' || savedCurrency === 'USD')) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('finote_currency', newCurrency);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: newCurrency } 
    }));
    
    // Show toast notification
    toast.showSuccess(tToast('currencyChanged'));
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
      <select
        value={currency}
        onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
        className="px-1 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="THB">{getCurrencySymbol('THB')} {t('thb')}</option>
        <option value="USD">{getCurrencySymbol('USD')} {t('usd')}</option>
      </select>
    </div>
  );
} 