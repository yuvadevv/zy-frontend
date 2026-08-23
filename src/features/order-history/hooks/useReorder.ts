// src/features/order-history/hooks/useReorder.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { reorderApi } from '../api/reorderApi';
import { APP_ROUTES } from '@/constants/routes';
import { useHistoryAnalytics } from './useHistoryAnalytics';

export const useReorder = () => {
  const [isReordering, setIsReordering] = useState<string | null>(null);
  const router = useRouter();
  const { trackReorder } = useHistoryAnalytics();

  const handleReorder = async (orderId: string) => {
    setIsReordering(orderId);
    trackReorder(orderId);
    try {
      const res = await reorderApi.initiateReorder({ orderId });
      if (res.success) {
        // Automatically redirects to the cart where the reordered items are sitting
        router.push(APP_ROUTES.CART);
      } else {
        throw new Error(res.errorMessage || 'Failed to reorder');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to reorder document. Please try again.");
    } finally {
      setIsReordering(null);
    }
  };

  return { handleReorder, isReordering };
};
