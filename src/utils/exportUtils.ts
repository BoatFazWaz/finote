import { Transaction } from '@/types/Transaction';
import { formatCurrency, Currency } from './currencyUtils';

export const exportToCSV = (transactions: Transaction[], currency: Currency = 'THB', filename?: string) => {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      t.type,
      t.category,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
      formatCurrency(t.amount, currency)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};



export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}; 