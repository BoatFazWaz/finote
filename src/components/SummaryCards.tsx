'use client';

import { useTranslations } from 'next-intl';
import { SummaryStats } from '@/types/Transaction';
import { TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react';
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
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: t('totalExpenses'),
      value: formatAmount(stats.totalExpenses),
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      title: t('netBalance'),
      value: formatAmount(stats.netBalance),
      icon: DollarSign,
      color: stats.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: stats.netBalance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      borderColor: stats.netBalance >= 0 ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800',
    },
    {
      title: t('totalTransactions'),
      value: stats.transactionCount.toString(),
      icon: Receipt,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`p-6 rounded-lg border ${card.borderColor} ${card.bgColor} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.color} mt-1`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            
            {/* Optional: Add percentage change or trend indicator */}
            {card.title === t('netBalance') && (
              <div className="mt-3">
                <span className={`text-sm font-medium ${
                  stats.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stats.netBalance >= 0 ? t('positiveBalance') : t('negativeBalance')}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 