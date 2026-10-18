/**
 * Utility functions for WhatsApp integration
 */

/**
 * Normalizes any Indian or international phone number into the standard international format required by WhatsApp (e.g. 919652929243).
 * WhatsApp requires the country code without '+' or leading zeros or spaces.
 */
export function formatWhatsAppNumber(phone: string | null | undefined): string {
  if (!phone) {
    const envNum = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_BLINTZY_WHATSAPP_NUMBER : null;
    return envNum ? String(envNum).replace(/\D/g, '') : '919652929243';
  }

  let clean = String(phone).replace(/\D/g, '');

  // If user entered 0 followed by 10 digits (e.g. 09652929243), strip leading 0
  if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.slice(1);
  }

  // If it's a 10-digit Indian mobile number (e.g. 9652929243), prefix India's country code 91
  if (clean.length === 10) {
    clean = '91' + clean;
  }

  return clean || '919652929243';
}

/**
 * Builds the official WhatsApp direct-chat URL.
 */
export function getWhatsAppChatUrl(phone: string | null | undefined, message?: string): string {
  const cleanNumber = formatWhatsAppNumber(phone);
  const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanNumber}${textParam}`;
}

/**
 * Opens WhatsApp chat directly to the specified phone number with pre-filled message text.
 * Uses an anchor-click trigger to ensure mobile OS properly handles Universal Links / App Links.
 */
export function openWhatsAppChat(phone: string | null | undefined, message?: string) {
  const url = getWhatsAppChatUrl(phone, message);

  if (typeof window !== 'undefined') {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
