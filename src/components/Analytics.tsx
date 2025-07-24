'use client';

import { useTranslations } from 'next-intl';
import { Transaction } from '@/types/Transaction';
import { useCurrency } from '@/hooks/useCurrency';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { formatLocalizedMonth } from '@/utils/dateUtils';
import { formatNumberShorthand } from '@/utils/numberUtils';
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3 } from 'lucide-react';

interface AnalyticsProps {
  transactions: Transaction[];
}

export default function Analytics({ transactions }: AnalyticsProps) {
  const t = useTranslations('analytics');
  const tMonths = useTranslations('months');
  const { formatAmount } = useCurrency();
  
  const getMonthlyTrend = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return format(date, 'yyyy-MM');
    }).reverse();

    return last6Months.map(month => {
      const monthTransactions = transactions.filter(t => 
        t.date.startsWith(month)
      );
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: formatLocalizedMonth(month + '-01', tMonths),
        income,
        expenses,
        net: income - expenses
      };
    });
  };

  const getTopCategories = () => {
    const categoryTotals = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals.set(t.category, (categoryTotals.get(t.category) || 0) + t.amount);
      });
    
    return Array.from(categoryTotals.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const getAverageDailySpending = () => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    if (expenseTransactions.length === 0) return 0;
    
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const firstDate = new Date(Math.min(...expenseTransactions.map(t => new Date(t.date).getTime())));
    const lastDate = new Date(Math.max(...expenseTransactions.map(t => new Date(t.date).getTime())));
    const daysDiff = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return totalExpenses / daysDiff;
  };

  const getSavingsRate = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (totalIncome === 0) return 0;
    return ((totalIncome - totalExpenses) / totalIncome) * 100;
  };

  const getRecentTrend = () => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const lastMonth = format(subMonths(new Date(), 1), 'yyyy-MM');
    
    const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
    const lastMonthTransactions = transactions.filter(t => t.date.startsWith(lastMonth));
    
    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (lastMonthExpenses === 0) return 0;
    return ((currentExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
  };

  const monthlyTrend = getMonthlyTrend();
  const topCategories = getTopCategories();
  const avgDailySpending = getAverageDailySpending();
  const savingsRate = getSavingsRate();
  const recentTrend = getRecentTrend();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Daily Spending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(avgDailySpending)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Savings Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Trend</p>
              <p className={`text-2xl font-bold ${recentTrend >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {recentTrend >= 0 ? '+' : ''}{recentTrend.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${recentTrend >= 0 ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
              {recentTrend >= 0 ? (
                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalTransactions')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {transactions.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('sixMonthTrend')}
        </h3>
        <div className="space-y-4">
          {monthlyTrend.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-900 dark:text-white">
                  {month.month}
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('income')}</p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatAmount(month.income)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('expenses')}</p>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatAmount(month.expenses)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('net')}</p>
                <p className={`text-sm font-medium ${month.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {month.net >= 0 ? '+' : ''}{formatAmount(month.net)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Spending Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('topSpendingCategories')}
        </h3>
        <div className="space-y-4">
          {topCategories.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {t('noExpenseData')}
            </p>
          ) : (
            topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {category.category}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {((category.total / transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)}% {t('ofTotalExpenses')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatNumberShorthand(category.total)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('financialInsights')}
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">{t('savingsPerformance')}</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {savingsRate >= 20 ? 
                    t('excellentSavings') :
                    savingsRate >= 10 ?
                    t('goodProgress') :
                    t('increaseSavings')
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">{t('spendingTrend')}</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  {recentTrend > 0 ? 
                    t('spendingIncreased', { percentage: recentTrend.toFixed(1) }) :
                    recentTrend < 0 ?
                    t('spendingDecreased', { percentage: Math.abs(recentTrend).toFixed(1) }) :
                    t('spendingStable')
                  }
                </p>
              </div>
            </div>
          </div>

          {topCategories.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">{t('topSpendingArea')}</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {t('topCategoryInsight', { 
                      category: topCategories[0]?.category, 
                      amount: formatNumberShorthand(topCategories[0]?.total || 0) 
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 