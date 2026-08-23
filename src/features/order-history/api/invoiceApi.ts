// src/features/order-history/api/invoiceApi.ts

import { Invoice } from '../types';
import { getMockInvoice } from '../services/mockHistory';

export const invoiceApi = {
  getInvoiceByOrderId: async (orderId: string): Promise<Invoice> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Attempt to get mock invoice, in real app throws if 404
    const invoice = getMockInvoice(orderId);
    if (!invoice) {
      throw new Error("Invoice not found for this order");
    }
    
    return invoice;
  },

  downloadInvoicePdf: async (orderId: string): Promise<string> => {
    // Simulate delay for generating PDF on server
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real app, returns a Blob URL or direct presigned S3 download link
    return `https://mock-s3.blintzy.com/invoices/${orderId}.pdf`;
  }
};
