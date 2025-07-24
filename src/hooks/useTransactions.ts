'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionFormData, TransactionFilters, SummaryStats } from '@/types/Transaction';
import { CategoryConfig, DEFAULT_CATEGORIES } from '@/types/Category';
import { loadSampleData } from '@/utils/sampleData';

const STORAGE_KEY = 'finote_transactions';



export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load transactions from localStorage
  const loadTransactions = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTransactions(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save transactions to localStorage
  const saveTransactions = useCallback((newTransactions: Transaction[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }, []);

  // Add new transaction
  const addTransaction = useCallback((formData: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: formData.date,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTransactions = [...transactions, newTransaction];
    saveTransactions(updatedTransactions);
    return newTransaction;
  }, [transactions, saveTransactions]);

  // Add multiple transactions (for demo data)
  const addMultipleTransactions = useCallback((newTransactions: Transaction[], replace: boolean = false) => {
    const updatedTransactions = replace ? newTransactions : [...transactions, ...newTransactions];
    saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  // Update transaction
  const updateTransaction = useCallback((id: string, formData: TransactionFormData) => {
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === id
        ? {
            ...transaction,
            date: formData.date,
            type: formData.type,
            category: formData.category,
            description: formData.description,
            amount: parseFloat(formData.amount),
            updatedAt: new Date().toISOString(),
          }
        : transaction
    );
    saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  // Delete transaction
  const deleteTransaction = useCallback((id: string) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions(updatedTransactions);
  }, [transactions, saveTransactions]);

  // Clear all transactions
  const clearTransactions = useCallback(() => {
    saveTransactions([]);
  }, [saveTransactions]);

  // Filter transactions
  const filterTransactions = useCallback((filters: TransactionFilters) => {
    return transactions.filter(transaction => {
      if (filters.dateFrom && transaction.date < filters.dateFrom) return false;
      if (filters.dateTo && transaction.date > filters.dateTo) return false;
      if (filters.type && transaction.type !== filters.type) return false;
      if (filters.category && transaction.category !== filters.category) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [transactions]);

  // Calculate summary stats
  const getSummaryStats = useCallback((filteredTransactions?: Transaction[]): SummaryStats => {
    const transactionsToAnalyze = filteredTransactions || transactions;
    
    const totalIncome = transactionsToAnalyze
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactionsToAnalyze
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      transactionCount: transactionsToAnalyze.length,
    };
  }, [transactions]);

  // Get unique categories
  const getCategories = useCallback(() => {
    // Check for custom categories in localStorage
    let customCategories = DEFAULT_CATEGORIES;
    
    if (typeof window !== 'undefined') {
      const savedCategories = localStorage.getItem('finote_categories');
      
      if (savedCategories) {
        try {
          const parsed = JSON.parse(savedCategories);
          // Handle legacy format (string arrays) and new format (Category objects)
          if (parsed.income && Array.isArray(parsed.income)) {
            if (typeof parsed.income[0] === 'string') {
              // Legacy format - convert to new format
              customCategories = {
                income: parsed.income.map((name: string) => ({ 
                  name, 
                  color: '#6B7280', 
                  type: 'income' as const 
                })),
                expense: parsed.expense.map((name: string) => ({ 
                  name, 
                  color: '#6B7280', 
                  type: 'expense' as const 
                }))
              };
            } else {
              // New format
              customCategories = parsed;
            }
          }
        } catch (error) {
          console.error('Error parsing saved categories:', error);
        }
      }
    }
    
    // Get categories from transactions that aren't in custom categories
    const incomeCategories = [...new Set(transactions.filter(t => t.type === 'income').map(t => t.category))];
    const expenseCategories = [...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))];
    
    const existingIncomeNames = customCategories.income.map(cat => cat.name);
    const existingExpenseNames = customCategories.expense.map(cat => cat.name);
    
    const newIncomeCategories = incomeCategories
      .filter(cat => !existingIncomeNames.includes(cat))
      .map(name => ({ name, color: '#6B7280', type: 'income' as const }));
    
    const newExpenseCategories = expenseCategories
      .filter(cat => !existingExpenseNames.includes(cat))
      .map(name => ({ name, color: '#6B7280', type: 'expense' as const }));
    
    return {
      income: [...customCategories.income, ...newIncomeCategories],
      expense: [...customCategories.expense, ...newExpenseCategories]
    };
  }, [transactions]);

  // Load transactions on mount
  useEffect(() => {
    loadSampleData(); // Load sample data if no transactions exist
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    addTransaction,
    addMultipleTransactions,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    filterTransactions,
    getSummaryStats,
    getCategories,
  };
}; 