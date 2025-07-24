# Finote - Income & Expense Tracker

A comprehensive financial management web application built with Next.js, TypeScript, and TailwindCSS. Track your income, expenses, and financial trends with beautiful charts and intuitive interface.

## ✨ Features

### Core Features
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Form Validation**: Comprehensive form validation with clear error messages
- **Local Storage**: Data persistence using browser localStorage
- **Transaction List**: Filterable table view with search and date range filtering
- **Dashboard**: Summary cards showing total income, expenses, net balance, and transaction count
- **Advanced Analytics**: Detailed financial insights and trends
- **Charts**: Beautiful visualizations using Recharts
  - Monthly Income vs Expenses bar chart
  - Net Balance trend line chart
  - Spending by category pie chart

### Optional Enhancements
- **Dark Mode**: Toggle between light and dark themes
- **CSV Export**: Export transaction data to CSV format
- **Budget Tracking**: Set and monitor spending limits by category
- **Financial Goals**: Set savings targets and track progress
- **Custom Categories**: Add, edit, and manage transaction categories
- **Advanced Analytics**: Detailed insights with savings rate, trends, and recommendations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finote
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with TailwindCSS
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── Analytics.tsx        # Advanced financial analytics
│   ├── BudgetTracker.tsx    # Budget tracking component
│   ├── CategoryManager.tsx  # Custom category management
│   ├── Charts.tsx           # Recharts components for data visualization
│   ├── DarkModeToggle.tsx   # Dark mode toggle component
│   ├── FinancialGoals.tsx   # Financial goals tracking
│   ├── SummaryCards.tsx     # Summary statistics cards
│   ├── TransactionForm.tsx  # Add/edit transaction form
│   └── TransactionTable.tsx # Transaction list with filtering
├── hooks/
│   └── useTransactions.ts   # Custom hook for transaction management
├── types/
│   └── Transaction.ts       # TypeScript interfaces
└── utils/
    ├── exportUtils.ts       # CSV export utilities
    └── sampleData.ts        # Sample transaction data
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Package Manager**: pnpm

## 📊 Data Structure

### Transaction Interface
```typescript
interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Default Categories
- **Income**: Salary, Freelance, Investment, Gift, Other
- **Expenses**: Food, Transport, Entertainment, Shopping, Bills, Healthcare, Education, Other

## 🎨 Features in Detail

### Transaction Form
- Date picker with validation
- Type selection (Income/Expense)
- Dynamic category dropdown based on type
- Description field with validation
- Amount field with currency formatting
- Form clears on successful submission

### Transaction Table
- Responsive table design
- Search functionality
- Advanced filtering (date range, type, category)
- Edit and delete actions
- Sortable columns

### Dashboard Charts
- **Bar Chart**: Monthly income vs expenses comparison
- **Line Chart**: Net balance trend over time
- **Pie Chart**: Spending breakdown by category with legend

### Dark Mode
- System preference detection
- Manual toggle with persistent storage
- Consistent theming across all components

## 🔧 Customization

### Adding New Categories
Edit the `DEFAULT_CATEGORIES` object in `src/hooks/useTransactions.ts`:

```typescript
export const DEFAULT_CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other']
};
```

### Styling
The app uses TailwindCSS v4 with a comprehensive dark mode implementation. All components are styled with utility classes and support both light and dark themes.

### Data Persistence
Currently uses localStorage for data persistence. To integrate with a database:

1. Replace localStorage operations in `useTransactions.ts`
2. Add API endpoints for CRUD operations
3. Update the hook to use fetch/axios calls

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

Built with ❤️ using Next.js, TypeScript, and TailwindCSS
