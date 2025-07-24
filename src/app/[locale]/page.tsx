'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Transaction, TransactionFormData } from '@/types/Transaction';
import { useToastContext } from '@/hooks/useToastContext';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionForm from '@/components/TransactionForm';
import TransactionTable from '@/components/TransactionTable';
import SummaryCards from '@/components/SummaryCards';
import Charts from '@/components/Charts';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import { Plus, X, Download, Settings, Trash2 } from 'lucide-react';
import { exportToCSV } from '@/utils/exportUtils';
import { generateDemoData, generateQuickDemoData } from '@/utils/demoData';
import CategoryManager from '@/components/CategoryManager';
import BudgetTracker from '@/components/BudgetTracker';
import FinancialGoals from '@/components/FinancialGoals';
import Analytics from '@/components/Analytics';

export default function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = useTranslations();
  const toast = useToastContext();
  
  const {
    transactions,
    loading,
    addTransaction,
    addMultipleTransactions,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    getSummaryStats,
    getCategories,
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'goals' | 'settings'>('dashboard');
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const stats = getSummaryStats();
  const categories = getCategories();

  const handleSubmit = (formData: TransactionFormData) => {
    try {
      if (editingTransaction) {
        updateTransaction(editingTransaction.id, formData);
        setEditingTransaction(null);
        toast.showSuccess(t('toast.transactionUpdated'));
      } else {
        addTransaction(formData);
        toast.showSuccess(t('toast.transactionAdded'));
      }
      setShowForm(false);
    } catch (error) {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        deleteTransaction(id);
        toast.showSuccess(t('toast.transactionDeleted'));
      } catch (error) {
        toast.showError(t('toast.error'), t('toast.unknownError'));
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleUpdateCategories = (newCategories: { income: any[]; expense: any[] }) => {
    try {
      // Update categories in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('finote_categories', JSON.stringify(newCategories));
        // Force re-render by updating the component state
        window.location.reload();
      }
      toast.showSuccess(t('toast.categoryUpdated'));
    } catch (error) {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  const handleExportCSV = () => {
    try {
      const currentCurrency = (typeof window !== 'undefined' ? localStorage.getItem('finote_currency') : null) as 'THB' | 'USD' || 'THB';
      exportToCSV(transactions, currentCurrency);
      toast.showSuccess(t('toast.dataExported'));
    } catch (error) {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  const handleGenerateDemoData = () => {
    try {
      // Generate demo data and replace all existing transactions
      const demoData = generateDemoData();
      addMultipleTransactions(demoData, true); // true = replace all
      toast.showSuccess(t('toast.demoDataGenerated'));
    } catch (error) {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        clearTransactions();
        toast.showSuccess(t('toast.dataCleared'));
      } catch (error) {
        toast.showError(t('toast.error'), t('toast.unknownError'));
      }
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {t('app.title')}
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <CurrencySwitcher />
              <LanguageSwitcher />
              <button
                onClick={handleGenerateDemoData}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base cursor-pointer"
              >
                <Plus size={16} />
                Demo Data
              </button>
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base cursor-pointer"
              >
                <Trash2 size={16} />
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {t('navigation.dashboard')}
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {t('navigation.transactions')}
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'budgets'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {t('navigation.budgets')}
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'goals'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {t('navigation.goals')}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {t('navigation.settings')}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Transaction Button */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'dashboard' ? t('dashboard.title') : t('dashboard.management')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {activeTab === 'dashboard' 
                ? t('dashboard.subtitle')
                : t('dashboard.managementSubtitle')
              }
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base cursor-pointer"
          >
            <Plus size={16} />
            {t('transactions.addTransaction')}
          </button>
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md">
              <TransactionForm
                onSubmit={handleSubmit}
                transaction={editingTransaction}
                onCancel={handleCancelForm}
                categories={categories}
              />
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards stats={stats} />
            
            {/* Analytics */}
            <Analytics transactions={transactions} />
            
            {/* Charts */}
            <Charts transactions={transactions} />
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <TransactionTable
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            categories={categories}
          />
        )}

        {/* Budgets Tab */}
        {activeTab === 'budgets' && (
          <BudgetTracker
            transactions={transactions}
            categories={categories}
          />
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <FinancialGoals
            transactions={transactions}
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('settings.title')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('settings.manageCategories')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('settings.manageCategoriesDesc')}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCategoryManager(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Settings size={16} />
                    {t('settings.manageCategories')}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('settings.exportData')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('settings.exportDataDesc')}
                    </p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    disabled={transactions.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Download size={16} />
                    {t('common.export')} CSV
                  </button>
                </div>





                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('settings.language')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('settings.languageDesc')}
                    </p>
                  </div>
                  <LanguageSwitcher />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('currency.currency')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('currency.currencyDesc')}
                    </p>
                  </div>
                  <CurrencySwitcher />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('currency.exchangeRate')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('currency.exchangeRateDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Manager Modal */}
        {showCategoryManager && (
          <CategoryManager
            categories={categories}
            onUpdateCategories={handleUpdateCategories}
            onClose={() => setShowCategoryManager(false)}
          />
        )}
      </main>
    </div>
  );
}
