'use client';

import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  preloadImages?: string[];
  preloadFonts?: string[];
  prefetchUrls?: string[];
}

export default function PerformanceOptimizer({
  preloadImages = [],
  preloadFonts = [],
  prefetchUrls = []
}: PerformanceOptimizerProps) {
  useEffect(() => {
    // Preload critical images
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload fonts
    preloadFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Prefetch URLs
    prefetchUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });

    // Add resource hints for external domains
    const resourceHints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];

    resourceHints.forEach(({ rel, href, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) {
        link.crossOrigin = crossOrigin;
      }
      document.head.appendChild(link);
    });

    // Cleanup function
    return () => {
      // Remove any dynamically added links on unmount
      const links = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"]');
      links.forEach(link => {
        if (link.getAttribute('data-dynamic') === 'true') {
          link.remove();
        }
      });
    };
  }, [preloadImages, preloadFonts, prefetchUrls]);

  return null;
} 