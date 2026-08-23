// src/features/order-history/services/mockHistory.ts
import { OrderHistoryItem, Invoice } from '../types';
import { OrderStatus } from '@/features/orders/types';
import { generateInvoiceNumber } from '../utils/formatters';

export const MOCK_HISTORY_ORDERS: OrderHistoryItem[] = [
  {
    id: 'ORD-2236-3159',
    documentNames: ['Computer Networks Lab Manual'],
    createdAt: '2026-07-29T10:00:00.000Z',
    status: 'printing',
    totalCopies: 1,
    totalPages: 100,
    totalAmount: 180,
  }
];

export const getMockInvoice = (orderId: string): Invoice => {
  const order = MOCK_HISTORY_ORDERS.find(o => o.id === orderId) || MOCK_HISTORY_ORDERS[0];
  
  return {
    invoiceNumber: generateInvoiceNumber(order.id),
    orderId: order.id,
    date: order.createdAt,
    studentName: 'Rahul Sharma',
    rollNumber: '21CS1045',
    department: 'Computer Science',
    items: order.documentNames.map((name, i) => ({
      id: `ITEM-${i + 1}`,
      documentName: name,
      pages: Math.floor(order.totalPages / order.documentNames.length),
      copies: order.totalCopies,
      price: (order.totalAmount * 0.8) / order.documentNames.length,
    })),
    printConfigSummary: 'A4 • Black & White • Spiral Binding',
    subtotal: order.totalAmount * 0.8,
    platformFee: 15,
    gst: order.totalAmount * 0.18,
    grandTotal: order.totalAmount,
    paymentStatus: order.status === 'cancelled' || order.status === 'rejected' ? 'refunded' : 'paid',
  };
};
