import { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === 'th';

  return {
    title: isThai ? 'นโยบายความเป็นส่วนตัว - Finote' : 'Privacy Policy - Finote',
    description: isThai
      ? 'นโยบายความเป็นส่วนตัวของ Finote - เรียนรู้ว่าเราจัดการข้อมูลของคุณอย่างไร'
      : 'Privacy Policy for Finote - Learn how we handle your data and protect your privacy',
    keywords: isThai
      ? 'นโยบายความเป็นส่วนตัว, การปกป้องข้อมูล, ความปลอดภัย, Finote'
      : 'privacy policy, data protection, security, Finote',
    openGraph: {
      title: isThai ? 'นโยบายความเป็นส่วนตัว - Finote' : 'Privacy Policy - Finote',
      description: isThai
        ? 'นโยบายความเป็นส่วนตัวของ Finote'
        : 'Privacy Policy for Finote',
    },
  };
}

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Privacy Policy" 
        subtitle="Learn how we handle your data and protect your privacy"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Collection and Storage
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Finote is designed with privacy in mind. All your financial data is stored locally on your device using your browser&apos;s local storage. We do not collect, store, or transmit any of your personal or financial information to our servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Local Storage
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your transaction data, budgets, goals, and preferences are stored locally in your browser. This means:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                <li>Your data never leaves your device</li>
                <li>We cannot access your financial information</li>
                <li>Your data is not shared with third parties</li>
                <li>You have complete control over your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Analytics and Performance
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use Vercel Analytics and Speed Insights to monitor app performance and usage patterns. These services collect anonymous usage data that does not include any personal or financial information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Deletion
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You can delete all your data at any time by clearing your browser&apos;s local storage or using the &quot;Clear All Data&quot; option in the app settings. Once deleted, your data cannot be recovered.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about this privacy policy, please contact us at privacy@finote.app
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 