export interface Category {
  name: string;
  color: string;
  type: 'income' | 'expense';
}

export interface CategoryConfig {
  income: Category[];
  expense: Category[];
}

export const DEFAULT_CATEGORIES: CategoryConfig = {
  income: [
    { name: 'Salary', color: '#10B981', type: 'income' },
    { name: 'Freelance', color: '#3B82F6', type: 'income' },
    { name: 'Investment', color: '#8B5CF6', type: 'income' },
    { name: 'Gift', color: '#F59E0B', type: 'income' },
    { name: 'Other', color: '#6B7280', type: 'income' }
  ],
  expense: [
    { name: 'Food', color: '#EF4444', type: 'expense' },
    { name: 'Transport', color: '#3B82F6', type: 'expense' },
    { name: 'Entertainment', color: '#8B5CF6', type: 'expense' },
    { name: 'Shopping', color: '#EC4899', type: 'expense' },
    { name: 'Bills', color: '#F59E0B', type: 'expense' },
    { name: 'Healthcare', color: '#10B981', type: 'expense' },
    { name: 'Education', color: '#06B6D4', type: 'expense' },
    { name: 'Other', color: '#6B7280', type: 'expense' }
  ]
};

export const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Sky
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#374151', // Gray Dark
]; 