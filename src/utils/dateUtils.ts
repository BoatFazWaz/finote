import { format, parseISO } from 'date-fns';

const MONTH_MAPPING = {
  'Jan': 'jan',
  'Feb': 'feb',
  'Mar': 'mar',
  'Apr': 'apr',
  'May': 'may',
  'Jun': 'jun',
  'Jul': 'jul',
  'Aug': 'aug',
  'Sep': 'sep',
  'Oct': 'oct',
  'Nov': 'nov',
  'Dec': 'dec'
};

export const formatLocalizedDate = (date: string | Date, formatString: string, t: (key: string) => string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const formatted = format(dateObj, formatString);
  
  // Replace English month abbreviations with localized ones
  return formatted.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (match) => {
    const monthKey = MONTH_MAPPING[match as keyof typeof MONTH_MAPPING];
    return t(monthKey);
  });
};

export const formatLocalizedMonth = (date: string | Date, t: (key: string) => string): string => {
  return formatLocalizedDate(date, 'MMM yyyy', t);
};

export const formatLocalizedDateFull = (date: string | Date, t: (key: string) => string): string => {
  return formatLocalizedDate(date, 'MMM dd, yyyy', t);
}; 