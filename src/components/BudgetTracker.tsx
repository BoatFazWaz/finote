'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Transaction } from '@/types/Transaction';
import { CategoryConfig } from '@/types/Category';
import { useCurrency } from '@/hooks/useCurrency';
import { Plus, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToastContext } from '@/hooks/useToastContext';

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: string;
}

interface BudgetTrackerProps {
  transactions: Transaction[];
  categories: CategoryConfig;
}

export default function BudgetTracker({ transactions, categories }: BudgetTrackerProps) {
  const t = useTranslations('budgets');
  const toast = useToastContext();
  const { formatAmount } = useCurrency();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'yearly'
  });

  // Load budgets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('finote_budgets');
    if (saved) {
      setBudgets(JSON.parse(saved));
    }
  }, []);

  // Save budgets to localStorage
  const saveBudgets = (newBudgets: Budget[]) => {
    localStorage.setItem('finote_budgets', JSON.stringify(newBudgets));
    setBudgets(newBudgets);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.amount) {
      try {
        if (editingBudget) {
          const updated = budgets.map(b => 
            b.id === editingBudget.id 
              ? { ...b, category: formData.category, amount: parseFloat(formData.amount), period: formData.period }
              : b
          );
          saveBudgets(updated);
          setEditingBudget(null);
          toast.showSuccess(t('toast.budgetUpdated'));
        } else {
          const newBudget: Budget = {
            id: crypto.randomUUID(),
            category: formData.category,
            amount: parseFloat(formData.amount),
            period: formData.period,
            createdAt: new Date().toISOString()
          };
          saveBudgets([...budgets, newBudget]);
          toast.showSuccess(t('toast.budgetAdded'));
        }
        setFormData({ category: '', amount: '', period: 'monthly' });
        setShowAddForm(false);
      } catch {
        toast.showError(t('toast.error'), t('toast.unknownError'));
      }
    } else {
      toast.showError(t('toast.error'), t('toast.validationError'));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        saveBudgets(budgets.filter(b => b.id !== id));
        toast.showSuccess(t('toast.budgetDeleted'));
      } catch {
        toast.showError(t('toast.error'), t('toast.unknownError'));
      }
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setShowAddForm(true);
  };

  const getCurrentPeriodSpending = (category: string, period: 'monthly' | 'yearly'): number => {
    const now = new Date();
    const startDate = period === 'monthly' 
      ? new Date(now.getFullYear(), now.getMonth(), 1)
      : new Date(now.getFullYear(), 0, 1);
    
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === category && 
        new Date(t.date) >= startDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getProgressPercentage = (spent: number, budget: number): number => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage >= 100) return 'text-red-600 dark:text-red-400';
    if (percentage >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />;
    if (percentage >= 80) return <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />;
    return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
  };

  const expenseCategories = categories.expense.map(cat => cat.name);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Budget Tracker
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm cursor-pointer"
        >
          <Plus size={16} />
          Add Budget
        </button>
      </div>

      {/* Add/Edit Budget Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            {editingBudget ? 'Edit Budget' : 'Add New Budget'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Category</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Budget Amount"
                step="0.01"
                min="0"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                required
              />
              
              <select
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as 'monthly' | 'yearly' }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {editingBudget ? 'Update Budget' : 'Add Budget'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBudget(null);
                  setFormData({ category: '', amount: '', period: 'monthly' });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget List */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No budgets set. Add a budget to start tracking your spending.</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const spent = getCurrentPeriodSpending(budget.category, budget.period);
            const percentage = getProgressPercentage(spent, budget.amount);
            const remaining = budget.amount - spent;
            
            return (
              <div key={budget.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {budget.category}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {budget.period} budget
                    </span>
                    {getStatusIcon(percentage)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('spent')}: {formatAmount(spent)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('budget')}: {formatAmount(budget.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={`font-medium ${getStatusColor(percentage)}`}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span className={`font-medium ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {remaining >= 0 ? `${formatAmount(remaining)} ${t('remaining')}` : `${formatAmount(Math.abs(remaining))} ${t('overBudget')}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 