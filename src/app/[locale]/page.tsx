'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Transaction, TransactionFormData } from '@/types/Transaction';
import { CategoryConfig } from '@/types/Category';
import { useTransactions } from '@/hooks/useTransactions';
import { useToastContext } from '@/hooks/useToastContext';
import { generateDemoData } from '@/utils/demoData';
import { exportToCSV } from '@/utils/exportUtils';
import { Plus, Trash2, Sparkles, BarChart3, Target, Settings, Bot, Home, Receipt, PiggyBank, Calculator } from 'lucide-react';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import TransactionForm from '@/components/TransactionForm';
import TransactionTable from '@/components/TransactionTable';
import SummaryCards from '@/components/SummaryCards';
import Charts from '@/components/Charts';
import CategoryManager from '@/components/CategoryManager';
import BudgetTracker from '@/components/BudgetTracker';
import FinancialGoals from '@/components/FinancialGoals';
import Analytics from '@/components/Analytics';
import AIFinancialAssistant from '@/components/AIFinancialAssistant';
import RecurringTransactionsDetector from '@/components/RecurringTransactionsDetector';
import FinancialHealthScore from '@/components/FinancialHealthScore';
import TaxCalculator from '@/components/TaxCalculator';

export default function Dashboard({
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'goals' | 'settings' | 'ai' | 'tax'>('dashboard');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [budgets, setBudgets] = useState<Array<{
    id: string;
    category: string;
    amount: number;
    period: 'monthly' | 'yearly';
    createdAt: string;
  }>>([]);
  const [goals, setGoals] = useState<Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: 'savings' | 'debt' | 'investment' | 'other';
    createdAt: string;
  }>>([]);

  const stats = getSummaryStats();
  const categories = getCategories();

  // Load budgets and goals from localStorage
  const loadBudgetsAndGoals = () => {
    try {
      const savedBudgets = localStorage.getItem('finote_budgets');
      const savedGoals = localStorage.getItem('finote_goals');
      
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      }
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Error loading budgets and goals:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadBudgetsAndGoals();
  }, []);

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
    try {
      deleteTransaction(id);
      toast.showSuccess(t('toast.transactionDeleted'));
    } catch (error) {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleUpdateCategories = (newCategories: CategoryConfig) => {
    try {
      localStorage.setItem('finote_categories', JSON.stringify(newCategories));
      toast.showSuccess(t('toast.categoriesUpdated'));
    } catch (error) {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(transactions);
      toast.showSuccess(t('toast.dataExported'));
    } catch (error) {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  const handleGenerateDemoData = () => {
    try {
      const demoTransactions = generateDemoData();
      addMultipleTransactions(demoTransactions);
      toast.showSuccess(t('toast.demoDataGenerated'));
    } catch (error) {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  const handleClearData = () => {
    try {
      clearTransactions();
      toast.showSuccess(t('toast.dataCleared'));
    } catch {
      toast.showError(t('toast.error'), t('toast.unknownError'));
    }
  };

  // Navigation items with icons
  const navigationItems = [
    { id: 'dashboard', label: t('navigation.dashboard'), icon: Home },
    { id: 'transactions', label: t('navigation.transactions'), icon: Receipt },
    { id: 'budgets', label: t('navigation.budgets'), icon: BarChart3 },
    { id: 'goals', label: t('navigation.goals'), icon: Target },
    { id: 'tax', label: 'Tax Calculator', icon: Calculator },
    { id: 'settings', label: t('navigation.settings'), icon: Settings },
    { id: 'ai', label: '🤖 AI Assistant', icon: Bot },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">{t('common.loading')}</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Preparing your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <header className="glass border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text truncate">
                {t('app.title')}
              </h1>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Currency and Language Switchers */}
              <div className="hidden sm:flex items-center gap-2">
                <CurrencySwitcher />
                <LanguageSwitcher />
              </div>
              
              {/* Mobile Dropdown for Currency/Language */}
              <div className="sm:hidden relative">
                <button className="flex items-center gap-1 px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md h-9">
                  <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs">Settings</span>
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleGenerateDemoData}
                  className="flex items-center gap-1 px-2 py-2 sm:px-3 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md h-9"
                  title="Generate Demo Data"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Demo Data</span>
                </button>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-1 px-2 py-2 sm:px-3 sm:py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md h-9"
                  title="Clear All Data"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${item.label} tab`}
                  title={item.label}
                >
                  <IconComponent size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden text-xs">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {/* Enhanced Add Transaction Button */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="animate-slide-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'dashboard' ? t('dashboard.title') : 
               activeTab === 'tax' ? 'Tax Calculator' : t('dashboard.management')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {activeTab === 'dashboard' 
                ? t('dashboard.subtitle')
                : activeTab === 'tax'
                ? 'Calculate your tax liability based on income'
                : t('dashboard.managementSubtitle')
              }
            </p>
          </div>
          {activeTab !== 'tax' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-fade-in"
            >
              <Plus size={20} />
              {t('transactions.addTransaction')}
            </button>
          )}
        </div>

        {/* Enhanced Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="w-full max-w-md animate-slide-in">
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
          <section className="space-y-8 animate-fade-in" aria-labelledby="dashboard-heading">
            <h2 id="dashboard-heading" className="sr-only">Dashboard Overview</h2>
            {/* Summary Cards */}
            <SummaryCards stats={stats} />
            
            {/* Analytics */}
            <Analytics transactions={transactions} />
            
            {/* Charts */}
            <Charts transactions={transactions} />
          </section>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="animate-fade-in">
            <TransactionTable
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              categories={categories}
            />
          </div>
        )}

        {/* Budgets Tab */}
        {activeTab === 'budgets' && (
          <div className="animate-fade-in">
            <BudgetTracker
              transactions={transactions}
              categories={categories}
            />
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="animate-fade-in">
            <FinancialGoals
              transactions={transactions}
            />
          </div>
        )}

        {/* Tax Calculator Tab */}
        {activeTab === 'tax' && (
          <div className="animate-fade-in">
            <TaxCalculator />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                {t('settings.title')}
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('settings.manageCategories')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('settings.manageCategoriesDesc')}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCategoryManager(true)}
                    className="btn-primary"
                  >
                    {t('settings.manageCategories')}
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('settings.exportData')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('settings.exportDataDesc')}
                    </p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    disabled={transactions.length === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.export')} CSV
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('settings.language')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('settings.languageDesc')}
                    </p>
                  </div>
                  <LanguageSwitcher />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('currency.currency')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('currency.currencyDesc')}
                    </p>
                  </div>
                  <CurrencySwitcher />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('currency.exchangeRate')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('currency.exchangeRateDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Tab */}
        {activeTab === 'ai' && (
          <section className="space-y-8 animate-fade-in" aria-labelledby="ai-assistant-heading">
            <h2 id="ai-assistant-heading" className="sr-only">AI Financial Assistant</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Financial Assistant */}
              <AIFinancialAssistant
                transactions={transactions}
                budgets={budgets}
                goals={goals}
              />
              
              {/* Financial Health Score */}
              <FinancialHealthScore
                transactions={transactions}
                budgets={budgets}
                goals={goals}
              />
            </div>
            
            {/* Recurring Transactions Detector */}
            <RecurringTransactionsDetector
              transactions={transactions}
              onAddTransaction={(transaction) => {
                const formData: TransactionFormData = {
                  date: transaction.date,
                  type: transaction.type,
                  category: transaction.category,
                  description: transaction.description,
                  amount: transaction.amount.toString()
                };
                addTransaction(formData);
              }}
            />
          </section>
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
