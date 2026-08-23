// src/features/order-history/hooks/useOrderHistory.ts
import { useOrderHistoryContext } from '../providers/OrderHistoryProvider';

export const useOrderHistory = () => {
  // Directly expose the context to UI components
  // Providing a clean boundary and renaming it for consistency
  return useOrderHistoryContext();
};
