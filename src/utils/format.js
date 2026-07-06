/**
 * Format a number as currency using the Nigerian locale.
 * @param {number} amount
 * @param {string} [currency='NGN']
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);

/**
 * Format an ISO date string as a short readable date.
 * @param {string} dateStr
 * @param {object} [options] - Intl.DateTimeFormat options override
 * @returns {string}
 */
export const formatDate = (dateStr, options) =>
  new Date(dateStr).toLocaleDateString(
    'en-NG',
    options || { day: 'numeric', month: 'short', year: 'numeric' }
  );

/**
 * Format an ISO date string including time.
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDateWithTime = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
