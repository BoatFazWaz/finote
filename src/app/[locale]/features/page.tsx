import { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === 'th';

  return {
    title: isThai ? 'คุณสมบัติ - Finote' : 'Features - Finote',
    description: isThai
      ? 'ดูคุณสมบัติทั้งหมดของ Finote - AI Assistant, การติดตามค่าใช้จ่าย, การจัดการงบประมาณ, และเป้าหมายทางการเงิน'
      : 'Explore all features of Finote - AI Assistant, expense tracking, budget management, and financial goals',
    keywords: isThai
      ? 'คุณสมบัติ, AI Assistant, ติดตามค่าใช้จ่าย, งบประมาณ, เป้าหมายทางการเงิน'
      : 'features, AI assistant, expense tracking, budget management, financial goals',
    openGraph: {
      title: isThai ? 'คุณสมบัติ - Finote' : 'Features - Finote',
      description: isThai
        ? 'ดูคุณสมบัติทั้งหมดของ Finote'
        : 'Explore all features of Finote',
    },
  };
}

export default function FeaturesPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Features" 
        subtitle="Discover all the powerful features that make Finote the ultimate personal finance management app"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI Financial Assistant */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Financial Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized financial insights and recommendations powered by AI
            </p>
          </div>

          {/* Expense Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Expense Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track all your income and expenses with detailed categorization
            </p>
          </div>

          {/* Budget Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Budget Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set and monitor budgets for different spending categories
            </p>
          </div>

          {/* Financial Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Financial Goals
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set and track progress towards your financial goals
            </p>
          </div>

          {/* Recurring Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🔄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Recurring Transactions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically detect and manage recurring payments
            </p>
          </div>

          {/* Financial Health Score */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">❤️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Financial Health Score
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get a comprehensive score of your financial well-being
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start using Finote today and experience the power of AI-driven financial management
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
} 