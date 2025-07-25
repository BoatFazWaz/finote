'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TransactionFormData, Transaction } from '@/types/Transaction';
import { CategoryConfig, DEFAULT_CATEGORIES } from '@/types/Category';


import { Plus, X, Calendar, DollarSign, Tag, FileText } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  transaction?: Transaction | null;
  onCancel?: () => void;
  categories?: CategoryConfig;
}

export default function TransactionForm({ 
  onSubmit, 
  transaction, 
  onCancel,
  categories = DEFAULT_CATEGORIES 
}: TransactionFormProps) {
  const t = useTranslations('form');
  
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    category: '',
    description: '',
    amount: '',
  });
  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});

  // Initialize form with transaction data if editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount.toString(),
      });
    }
  }, [transaction]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.date) newErrors.date = t('validation.dateRequired');
    if (!formData.category) newErrors.category = t('validation.categoryRequired');
    if (!formData.description.trim()) newErrors.description = t('validation.descriptionRequired');
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('validation.amountPositive');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      if (!transaction) {
        // Clear form only for new transactions
        setFormData({
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
          category: '',
          description: '',
          amount: '',
        });
      }
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const currentCategories = categories[formData.type].map(cat => cat.name);

  return (
    <div className="card p-8 max-w-md w-full mx-auto animate-slide-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {transaction ? t('update') : t('addNewTransaction')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {transaction ? 'Update your transaction details' : 'Add a new transaction to your records'}
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div className="relative">
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('date')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`input-modern w-full pl-10 ${
                  errors.date ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
            </div>
            {errors.date && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">{errors.date}</p>}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('type')}
            </label>
            <div className="relative">
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as 'income' | 'expense')}
                className="input-modern w-full appearance-none cursor-pointer"
              >
                <option value="expense">{t('expense')}</option>
                <option value="income">{t('income')}</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="relative">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('category')}
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`input-modern w-full pl-10 appearance-none cursor-pointer ${
                errors.category ? 'border-red-500 focus:border-red-500' : ''
              }`}
            >
              <option value="">{t('selectCategory')}</option>
              {currentCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.category && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">{errors.category}</p>}
        </div>

        {/* Description */}
        <div className="relative">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('description')}
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('enterDescription')}
              className={`input-modern w-full pl-10 ${
                errors.description ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">{errors.description}</p>}
        </div>

        {/* Amount */}
        <div className="relative">
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('amount')}
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder={t('amountPlaceholder')}
              step="0.01"
              min="0"
              className={`input-modern w-full pl-10 ${
                errors.amount ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">{errors.amount}</p>}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            <Plus size={18} />
            {transaction ? t('update') : t('submit')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              {t('cancel')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 