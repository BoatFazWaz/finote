'use client';

import { useTranslations } from 'next-intl';
import { Transaction, ChartData, MonthlyData } from '@/types/Transaction';
import { useCurrency } from '@/hooks/useCurrency';
import { format, startOfMonth, parseISO } from 'date-fns';
import { formatLocalizedMonth } from '@/utils/dateUtils';
import { formatNumberShorthand } from '@/utils/numberUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface ChartsProps {
  transactions: Transaction[];
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export default function Charts({ transactions }: ChartsProps) {
  const t = useTranslations('charts');
  const tMonths = useTranslations('months');
  const { formatAmount, currency } = useCurrency();
  
  // Prepare monthly data
  const getMonthlyData = (): MonthlyData[] => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>();

    transactions.forEach(transaction => {
      const monthKey = format(parseISO(transaction.date), 'yyyy-MM');
      const monthLabel = formatLocalizedMonth(transaction.date, tMonths);
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { income: 0, expenses: 0 });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else {
        monthData.expenses += transaction.amount;
      }
    });

    return Array.from(monthlyMap.entries())
      .map(([key, data]) => ({
        month: formatLocalizedMonth(key + '-01', tMonths),
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
      }))
      .sort((a, b) => parseISO(a.month + '-01').getTime() - parseISO(b.month + '-01').getTime());
  };

  // Prepare category data for pie chart
  const getCategoryData = (): ChartData[] => {
    const categoryMap = new Map<string, number>();

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const current = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, current + transaction.amount);
      });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatAmount(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Monthly Income vs Expenses Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('monthlyIncomeVsExpenses')}
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart key={`bar-${currency}`} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => formatAmount(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="income" fill="#10B981" name={t('income')} />
            <Bar dataKey="expenses" fill="#EF4444" name={t('expenses')} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Net Balance Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('netBalanceTrend')}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart key={`line-${currency}`} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => formatAmount(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="net" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              name={t('net')}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Spending Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('spendingByCategory')}
        </h3>
        {categoryData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart key={`pie-${currency}`}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatAmount(value), t('amount')]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Category Legend */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">{t('categoryBreakdown')}</h4>
              <div className="space-y-2">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatNumberShorthand(category.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('noChartData')}
          </div>
        )}
      </div>
    </div>
  );
} 