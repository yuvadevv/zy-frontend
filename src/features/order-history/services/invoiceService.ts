// src/features/order-history/services/invoiceService.ts

import { invoiceApi } from '../api/invoiceApi';

export const invoiceService = {
  fetchInvoiceDetails: async (orderId: string) => {
    try {
      return await invoiceApi.getInvoiceByOrderId(orderId);
    } catch (error) {
      console.error(`Failed to fetch invoice for order ${orderId}:`, error);
      throw new Error('Could not load the invoice for this order.');
    }
  },

  downloadInvoice: async (orderId: string) => {
    try {
      const url = await invoiceApi.downloadInvoicePdf(orderId);
      
      // Simulate triggering browser download
      console.log(`Downloading invoice from ${url}`);
      return url;
    } catch (error) {
      console.error(`Failed to download invoice for order ${orderId}:`, error);
      throw new Error('Failed to download the invoice. Please try again later.');
    }
  }
};
