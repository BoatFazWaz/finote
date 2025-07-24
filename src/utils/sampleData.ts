import { Transaction } from '@/types/Transaction';

export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'income',
    category: 'Salary',
    description: 'Monthly salary payment',
    amount: 5000,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    date: '2024-01-16',
    type: 'expense',
    category: 'Food',
    description: 'Grocery shopping at Walmart',
    amount: 120.50,
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    date: '2024-01-17',
    type: 'expense',
    category: 'Transport',
    description: 'Gas station fill-up',
    amount: 45.00,
    createdAt: '2024-01-17T08:15:00Z',
    updatedAt: '2024-01-17T08:15:00Z',
  },
  {
    id: '4',
    date: '2024-01-18',
    type: 'income',
    category: 'Freelance',
    description: 'Web development project payment',
    amount: 800,
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '5',
    date: '2024-01-19',
    type: 'expense',
    category: 'Entertainment',
    description: 'Movie tickets and dinner',
    amount: 85.00,
    createdAt: '2024-01-19T19:20:00Z',
    updatedAt: '2024-01-19T19:20:00Z',
  },
  {
    id: '6',
    date: '2024-01-20',
    type: 'expense',
    category: 'Bills',
    description: 'Electricity bill payment',
    amount: 95.75,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
  },
  {
    id: '7',
    date: '2024-01-21',
    type: 'expense',
    category: 'Shopping',
    description: 'New clothes from department store',
    amount: 150.00,
    createdAt: '2024-01-21T15:30:00Z',
    updatedAt: '2024-01-21T15:30:00Z',
  },
  {
    id: '8',
    date: '2024-01-22',
    type: 'income',
    category: 'Investment',
    description: 'Dividend payment from stocks',
    amount: 125.00,
    createdAt: '2024-01-22T09:15:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
  },
  {
    id: '9',
    date: '2024-01-23',
    type: 'expense',
    category: 'Healthcare',
    description: 'Doctor appointment copay',
    amount: 25.00,
    createdAt: '2024-01-23T13:45:00Z',
    updatedAt: '2024-01-23T13:45:00Z',
  },
  {
    id: '10',
    date: '2024-01-24',
    type: 'expense',
    category: 'Education',
    description: 'Online course subscription',
    amount: 49.99,
    createdAt: '2024-01-24T10:30:00Z',
    updatedAt: '2024-01-24T10:30:00Z',
  },
];

export const loadSampleData = (): void => {
  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem('finote_transactions');
    if (!existing || JSON.parse(existing).length === 0) {
      localStorage.setItem('finote_transactions', JSON.stringify(sampleTransactions));
    }
  }
}; 