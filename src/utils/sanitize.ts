/**
 * Security utilities for sanitizing user input
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes script tags and dangerous attributes
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  
  // Create a temporary div element
  const div = document.createElement('div');
  div.textContent = html; // textContent automatically escapes HTML
  return div.innerHTML;
}

/**
 * Sanitize text input - removes HTML tags and dangerous characters
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>]/g, '');
  
  // Limit length to prevent DoS
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }
  
  return sanitized.trim();
}

/**
 * Sanitize user name - allows alphanumeric, spaces, and common punctuation
 */
export function sanitizeUserName(name: string): string {
  if (!name) return 'Player';
  
  // Allow letters, numbers, spaces, and common punctuation
  let sanitized = name.replace(/[^a-zA-Z0-9\s\-_.,!?]/g, '');
  
  // Limit length
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }
  
  return sanitized.trim() || 'Player';
}

/**
 * Sanitize feedback text
 */
export function sanitizeFeedback(text: string): string {
  return sanitizeText(text);
}

