export type Currency = 'THB' | 'USD';

// Hardcoded exchange rate: 1 USD = 35 THB
export const EXCHANGE_RATE = 35;

export const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === 'THB') {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
};

export const convertCurrency = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  if (fromCurrency === 'THB' && toCurrency === 'USD') {
    return amount / EXCHANGE_RATE;
  }
  
  if (fromCurrency === 'USD' && toCurrency === 'THB') {
    return amount * EXCHANGE_RATE;
  }
  
  return amount;
};

export const getCurrencySymbol = (currency: Currency): string => {
  return currency === 'THB' ? '฿' : '$';
};

export const getCurrencyName = (currency: Currency): string => {
  return currency === 'THB' ? 'Thai Baht' : 'US Dollar';
}; 