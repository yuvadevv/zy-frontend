export const useServicesAnalytics = () => {
  const trackEvent = (eventName: string, payload?: Record<string, unknown>) => {
    console.log(`[Services Analytics] ${eventName}`, payload);
  };

  return {
    trackServiceViewed: (serviceId: string) => trackEvent('service_viewed', { serviceId }),
    trackServiceClicked: (serviceId: string) => trackEvent('service_clicked', { serviceId }),
    trackCategoryChanged: (categoryId: string) => trackEvent('category_changed', { categoryId }),
    trackSearchUsed: (query: string) => trackEvent('search_used', { query }),
    trackFeaturedClicked: (serviceId: string, campaign?: string) => trackEvent('featured_clicked', { serviceId, campaign }),
    trackHelpClicked: () => trackEvent('help_clicked'),
  };
};
