/**
 * Security and sanitization utilities
 */

/**
 * Designated administrative email address authorized for the Admin Operations Console.
 * Strictly limited to langcasen@gmail.com with password office@12 as instructed.
 */
export const PRIMARY_ADMIN_EMAIL = 'langcasen@gmail.com';
export const PRIMARY_ADMIN_PASSWORD = 'office@12';

export const DESIGNATED_ADMIN_EMAILS: readonly string[] = [
  PRIMARY_ADMIN_EMAIL,
];

/**
 * Checks whether an email address belongs to the designated administrator (case-insensitive)
 */
export function isDesignatedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
}

/**
 * Resolves user role based on email.
 * Strictly enforces that ONLY langcasen@gmail.com can hold the 'admin' role.
 * All other accounts are strictly 'user' role and cannot access the admin panel.
 */
export function resolveUserRole(
  email?: string | null,
  _profileRole?: string | null,
  _metadataRole?: string | null
): 'admin' | 'user' {
  if (isDesignatedAdminEmail(email)) {
    return 'admin';
  }
  return 'user';
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validates international phone numbers (7 to 15 digits, allowing +, spaces, hyphens, parens)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) return false;
  const allowedCharsRegex = /^[\d\s+\-()./]+$/;
  return allowedCharsRegex.test(phone.trim());
}

/**
 * Normalizes text, removes control characters, caps length without stripping angle brackets
 */
export function sanitizeText(text: string, maxLength = 6000): string {
  if (!text) return '';
  // Remove control characters (ASCII 0-31, except newline and tab)
  const clean = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return clean.trim().slice(0, maxLength);
}

/**
 * Verifies if an image URL is safe (HTTPS, HTTP, or safe image data URI)
 */
export function isSafeImageUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return true;
  }
  if (trimmed.startsWith('data:image/jpeg;') ||
      trimmed.startsWith('data:image/png;') ||
      trimmed.startsWith('data:image/webp;') ||
      trimmed.startsWith('data:image/avif;')) {
    return true;
  }
  return false;
}

/**
 * Generates an accent-safe kebab-case slug from a title string
 */
export function generateSafeSlug(title: string): string {
  if (!title) return '';
  return title
    .normalize('NFD') // decompose accents
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/[\s_]+/g, '-') // collapse whitespace and underscores
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

/**
 * Escapes characters that have special meaning in PostgREST .or() / .ilike() filter strings
 */
export function escapeFilterValue(value: string): string {
  if (!value) return '';
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/"/g, '\\"');
}

/**
 * Safely exports data rows to a CSV Blob download, neutralizing spreadsheet formula injections
 */
export function exportToCsvSafe(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]): void {
  const sanitizeCell = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    let str = String(val);

    // Neutralize formula injection if first character is =, +, -, @, or tab/CR
    if (/^[=+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }

    // Escape double quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  };

  const csvContent = [
    headers.map(sanitizeCell).join(','),
    ...rows.map(row => row.map(sanitizeCell).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
