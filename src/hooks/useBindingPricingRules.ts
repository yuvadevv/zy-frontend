import { useQuery } from '@tanstack/react-query';
import { workerClient } from '@/lib/api/workerClient';

export interface BindingPricingRule {
  id: string;
  min_pages: number;
  max_pages: number;
  price: number;
  is_active: number;
}

export function useBindingPricingRules() {
  return useQuery({
    queryKey: ['bindingPricingRules'],
    queryFn: async (): Promise<BindingPricingRule[]> => {
      const data = await workerClient.fetch('/api/pricing/binding');
      if (data.success || data.rules) {
        return data.rules || [];
      }
      throw new Error(data.error || 'Failed to fetch binding rules');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
