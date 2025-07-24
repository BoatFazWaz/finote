import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Define supported locales
  const locales = ['th', 'en'];
  
  // Validate that the incoming `locale` parameter is valid
  // If locale is undefined or invalid, use Thai as default
  const validLocale = (locale && locales.includes(locale)) ? locale : 'th';

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default
  };
}); 