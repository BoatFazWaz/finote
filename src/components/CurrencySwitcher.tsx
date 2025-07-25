'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Currency, getCurrencySymbol } from '@/utils/currencyUtils';
import { DollarSign, ChevronDown } from 'lucide-react';
import { useToastContext } from '@/hooks/useToastContext';

export default function CurrencySwitcher() {
  const t = useTranslations('currency');
  const tToast = useTranslations('toast');
  const toast = useToastContext();
  const [currency, setCurrency] = useState<Currency>('THB');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = localStorage.getItem('finote_currency') as Currency;
    if (savedCurrency && (savedCurrency === 'THB' || savedCurrency === 'USD')) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
    localStorage.setItem('finote_currency', newCurrency);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: newCurrency } 
    }));
    
    // Show toast notification
    toast.showSuccess(tToast('currencyChanged'));
  };

  const currencies = [
    { code: 'THB', symbol: getCurrencySymbol('THB'), name: t('thb') },
    { code: 'USD', symbol: getCurrencySymbol('USD'), name: t('usd') }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md h-9"
      >
        <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getCurrencySymbol(currency)}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 animate-fade-in">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code as Currency)}
              className={`w-full px-3 py-2 text-left text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                currency === curr.code
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{curr.symbol}</span>
                <span>{curr.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 