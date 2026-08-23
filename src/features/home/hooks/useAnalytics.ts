export const useAnalytics = () => {
  const trackEvent = (eventName: string, payload?: Record<string, unknown>) => {
    console.log(`[Analytics] ${eventName}`, payload);
    // Future implementation: Send to Mixpanel / Amplitude / Firebase
  };

  return {
    trackDashboardOpen: () => trackEvent('dashboard_open'),
    trackServiceClick: (serviceId: string) => trackEvent('service_click', { serviceId }),
    trackOrderClick: (orderId: string) => trackEvent('order_click', { orderId }),
    trackAnnouncementClick: (announcementId: string) => trackEvent('announcement_click', { announcementId }),
    trackSupportClick: (supportType: string) => trackEvent('support_click', { supportType }),
  };
};
