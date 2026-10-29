/**
 * Utility functions for WhatsApp integration
 */

/**
 * Normalizes customer phone number into official international format for WhatsApp (e.g. 919876543210).
 * - Strips all non-digit characters (+, -, spaces, brackets)
 * - Removes leading 0 if 11 digits (e.g. 09876543210 -> 9876543210)
 * - Prepends India's 91 country code for standard 10-digit mobile numbers
 * - Preserves existing 12-digit Indian numbers starting with 91 (does not double country code)
 * - Supports general international numbers (7 to 15 digits)
 * - Returns null if number is missing, empty, 'Not provided', or invalid (DOES NOT fall back to hardcoded numbers).
 */
export function getCustomerWhatsAppNumber(phone?: string | null): string | null {
  if (!phone || typeof phone !== 'string') return null;
  
  const trimmed = phone.trim();
  if (!trimmed || trimmed === '-' || trimmed === 'Not provided' || trimmed === 'Phone not available') {
    return null;
  }

  let clean = trimmed.replace(/\D/g, '');

  // Strip leading zero for 11-digit numbers (common Indian notation 09876543210)
  if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.slice(1);
  }

  // 10-digit Indian mobile number -> prefix 91
  if (clean.length === 10) {
    return `91${clean}`;
  }

  // 12-digit Indian mobile number with 91 already prefixed
  if (clean.length === 12 && clean.startsWith('91')) {
    return clean;
  }

  // Other valid international phone numbers (E.164: 7 to 15 digits)
  if (clean.length >= 7 && clean.length <= 15) {
    return clean;
  }

  return null;
}

/**
 * Formats a phone number for clean, compact UI display (e.g. "+91 9876543210").
 * Returns "Phone not available" if missing or invalid.
 */
export function formatStudentPhone(rawPhone?: string | null): string {
  if (!rawPhone || typeof rawPhone !== 'string') return 'Phone not available';
  
  const trimmed = rawPhone.trim();
  if (!trimmed || trimmed === '-' || trimmed === 'Not provided' || trimmed === 'Phone not available') {
    return 'Phone not available';
  }

  let digits = trimmed.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length === 10) {
    return `+91 ${digits}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`;
  } else if (digits.length >= 7) {
    return trimmed.startsWith('+') ? trimmed : `+${digits}`;
  }

  return 'Phone not available';
}

/**
 * Generates the official click-to-chat WhatsApp URL for a customer:
 * https://wa.me/INTERNATIONAL_NUMBER
 */
export function getCustomerWhatsAppUrl(phone?: string | null, orderPublicId?: string, customerName?: string): string | null {
  const cleanNumber = getCustomerWhatsAppNumber(phone);
  if (!cleanNumber) return null;

  let textParam = '';
  if (orderPublicId) {
    const greeting = customerName && customerName !== 'Not provided' ? `Hi ${customerName}, ` : 'Hi, ';
    const text = `${greeting}regarding your BLINTZY order ${orderPublicId}:`;
    textParam = `?text=${encodeURIComponent(text)}`;
  }

  return `https://wa.me/${cleanNumber}${textParam}`;
}

/**
 * Opens WhatsApp chat safely across desktop (WhatsApp Web / App) and mobile.
 * Returns true if successfully initiated, false if phone is invalid.
 */
export function openCustomerWhatsApp(
  phone: string | null | undefined, 
  orderPublicId?: string, 
  customerName?: string,
  onError?: (msg: string) => void
): boolean {
  const url = getCustomerWhatsAppUrl(phone, orderPublicId, customerName);
  
  if (!url) {
    if (onError) {
      const msg = phone && phone !== 'Not provided' && phone !== '-'
        ? `Invalid mobile number for student (${phone}).` 
        : 'Student phone number is not available for this order.';
      onError(msg);
    }
    return false;
  }

  if (typeof window !== 'undefined') {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return true;
}

/**
 * Normalizes any Indian or international phone number into the standard international format required by WhatsApp (e.g. 919652929243).
 * Defaults to business WhatsApp if not provided (for student self-service uploads).
 */
export function formatWhatsAppNumber(phone: string | null | undefined): string {
  if (!phone) {
    const envNum = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_BLINTZY_WHATSAPP_NUMBER : null;
    return envNum ? String(envNum).replace(/\D/g, '') : '919652929243';
  }

  let clean = String(phone).replace(/\D/g, '');

  if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.slice(1);
  }

  if (clean.length === 10) {
    clean = '91' + clean;
  }

  return clean || '919652929243';
}

/**
 * Builds the official WhatsApp direct-chat URL (defaults to business number if empty).
 */
export function getWhatsAppChatUrl(phone: string | null | undefined, message?: string): string {
  const cleanNumber = formatWhatsAppNumber(phone);
  const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanNumber}${textParam}`;
}

/**
 * Opens WhatsApp chat directly to the specified phone number with pre-filled message text.
 */
export function openWhatsAppChat(phone: string | null | undefined, message?: string) {
  const url = getWhatsAppChatUrl(phone, message);

  if (typeof window !== 'undefined') {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
