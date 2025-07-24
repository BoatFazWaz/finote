import { Transaction } from '@/types/Transaction';
import { subDays, subMonths, format } from 'date-fns';

const DEMO_CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Bonus', 'Side Job'],
  expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Rent', 'Utilities', 'Insurance']
};

const DEMO_DESCRIPTIONS = {
  income: [
    'Monthly salary payment',
    'Freelance project payment',
    'Investment dividend',
    'Birthday gift from family',
    'Performance bonus',
    'Part-time job payment',
    'Online course income',
    'Consulting fee',
    'Stock dividend',
    'Rental income'
  ],
  expense: [
    'Grocery shopping',
    'Bus fare',
    'Movie tickets',
    'New clothes',
    'Electricity bill',
    'Doctor visit',
    'Online course',
    'Restaurant dinner',
    'Gas station',
    'Phone bill',
    'Internet subscription',
    'Coffee shop',
    'Gym membership',
    'Insurance premium',
    'Home maintenance'
  ]
};

export const generateDemoData = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Generate 6 months of historical data
  for (let month = 0; month < 6; month++) {
    const monthStart = subMonths(today, month);
    
    // Generate 15-25 transactions per month
    const transactionsPerMonth = Math.floor(Math.random() * 11) + 15;
    
    for (let i = 0; i < transactionsPerMonth; i++) {
      const isIncome = Math.random() < 0.3; // 30% income, 70% expense
      const category = isIncome 
        ? DEMO_CATEGORIES.income[Math.floor(Math.random() * DEMO_CATEGORIES.income.length)]
        : DEMO_CATEGORIES.expense[Math.floor(Math.random() * DEMO_CATEGORIES.expense.length)];
      
      const descriptions = isIncome ? DEMO_DESCRIPTIONS.income : DEMO_DESCRIPTIONS.expense;
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      // Random date within the month
      const randomDays = Math.floor(Math.random() * 30);
      const transactionDate = subDays(monthStart, randomDays);
      
      // Generate realistic amounts
      let amount: number;
      if (isIncome) {
        if (category === 'Salary') {
          amount = Math.floor(Math.random() * 20000) + 30000; // 30k-50k
        } else if (category === 'Bonus') {
          amount = Math.floor(Math.random() * 15000) + 5000; // 5k-20k
        } else {
          amount = Math.floor(Math.random() * 8000) + 1000; // 1k-9k
        }
      } else {
        if (category === 'Rent') {
          amount = Math.floor(Math.random() * 10000) + 15000; // 15k-25k
        } else if (category === 'Bills' || category === 'Utilities') {
          amount = Math.floor(Math.random() * 3000) + 1000; // 1k-4k
        } else if (category === 'Food') {
          amount = Math.floor(Math.random() * 500) + 100; // 100-600
        } else {
          amount = Math.floor(Math.random() * 2000) + 200; // 200-2200
        }
      }
      
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        date: format(transactionDate, 'yyyy-MM-dd'),
        type: isIncome ? 'income' : 'expense',
        category,
        description,
        amount: Math.round(amount / 100) * 100, // Round to nearest 100
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      transactions.push(transaction);
    }
  }
  
  // Sort by date (oldest first)
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const generateQuickDemoData = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Generate 30 days of recent data
  for (let day = 0; day < 30; day++) {
    const transactionDate = subDays(today, day);
    
    // 1-3 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < transactionsPerDay; i++) {
      const isIncome = Math.random() < 0.2; // 20% income, 80% expense
      const category = isIncome 
        ? DEMO_CATEGORIES.income[Math.floor(Math.random() * DEMO_CATEGORIES.income.length)]
        : DEMO_CATEGORIES.expense[Math.floor(Math.random() * DEMO_CATEGORIES.expense.length)];
      
      const descriptions = isIncome ? DEMO_DESCRIPTIONS.income : DEMO_DESCRIPTIONS.expense;
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      // Generate realistic amounts
      let amount: number;
      if (isIncome) {
        amount = Math.floor(Math.random() * 5000) + 1000; // 1k-6k
      } else {
        amount = Math.floor(Math.random() * 1000) + 100; // 100-1100
      }
      
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        date: format(transactionDate, 'yyyy-MM-dd'),
        type: isIncome ? 'income' : 'expense',
        category,
        description,
        amount: Math.round(amount / 50) * 50, // Round to nearest 50
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      transactions.push(transaction);
    }
  }
  
  // Sort by date (oldest first)
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}; 