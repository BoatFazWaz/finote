import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['th', 'en'],
  defaultLocale: 'th',
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 