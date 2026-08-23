// src/features/order-history/api/reorderApi.ts

import { ReorderRequest, ReorderResponse } from '../types';

export const reorderApi = {
  initiateReorder: async (_request: ReorderRequest): Promise<ReorderResponse> => {
    // Simulate complex backend validation for document availability and price updates
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock success - in real world this creates a draft cart with the previous items
    const newCartId = `CART-${Math.floor(Math.random() * 1000000)}`;
    
    return {
      success: true,
      cartId: newCartId
    };
  }
};
