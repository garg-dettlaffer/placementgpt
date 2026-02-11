import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// CLASSNAME UTILITIES
// ============================================
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ============================================
// STRING UTILITIES
// ============================================
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str, length = 50) {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================
// NUMBER UTILITIES
// ============================================
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value, decimals = 0) {
  return `${value.toFixed(decimals)}%`;
}

// ============================================
// DATE UTILITIES
// ============================================
export function formatDate(date, format = 'short') {
  if (!date) return '';
  const d = new Date(date);
  
  const formats = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: 'numeric', minute: '2-digit', hour12: true },
    full: { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }
  };
  
  return new Intl.DateTimeFormat('en-US', formats[format] || formats.short).format(d);
}

export function formatRelativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

export function getTimeDifference(start, end) {
  const diff = new Date(end) - new Date(start);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  return { hours, minutes, seconds };
}

// ============================================
// VALIDATION UTILITIES
// ============================================
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function getPasswordStrength(password) {
  if (!password) return { strength: 0, label: 'Empty' };
  
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  
  Object.values(checks).forEach(check => {
    if (check) strength += 20;
  });
  
  const labels = {
    0: 'Empty',
    20: 'Very Weak',
    40: 'Weak',
    60: 'Medium',
    80: 'Strong',
    100: 'Very Strong',
  };
  
  return {
    strength,
    label: labels[strength],
    checks
  };
}

// ============================================
// ARRAY UTILITIES
// ============================================
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function unique(array, key) {
  if (!key) return [...new Set(array)];
  return array.filter((item, index, self) => 
    index === self.findIndex(t => t[key] === item[key])
  );
}

export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}

// ============================================
// STORAGE UTILITIES
// ============================================
export function getLocalStorage(key, defaultValue = null) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
}

export function removeLocalStorage(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

// ============================================
// URL UTILITIES
// ============================================
export function buildQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString();
}

export function parseQueryString(search) {
  const params = new URLSearchParams(search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

// ============================================
// MISC UTILITIES
// ============================================
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (error) {
    document.body.removeChild(textArea);
    return Promise.reject(error);
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

// ============================================
// DIFFICULTY COLOR HELPERS
// ============================================
export function getDifficultyColor(difficulty) {
  const colors = {
    Easy: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    Medium: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    Hard: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  };
  return colors[difficulty] || colors.Medium;
}

export function getStatusColor(status) {
  const colors = {
    HIRING: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    CLOSED: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30',
    SOON: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    PAUSED: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
  };
  return colors[status] || colors.SOON;
}

// ============================================
// CODE EXECUTION HELPERS
// ============================================
export function parseTestCases(testCasesString) {
  try {
    return testCasesString.split('\n\n').map(tc => {
      const [input, output] = tc.split('\n---\n');
      return { input: input.trim(), output: output.trim() };
    });
  } catch (error) {
    console.error('Error parsing test cases:', error);
    return [];
  }
}

export function compareOutputs(expected, actual) {
  const normalize = str => str.replace(/\s+/g, ' ').trim();
  return normalize(expected) === normalize(actual);
}

// ============================================
// ANALYTICS HELPERS
// ============================================
export function calculateAccuracy(solved, attempted) {
  if (attempted === 0) return 0;
  return Math.round((solved / attempted) * 100);
}

export function getStreakDays(lastActiveDate) {
  if (!lastActiveDate) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = new Date(lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 1; // Active today
  if (diffDays === 1) return 1; // Active yesterday, start new streak
  return 0; // Streak broken
}

export default {
  cn,
  capitalize,
  slugify,
  truncate,
  getInitials,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  getTimeDifference,
  isValidEmail,
  getPasswordStrength,
  chunk,
  shuffle,
  unique,
  groupBy,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  buildQueryString,
  parseQueryString,
  debounce,
  throttle,
  copyToClipboard,
  sleep,
  generateId,
  getDifficultyColor,
  getStatusColor,
  parseTestCases,
  compareOutputs,
  calculateAccuracy,
  getStreakDays,
};
