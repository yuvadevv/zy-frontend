// src/features/profile/api/supportApi.ts
import { SupportOption } from '../types';
import { SUPPORT_LINKS } from '../constants';

export const supportApi = {
  getSupportOptions: async (): Promise<SupportOption[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 'SUP-1', type: 'WHATSAPP', title: 'Chat on WhatsApp', description: 'Fastest way to get help', actionUrl: SUPPORT_LINKS.WHATSAPP },
      { id: 'SUP-2', type: 'CALL', title: 'Call Us', description: 'Mon-Sat, 9 AM - 6 PM', actionUrl: SUPPORT_LINKS.PHONE },
      { id: 'SUP-3', type: 'EMAIL', title: 'Email Support', description: 'For detailed queries', actionUrl: SUPPORT_LINKS.EMAIL },
      { id: 'SUP-4', type: 'FAQ', title: 'FAQs', description: 'Find answers quickly', actionUrl: '/app/support/faq' }
    ];
  }
};
