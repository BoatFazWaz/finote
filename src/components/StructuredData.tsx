'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  locale: string;
}

export default function StructuredData({ locale }: StructuredDataProps) {
  useEffect(() => {
    // WebApplication Schema
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": locale === 'th' ? "Finote - ระบบจัดการการเงินส่วนบุคคล" : "Finote - Personal Finance Management",
      "description": locale === 'th' 
        ? "แอปพลิเคชันจัดการการเงินส่วนบุคคลที่ครบครัน พร้อม AI Assistant สำหรับติดตามรายได้ ค่าใช้จ่าย งบประมาณ และเป้าหมายทางการเงิน"
        : "Comprehensive personal finance management app with AI Assistant for tracking income, expenses, budgets, and financial goals.",
      "url": "https://finote.app",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Person",
        "name": "North"
      },
      "featureList": [
        "AI Financial Assistant",
        "Expense Tracking",
        "Budget Management",
        "Financial Goals",
        "Recurring Transaction Detection",
        "Financial Health Score",
        "Multi-language Support",
        "Dark Mode"
      ],
      "screenshot": "https://finote.app/screenshot.png",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150"
      }
    };

    // FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": locale === 'th' ? "Finote คืออะไร?" : "What is Finote?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'th' 
              ? "Finote เป็นแอปพลิเคชันจัดการการเงินส่วนบุคคลที่ครบครัน พร้อม AI Assistant สำหรับติดตามรายได้ ค่าใช้จ่าย งบประมาณ และเป้าหมายทางการเงิน"
              : "Finote is a comprehensive personal finance management app with AI Assistant for tracking income, expenses, budgets, and financial goals."
          }
        },
        {
          "@type": "Question",
          "name": locale === 'th' ? "Finote ฟรีหรือไม่?" : "Is Finote free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'th' 
              ? "ใช่ Finote เป็นแอปพลิเคชันฟรีที่ไม่มีค่าใช้จ่ายใดๆ"
              : "Yes, Finote is completely free to use with no hidden costs."
          }
        },
        {
          "@type": "Question",
          "name": locale === 'th' ? "ข้อมูลของฉันปลอดภัยหรือไม่?" : "Is my data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'th' 
              ? "ข้อมูลทั้งหมดจะถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์"
              : "All data is stored locally on your device only. No data is sent to any servers."
          }
        },
        {
          "@type": "Question",
          "name": locale === 'th' ? "AI Assistant ทำอะไรได้บ้าง?" : "What can the AI Assistant do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'th' 
              ? "AI Assistant สามารถวิเคราะห์รูปแบบการใช้จ่าย ตรวจจับธุรกรรมที่เกิดขึ้นซ้ำ ให้คำแนะนำทางการเงิน และคำนวณคะแนนสุขภาพทางการเงิน"
              : "The AI Assistant can analyze spending patterns, detect recurring transactions, provide financial advice, and calculate financial health scores."
          }
        }
      ]
    };

    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Finote",
      "url": "https://finote.app",
      "logo": "https://finote.app/favicon.svg",
      "description": locale === 'th' 
        ? "แอปพลิเคชันจัดการการเงินส่วนบุคคลที่ครบครัน พร้อม AI Assistant"
        : "Comprehensive personal finance management app with AI Assistant",
      "sameAs": [
        "https://github.com/north",
        "https://twitter.com/finote_app"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@finote.app"
      }
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": locale === 'th' ? "หน้าแรก" : "Home",
          "item": "https://finote.app"
        }
      ]
    };

    // Add structured data to the document
    const addStructuredData = (schema: object, id: string) => {
      // Remove existing script if it exists
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    addStructuredData(webAppSchema, 'webapp-schema');
    addStructuredData(faqSchema, 'faq-schema');
    addStructuredData(organizationSchema, 'organization-schema');
    addStructuredData(breadcrumbSchema, 'breadcrumb-schema');

    // Cleanup function
    return () => {
      ['webapp-schema', 'faq-schema', 'organization-schema', 'breadcrumb-schema'].forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };
  }, [locale]);

  return null;
} 