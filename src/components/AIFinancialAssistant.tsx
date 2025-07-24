'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/Transaction';
import { useToastContext } from '@/hooks/useToastContext';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, DollarSign, Target, Zap } from 'lucide-react';

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'debt' | 'investment' | 'other';
  createdAt: string;
}

interface AIFinancialAssistantProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
}

interface Insight {
  type: 'positive' | 'warning' | 'tip' | 'achievement';
  title: string;
  message: string;
  icon: React.ReactNode;
  action?: string;
}

export default function AIFinancialAssistant({ transactions, budgets, goals }: AIFinancialAssistantProps) {
  const toast = useToastContext();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateInsights = useCallback(() => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const newInsights: Insight[] = [];
      
      // Analyze spending patterns
      const recentTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return transactionDate >= thirtyDaysAgo;
      });

      const totalIncome = recentTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = recentTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

      // Savings rate insights
      if (savingsRate >= 20) {
        newInsights.push({
          type: 'positive',
          title: 'Excellent Savings Rate!',
          message: `You're saving ${savingsRate.toFixed(1)}% of your income. This is above the recommended 20% threshold.`,
          icon: <TrendingUp className="w-5 h-5" />
        });
      } else if (savingsRate < 10) {
        newInsights.push({
          type: 'warning',
          title: 'Low Savings Rate',
          message: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing your savings to at least 20%.`,
          icon: <AlertTriangle className="w-5 h-5" />,
          action: 'Review your expenses'
        });
      }

      // Spending category analysis
      const categorySpending = new Map<string, number>();
      recentTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          categorySpending.set(t.category, (categorySpending.get(t.category) || 0) + t.amount);
        });

      const topSpendingCategory = Array.from(categorySpending.entries())
        .sort(([,a], [,b]) => b - a)[0];

      if (topSpendingCategory && topSpendingCategory[1] > totalIncome * 0.3) {
        newInsights.push({
          type: 'warning',
          title: 'High Category Spending',
          message: `${topSpendingCategory[0]} accounts for ${((topSpendingCategory[1] / totalIncome) * 100).toFixed(1)}% of your income.`,
          icon: <DollarSign className="w-5 h-5" />,
          action: 'Review budget for this category'
        });
      }

      // Budget insights
      budgets.forEach(budget => {
        const spent = recentTransactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const percentage = (spent / budget.amount) * 100;
        
        if (percentage >= 90) {
          newInsights.push({
            type: 'warning',
            title: 'Budget Alert',
            message: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget.`,
            icon: <Target className="w-5 h-5" />,
            action: 'Monitor spending'
          });
        }
      });

      // Goal progress insights
      goals.forEach(goal => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        
        if (progress >= 100) {
          newInsights.push({
            type: 'achievement',
            title: 'Goal Achieved!',
            message: `Congratulations! You've reached your ${goal.name} goal.`,
            icon: <Zap className="w-5 h-5" />
          });
        } else if (daysRemaining < 30 && progress < 75) {
          newInsights.push({
            type: 'warning',
            title: 'Goal Deadline Approaching',
            message: `Your ${goal.name} goal is ${daysRemaining} days away with ${progress.toFixed(1)}% progress.`,
            icon: <Target className="w-5 h-5" />,
            action: 'Increase contributions'
          });
        }
      });

      // General tips
      if (newInsights.length < 3) {
        newInsights.push({
          type: 'tip',
          title: 'Smart Tip',
          message: 'Consider setting up automatic transfers to your savings account to build wealth consistently.',
          icon: <Lightbulb className="w-5 h-5" />
        });
      }

      setInsights(newInsights.slice(0, 5)); // Limit to 5 insights
      setIsAnalyzing(false);
    }, 1000);
  }, [transactions, budgets, goals]);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'tip': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'achievement': return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getInsightIconColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'tip': return 'text-blue-600 dark:text-blue-400';
      case 'achievement': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Financial Assistant
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Smart insights and personalized recommendations
          </p>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Analyzing your financial data...</span>
          </div>
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Add more transactions to get personalized insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${getInsightIconColor(insight.type)}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {insight.message}
                  </p>
                  {insight.action && (
                    <button
                      onClick={() => toast.showInfo('Action', insight.action)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {insight.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={generateInsights}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer"
        >
          Refresh Insights
        </button>
      </div>
    </div>
  );
} 