'use client';

import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical,
  noIndex = false,
  structuredData
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | Finote` : 'Finote - Personal Finance Management';
  const fullDescription = description || 'Comprehensive personal finance management app with AI Assistant for tracking income, expenses, budgets, and financial goals. Free, secure, and easy to use.';
  const fullKeywords = keywords || 'personal finance, expense tracker, budget management, financial goals, AI assistant, money management, income tracking, expense control, financial planning';
  const canonicalUrl = canonical ? `https://finote.app${canonical}` : 'https://finote.app';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={`https://finote.app${ogImage}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Finote" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={`https://finote.app${ogImage}`} />
      <meta name="twitter:site" content="@finote_app" />
      <meta name="twitter:creator" content="@finote_app" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  );
} 