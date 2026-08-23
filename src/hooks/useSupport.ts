import { useState, useEffect } from 'react';
import { workerClient } from '@/lib/api/workerClient';

export function useSupport() {
  const [supportWhatsapp, setSupportWhatsapp] = useState<string | null>(null);
  const [supportPhone, setSupportPhone] = useState<string | null>(null);
  const [supportEmail, setSupportEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSupportConfig() {
      try {
        const response = await workerClient.getPlatformStatus();
        const data = response.content || response;
        if (data) {
          if (data.support_whatsapp) {
            setSupportWhatsapp(String(data.support_whatsapp).replace(/\D/g, ''));
          }
          if (data.support_phone) {
            setSupportPhone(String(data.support_phone).replace(/\D/g, ''));
          }
          if (data.support_email) {
            setSupportEmail(data.support_email);
          }
        }
      } catch (error) {
        console.error('Failed to fetch platform support configuration', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSupportConfig();
  }, []);

  const openWhatsAppSupport = (orderId?: string) => {
    if (!supportWhatsapp) return;

    let text = 'Hi BLINTZY Support, I need help with BLINTZY.';
    if (orderId) {
      text = `Hi BLINTZY Support, I need help with Order #${orderId}.`;
    }

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${supportWhatsapp}?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const callSupport = () => {
    if (!supportPhone) return;
    window.open(`tel:+${supportPhone}`, '_self');
  };

  const emailSupport = (orderId?: string) => {
    if (!supportEmail) return;

    let subject = 'BLINTZY Support';
    let body = 'Hi BLINTZY Support,\n\nI need help with BLINTZY.\n\nThank you.';
    
    if (orderId) {
      subject = `BLINTZY Order Support — Order #${orderId}`;
      body = `Hi BLINTZY Support,\n\nI need help with Order #${orderId}.\n\nThank you.`;
    }

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const url = `mailto:${supportEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    window.open(url, '_blank');
  };

  const shareOrderDetails = async (order: any) => {
    if (!order) return false;

    // Use total or a default format, careful not to break if fields are missing
    const total = order.summary?.total || order.totalAmount || 0;
    const delivery = order.deliveryInfo?.method || 'Standard Delivery';
    
    const shareText = `BLINTZY Order #${order.publicId || order.id}\n\nStatus: ${order.status || 'Received'}\nTotal: ₹${total}\nDelivery: ${delivery}\n\nTrack your order in BLINTZY.`;
    
    const shareData = {
      title: 'BLINTZY Order Details',
      text: shareText,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return true;
      } else {
        await navigator.clipboard.writeText(shareText);
        return true;
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share failed', err);
      }
      return false;
    }
  };

  return {
    supportWhatsapp,
    supportPhone,
    supportEmail,
    isLoading,
    isAvailable: !!supportWhatsapp || !!supportPhone || !!supportEmail,
    openWhatsAppSupport,
    callSupport,
    emailSupport,
    shareOrderDetails
  };
}
