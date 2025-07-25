'use client';

import { useTranslations } from 'next-intl';
import { SummaryStats } from '@/types/Transaction';
import { TrendingUp, TrendingDown, DollarSign, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface SummaryCardsProps {
  stats: SummaryStats;
}

export default function SummaryCards({ stats }: SummaryCardsProps) {
  const t = useTranslations('summary');
  const { formatAmount } = useCurrency();
  
  const cards = [
    {
      title: t('totalIncome'),
      value: formatAmount(stats.totalIncome),
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-900/20 to-teal-900/20',
      borderColor: 'border-emerald-200',
      darkBorderColor: 'dark:border-emerald-800',
      textColor: 'text-emerald-700',
      darkTextColor: 'dark:text-emerald-300',
      trend: 'positive',
      trendIcon: ArrowUpRight,
    },
    {
      title: t('totalExpenses'),
      value: formatAmount(stats.totalExpenses),
      icon: TrendingDown,
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 to-pink-50',
      darkBgGradient: 'from-red-900/20 to-pink-900/20',
      borderColor: 'border-red-200',
      darkBorderColor: 'dark:border-red-800',
      textColor: 'text-red-700',
      darkTextColor: 'dark:text-red-300',
      trend: 'negative',
      trendIcon: ArrowDownRight,
    },
    {
      title: t('netBalance'),
      value: formatAmount(stats.netBalance),
      icon: DollarSign,
      gradient: stats.netBalance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600',
      bgGradient: stats.netBalance >= 0 ? 'from-blue-50 to-indigo-50' : 'from-orange-50 to-red-50',
      darkBgGradient: stats.netBalance >= 0 ? 'from-blue-900/20 to-indigo-900/20' : 'from-orange-900/20 to-red-900/20',
      borderColor: stats.netBalance >= 0 ? 'border-blue-200' : 'border-orange-200',
      darkBorderColor: stats.netBalance >= 0 ? 'dark:border-blue-800' : 'dark:border-orange-800',
      textColor: stats.netBalance >= 0 ? 'text-blue-700' : 'text-orange-700',
      darkTextColor: stats.netBalance >= 0 ? 'dark:text-blue-300' : 'dark:text-orange-300',
      trend: stats.netBalance >= 0 ? 'positive' : 'negative',
      trendIcon: stats.netBalance >= 0 ? ArrowUpRight : ArrowDownRight,
    },
    {
      title: t('totalTransactions'),
      value: stats.transactionCount.toString(),
      icon: Receipt,
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      darkBgGradient: 'from-purple-900/20 to-violet-900/20',
      borderColor: 'border-purple-200',
      darkBorderColor: 'dark:border-purple-800',
      textColor: 'text-purple-700',
      darkTextColor: 'dark:text-purple-300',
      trend: 'neutral',
      trendIcon: ArrowUpRight,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} ${card.darkBorderColor} bg-gradient-to-br ${card.bgGradient} dark:bg-gradient-to-br ${card.darkBgGradient} p-6 transition-all duration-300 hover-lift animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className={`p-2 rounded-lg ${card.trend === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30' : card.trend === 'negative' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <TrendIcon className={`w-4 h-4 ${card.trend === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : card.trend === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${card.textColor} ${card.darkTextColor}`}>
                  {card.value}
                </p>
              </div>
              
              {/* Status indicator */}
              {card.title === t('netBalance') && (
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stats.netBalance >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${
                    stats.netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stats.netBalance >= 0 ? t('positiveBalance') : t('negativeBalance')}
                  </span>
                </div>
              )}
              
              {/* Hover effect indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 