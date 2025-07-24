export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: string;
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: 'income' | 'expense';
  category?: string;
  search?: string;
}

export interface SummaryStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
} 