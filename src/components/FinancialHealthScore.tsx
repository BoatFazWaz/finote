'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/Transaction';
import { Heart, TrendingUp, Shield, Target, Zap, AlertTriangle } from 'lucide-react';

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

interface FinancialHealthScoreProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
}

interface HealthMetric {
  name: string;
  score: number;
  weight: number;
  description: string;
  icon: React.ReactNode;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export default function FinancialHealthScore({ transactions, budgets, goals }: FinancialHealthScoreProps) {
  const [healthScore, setHealthScore] = useState(0);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateHealthScore = useCallback(() => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const newMetrics: HealthMetric[] = [];
      
      // 1. Savings Rate (30% weight)
      const recentTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return transactionDate >= threeMonthsAgo;
      });

      const totalIncome = recentTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = recentTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      let savingsScore = 0;
      let savingsStatus: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';

      if (savingsRate >= 20) {
        savingsScore = 100;
        savingsStatus = 'excellent';
      } else if (savingsRate >= 15) {
        savingsScore = 80;
        savingsStatus = 'good';
      } else if (savingsRate >= 10) {
        savingsScore = 60;
        savingsStatus = 'fair';
      } else {
        savingsScore = Math.max(0, savingsRate * 4);
        savingsStatus = 'poor';
      }

      newMetrics.push({
        name: 'Savings Rate',
        score: savingsScore,
        weight: 0.3,
        description: `${savingsRate.toFixed(1)}% of income saved`,
        icon: <TrendingUp className="w-5 h-5" />,
        status: savingsStatus
      });

      // 2. Budget Adherence (25% weight)
      let budgetScore = 100;
      let budgetStatus: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
      let overBudgetCount = 0;

      budgets.forEach(budget => {
        const spent = recentTransactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const percentage = (spent / budget.amount) * 100;
        if (percentage > 100) {
          overBudgetCount++;
        }
      });

      if (overBudgetCount === 0) {
        budgetScore = 100;
        budgetStatus = 'excellent';
      } else if (overBudgetCount <= budgets.length * 0.25) {
        budgetScore = 80;
        budgetStatus = 'good';
      } else if (overBudgetCount <= budgets.length * 0.5) {
        budgetScore = 60;
        budgetStatus = 'fair';
      } else {
        budgetScore = 30;
        budgetStatus = 'poor';
      }

      newMetrics.push({
        name: 'Budget Adherence',
        score: budgetScore,
        weight: 0.25,
        description: `${budgets.length - overBudgetCount}/${budgets.length} budgets on track`,
        icon: <Target className="w-5 h-5" />,
        status: budgetStatus
      });

      // 3. Goal Progress (20% weight)
      let goalScore = 100;
      let goalStatus: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
      let onTrackGoals = 0;

      goals.forEach(goal => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const expectedProgress = Math.max(0, ((365 - daysRemaining) / 365) * 100);
        
        if (progress >= expectedProgress) {
          onTrackGoals++;
        }
      });

      if (goals.length === 0) {
        goalScore = 100;
        goalStatus = 'excellent';
      } else if (onTrackGoals === goals.length) {
        goalScore = 100;
        goalStatus = 'excellent';
      } else if (onTrackGoals >= goals.length * 0.75) {
        goalScore = 80;
        goalStatus = 'good';
      } else if (onTrackGoals >= goals.length * 0.5) {
        goalScore = 60;
        goalStatus = 'fair';
      } else {
        goalScore = 30;
        goalStatus = 'poor';
      }

      newMetrics.push({
        name: 'Goal Progress',
        score: goalScore,
        weight: 0.2,
        description: `${onTrackGoals}/${goals.length} goals on track`,
        icon: <Zap className="w-5 h-5" />,
        status: goalStatus
      });

      // 4. Expense Consistency (15% weight)
      const monthlyExpenses = new Map<string, number>();
      const months = new Set<string>();

      recentTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          const month = t.date.substring(0, 7); // YYYY-MM
          months.add(month);
          monthlyExpenses.set(month, (monthlyExpenses.get(month) || 0) + t.amount);
        });

      const expenseValues = Array.from(monthlyExpenses.values());
      const avgExpense = expenseValues.reduce((a, b) => a + b, 0) / expenseValues.length;
      const variance = expenseValues.reduce((sum, expense) => 
        sum + Math.abs(expense - avgExpense), 0
      ) / expenseValues.length;
      
      const consistencyRatio = avgExpense > 0 ? (1 - (variance / avgExpense)) : 1;
      const consistencyScore = Math.max(0, consistencyRatio * 100);
      let consistencyStatus: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';

      if (consistencyScore >= 80) {
        consistencyStatus = 'excellent';
      } else if (consistencyScore >= 60) {
        consistencyStatus = 'good';
      } else if (consistencyScore >= 40) {
        consistencyStatus = 'fair';
      } else {
        consistencyStatus = 'poor';
      }

      newMetrics.push({
        name: 'Expense Consistency',
        score: consistencyScore,
        weight: 0.15,
        description: `${consistencyScore.toFixed(0)}% consistent spending`,
        icon: <Shield className="w-5 h-5" />,
        status: consistencyStatus
      });

      // 5. Emergency Fund (10% weight)
      const emergencyFundRatio = totalExpenses > 0 ? (totalIncome - totalExpenses) / (totalExpenses / 12) : 0;
      let emergencyScore = 0;
      let emergencyStatus: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';

      if (emergencyFundRatio >= 6) {
        emergencyScore = 100;
        emergencyStatus = 'excellent';
      } else if (emergencyFundRatio >= 3) {
        emergencyScore = 80;
        emergencyStatus = 'good';
      } else if (emergencyFundRatio >= 1) {
        emergencyScore = 60;
        emergencyStatus = 'fair';
      } else {
        emergencyScore = Math.max(0, emergencyFundRatio * 60);
        emergencyStatus = 'poor';
      }

      newMetrics.push({
        name: 'Emergency Fund',
        score: emergencyScore,
        weight: 0.1,
        description: `${emergencyFundRatio.toFixed(1)} months of expenses saved`,
        icon: <Heart className="w-5 h-5" />,
        status: emergencyStatus
      });

      setMetrics(newMetrics);

      // Calculate overall score
      const overallScore = newMetrics.reduce((total, metric) => 
        total + (metric.score * metric.weight), 0
      );

      setHealthScore(Math.round(overallScore));
      setIsCalculating(false);
    }, 1000);
  }, [transactions, budgets, goals]);

  useEffect(() => {
    calculateHealthScore();
  }, [calculateHealthScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'fair': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getHealthMessage = (score: number) => {
    if (score >= 80) return 'Excellent financial health! Keep up the great work.';
    if (score >= 60) return 'Good financial health. Consider improving savings rate.';
    if (score >= 40) return 'Fair financial health. Focus on budgeting and saving.';
    return 'Poor financial health. Consider seeking financial advice.';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Financial Health Score
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive analysis of your financial well-being
          </p>
        </div>
      </div>

      {isCalculating ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Calculating health score...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Overall Score */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(healthScore)} mb-4`}>
              <span className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
                {healthScore}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Overall Health Score
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getHealthMessage(healthScore)}
            </p>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                      {metric.icon}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {metric.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                      {Math.round(metric.score)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {metric.status}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric.score >= 80 ? 'bg-green-500' : 
                      metric.score >= 60 ? 'bg-blue-500' : 
                      metric.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Recommendations
            </h5>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {healthScore < 80 && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Focus on improving your lowest scoring metrics above</span>
                </div>
              )}
              {metrics.find(m => m.name === 'Savings Rate')?.score && metrics.find(m => m.name === 'Savings Rate')!.score < 60 && (
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Increase your savings rate to at least 20% of income</span>
                </div>
              )}
              {metrics.find(m => m.name === 'Emergency Fund')?.score && metrics.find(m => m.name === 'Emergency Fund')!.score < 60 && (
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Build an emergency fund covering 3-6 months of expenses</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={calculateHealthScore}
          className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-md hover:from-red-600 hover:to-pink-700 transition-all duration-200 cursor-pointer"
        >
          Recalculate Score
        </button>
      </div>
    </div>
  );
} 