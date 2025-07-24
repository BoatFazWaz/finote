import { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === 'th';

  return {
    title: isThai ? 'ข้อกำหนดการใช้งาน - Finote' : 'Terms of Service - Finote',
    description: isThai
      ? 'ข้อกำหนดการใช้งานของ Finote - เรียนรู้เกี่ยวกับการใช้งานแอปพลิเคชัน'
      : 'Terms of Service for Finote - Learn about using our application',
    keywords: isThai
      ? 'ข้อกำหนดการใช้งาน, เงื่อนไขการใช้งาน, Finote'
      : 'terms of service, terms and conditions, Finote',
    openGraph: {
      title: isThai ? 'ข้อกำหนดการใช้งาน - Finote' : 'Terms of Service - Finote',
      description: isThai
        ? 'ข้อกำหนดการใช้งานของ Finote'
        : 'Terms of Service for Finote',
    },
  };
}

export default function TermsPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Terms of Service" 
        subtitle="Learn about using our application"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                By accessing and using Finote, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Use License
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Permission is granted to temporarily use Finote for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained in Finote</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Disclaimer
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The materials within Finote are provided on an &apos;as is&apos; basis. Finote makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Limitations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                In no event shall Finote or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Finote, even if Finote or a Finote authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Accuracy of Materials
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The materials appearing in Finote could include technical, typographical, or photographic errors. Finote does not warrant that any of the materials on its website are accurate, complete or current. Finote may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Links
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Finote has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Finote of the site. Use of any such linked website is at the user&apos;s own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Modifications
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Finote may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about these Terms of Service, please contact us at terms@finote.app
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 