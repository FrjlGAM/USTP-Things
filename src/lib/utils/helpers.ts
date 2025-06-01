/**
 * Format a price with currency symbol
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted price string
 */
export const formatPrice = (amount: number, currency: string = 'PHP'): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - Whether to add '...' at the end (default: true)
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number, ellipsis: boolean = true): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return ellipsis ? `${text.substring(0, maxLength)}...` : text.substring(0, maxLength);
};

/**
 * Generate a unique ID
 * @returns A unique ID string
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Debounce a function
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced function
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<F>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format a date to a readable string
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

/**
 * Validate an email address
 * @param email - The email to validate
 * @returns Boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Convert a string to URL-friendly slug
 * @param text - The text to convert
 * @returns URL-friendly slug
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Deep clone an object
 * @param obj - The object to clone
 * @returns A deep clone of the object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param obj - The object to check
 * @returns Boolean indicating if the object is empty
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Generate a random integer between min and max (inclusive)
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random integer between min and max
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
