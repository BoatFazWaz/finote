'use client';

import { useState, useEffect } from 'react';
import { Currency, convertCurrency, formatCurrency } from '@/utils/currencyUtils';

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('THB');

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = localStorage.getItem('finote_currency') as Currency;
    if (savedCurrency && (savedCurrency === 'THB' || savedCurrency === 'USD')) {
      setCurrency(savedCurrency);
    }

    // Listen for currency changes from CurrencySwitcher
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrency(event.detail.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const formatAmount = (amount: number, originalCurrency: Currency = 'THB'): string => {
    const convertedAmount = convertCurrency(amount, originalCurrency, currency);
    return formatCurrency(convertedAmount, currency);
  };

  const convertAmount = (amount: number, fromCurrency: Currency = 'THB'): number => {
    return convertCurrency(amount, fromCurrency, currency);
  };

  return {
    currency,
    formatAmount,
    convertAmount,
  };
} 