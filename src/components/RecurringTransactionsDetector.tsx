'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/Transaction';
import { useCurrency } from '@/hooks/useCurrency';
import { useToastContext } from '@/hooks/useToastContext';
import { Repeat, Calendar, Plus, X } from 'lucide-react';

interface RecurringTransaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: 'weekly' | 'monthly' | 'yearly';
  lastOccurrence: string;
  confidence: number;
  suggestedDate: string;
}

interface RecurringTransactionsDetectorProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
}

export default function RecurringTransactionsDetector({ 
  transactions, 
  onAddTransaction 
}: RecurringTransactionsDetectorProps) {
  const toast = useToastContext();
  const { formatAmount } = useCurrency();
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const detectRecurringTransactions = useCallback(() => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const patterns = new Map<string, {
        transactions: Transaction[];
        amounts: number[];
        dates: Date[];
      }>();

      // Group transactions by description and category
      transactions.forEach(transaction => {
        const key = `${transaction.description.toLowerCase()}-${transaction.category}-${transaction.type}`;
        if (!patterns.has(key)) {
          patterns.set(key, { transactions: [], amounts: [], dates: [] });
        }
        const pattern = patterns.get(key)!;
        pattern.transactions.push(transaction);
        pattern.amounts.push(transaction.amount);
        pattern.dates.push(new Date(transaction.date));
      });

      const detected: RecurringTransaction[] = [];

      patterns.forEach((pattern) => {
        if (pattern.transactions.length >= 2) {
          // const [description, category, type] = key.split('-');
          
          // Check if amounts are consistent (within 10% variance)
          const avgAmount = pattern.amounts.reduce((a, b) => a + b, 0) / pattern.amounts.length;
          const variance = pattern.amounts.every(amount => 
            Math.abs(amount - avgAmount) / avgAmount < 0.1
          );

          if (variance) {
            // Analyze date patterns
            const sortedDates = pattern.dates.sort((a, b) => a.getTime() - b.getTime());
            const intervals = [];
            
            for (let i = 1; i < sortedDates.length; i++) {
              const diff = sortedDates[i].getTime() - sortedDates[i-1].getTime();
              const daysDiff = Math.round(diff / (1000 * 60 * 60 * 24));
              intervals.push(daysDiff);
            }

            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            let frequency: 'weekly' | 'monthly' | 'yearly' = 'monthly';
            let confidence = 0.5;

            if (Math.abs(avgInterval - 7) < 3) {
              frequency = 'weekly';
              confidence = 0.8;
            } else if (Math.abs(avgInterval - 30) < 5) {
              frequency = 'monthly';
              confidence = 0.9;
            } else if (Math.abs(avgInterval - 365) < 30) {
              frequency = 'yearly';
              confidence = 0.7;
            }

            // Calculate next occurrence
            const lastDate = new Date(sortedDates[sortedDates.length - 1]);
            const nextDate = new Date(lastDate);
            
            switch (frequency) {
              case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
              case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
              case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            }

            // Only suggest if next occurrence is within 30 days
            const daysUntilNext = Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilNext <= 30 && daysUntilNext > -7) {
              detected.push({
                id: crypto.randomUUID(),
                description: pattern.transactions[0].description,
                category: pattern.transactions[0].category,
                amount: Math.round(avgAmount),
                type: pattern.transactions[0].type as 'income' | 'expense',
                frequency,
                lastOccurrence: lastDate.toISOString().split('T')[0],
                confidence,
                suggestedDate: nextDate.toISOString().split('T')[0]
              });
            }
          }
        }
      });

      setRecurringTransactions(detected);
      setIsAnalyzing(false);
    }, 1500);
  }, [transactions]);

  useEffect(() => {
    detectRecurringTransactions();
  }, [detectRecurringTransactions]);

  const handleAddRecurringTransaction = (recurring: RecurringTransaction) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: recurring.suggestedDate,
      type: recurring.type,
      category: recurring.category,
      description: recurring.description,
      amount: recurring.amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddTransaction(newTransaction);
    toast.showSuccess('Recurring transaction added', `Added ${recurring.description} for ${recurring.suggestedDate}`);
    
    // Remove from suggestions
    setRecurringTransactions(prev => prev.filter(r => r.id !== recurring.id));
  };

  const handleDismiss = (id: string) => {
    setRecurringTransactions(prev => prev.filter(r => r.id !== id));
    toast.showInfo('Suggestion dismissed', 'This suggestion will not appear again');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return <Calendar className="w-4 h-4" />;
      case 'monthly': return <Calendar className="w-4 h-4" />;
      case 'yearly': return <Calendar className="w-4 h-4" />;
      default: return <Repeat className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <Repeat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recurring Transactions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered detection of regular payments
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
        >
          {showSuggestions ? 'Hide' : 'Show'} Suggestions
        </button>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Analyzing transaction patterns...</span>
          </div>
        </div>
      ) : recurringTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Repeat className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recurring transactions detected</p>
          <p className="text-sm mt-1">Add more transactions to detect patterns</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recurringTransactions.map((recurring) => (
            <div
              key={recurring.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                    recurring.type === 'income' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {recurring.type}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {getFrequencyIcon(recurring.frequency)}
                    {recurring.frequency}
                  </span>
                  <span className={`text-xs ${getConfidenceColor(recurring.confidence)}`}>
                    {(recurring.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddRecurringTransaction(recurring)}
                    className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                    title="Add transaction"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDismiss(recurring.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {recurring.description}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recurring.category} • {formatAmount(recurring.amount)}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Last: {new Date(recurring.lastOccurrence).toLocaleDateString()}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Next: {new Date(recurring.suggestedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={detectRecurringTransactions}
          className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-md hover:from-green-600 hover:to-blue-700 transition-all duration-200 cursor-pointer"
        >
          Re-analyze Patterns
        </button>
      </div>
    </div>
  );
} 