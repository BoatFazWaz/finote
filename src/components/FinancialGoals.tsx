'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Transaction } from '@/types/Transaction';
import { useCurrency } from '@/hooks/useCurrency';
import { Plus, Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import { useToastContext } from '@/hooks/useToastContext';

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'debt' | 'investment' | 'other';
  createdAt: string;
}

interface FinancialGoalsProps {
  transactions: Transaction[];
}

export default function FinancialGoals({
}: FinancialGoalsProps) {
  const t = useTranslations('goals');
  const toast = useToastContext();
  const { formatAmount } = useCurrency();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'savings' as 'savings' | 'debt' | 'investment' | 'other'
  });

  // Load goals from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('finote_goals');
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  // Save goals to localStorage
  const saveGoals = (newGoals: FinancialGoal[]) => {
    localStorage.setItem('finote_goals', JSON.stringify(newGoals));
    setGoals(newGoals);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.targetAmount && formData.deadline) {
      try {
        if (editingGoal) {
          const updated = goals.map(g => 
            g.id === editingGoal.id 
              ? { 
                  ...g, 
                  name: formData.name, 
                  targetAmount: parseFloat(formData.targetAmount),
                  currentAmount: parseFloat(formData.currentAmount),
                  deadline: formData.deadline,
                  category: formData.category
                }
              : g
          );
          saveGoals(updated);
          setEditingGoal(null);
          toast.showSuccess(t('toast.goalUpdated'));
        } else {
          const newGoal: FinancialGoal = {
            id: crypto.randomUUID(),
            name: formData.name,
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: parseFloat(formData.currentAmount) || 0,
            deadline: formData.deadline,
            category: formData.category,
            createdAt: new Date().toISOString()
          };
          saveGoals([...goals, newGoal]);
          toast.showSuccess(t('toast.goalAdded'));
        }
        setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '', category: 'savings' });
        setShowAddForm(false);
      } catch {
        toast.showError(t('toast.error'), t('toast.unknownError'));
      }
    } else {
      toast.showError(t('toast.error'), t('toast.validationError'));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        saveGoals(goals.filter(g => g.id !== id));
        toast.showSuccess(t('toast.goalDeleted'));
      } catch {
        toast.showError(t('toast.error'), t('toast.unknownError'));
      }
    }
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category
    });
    setShowAddForm(true);
  };

  const updateProgress = (id: string, amount: number) => {
    const updated = goals.map(g => 
      g.id === id 
        ? { ...g, currentAmount: Math.max(0, g.currentAmount + amount) }
        : g
    );
    saveGoals(updated);
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'savings': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'debt': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'investment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'savings': return <TrendingUp size={16} />;
      case 'debt': return <Target size={16} />;
      case 'investment': return <TrendingUp size={16} />;
      default: return <Target size={16} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Financial Goals
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm cursor-pointer"
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      {/* Add/Edit Goal Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Goal name"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                required
              />
              
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'savings' | 'debt' | 'investment' | 'other' }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              >
                <option value="savings">Savings</option>
                <option value="debt">Debt Repayment</option>
                <option value="investment">Investment</option>
                <option value="other">Other</option>
              </select>
              
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="Target amount"
                step="0.01"
                min="0"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                required
              />
              
              <input
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                placeholder="Current amount"
                step="0.01"
                min="0"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              />
              
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {editingGoal ? 'Update Goal' : 'Add Goal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGoal(null);
                  setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '', category: 'savings' });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No financial goals set. Add a goal to start tracking your progress.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const remaining = goal.targetAmount - goal.currentAmount;
            
            return (
              <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {goal.name}
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(goal.category)}`}>
                      {getCategoryIcon(goal.category)}
                      {goal.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('progress')}: {formatAmount(goal.currentAmount)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('target')}: {formatAmount(goal.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage >= 100 ? 'bg-green-500' : percentage >= 75 ? 'bg-blue-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {percentage.toFixed(1)}% complete
                  </span>
                  <div className="text-right">
                    <div className={`font-medium ${remaining > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {remaining > 0 ? `${formatAmount(remaining)} ${t('remaining')}` : t('goalAchieved')}
                    </div>
                    <div className={`text-xs ${daysRemaining < 0 ? 'text-red-600 dark:text-red-400' : daysRemaining < 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                    </div>
                  </div>
                </div>
                
                {/* Quick Update Buttons */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => updateProgress(goal.id, 10)}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors cursor-pointer"
                  >
                    +{formatAmount(10)}
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, 50)}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors cursor-pointer"
                  >
                    +{formatAmount(50)}
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, 100)}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors cursor-pointer"
                  >
                    +{formatAmount(100)}
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, -10)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors cursor-pointer"
                  >
                    -{formatAmount(10)}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 