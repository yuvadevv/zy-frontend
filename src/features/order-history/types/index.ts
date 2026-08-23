// src/features/order-history/types/index.ts

import { OrderStatus } from '@/features/orders/types';

export interface HistorySearch {
  query: string;
}

export type HistoryFilterStatus = 'all' | OrderStatus;
export type HistorySortOption = 'newest' | 'oldest' | 'highest_amount' | 'lowest_amount' | 'alphabetical' | 'recent_activity';

export interface HistoryFilter {
  status: HistoryFilterStatus;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface InvoiceItem {
  id: string;
  documentName: string;
  pages: number;
  copies: number;
  price: number;
}

export interface Invoice {
  invoiceNumber: string;
  orderId: string;
  date: string;
  studentName: string;
  rollNumber: string;
  department: string;
  items: InvoiceItem[];
  printConfigSummary: string; // e.g., "A4 • Black & White • Spiral Binding"
  subtotal: number;
  platformFee: number;
  gst: number;
  grandTotal: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
}

export interface OrderHistoryItem {
  id: string;
  documentNames: string[]; // Aggregated document names for the order
  createdAt: string;
  status: OrderStatus;
  totalCopies: number;
  totalPages: number;
  totalAmount: number;
  deliveryDate?: string;
}

export interface OrderHistoryResponse {
  orders: OrderHistoryItem[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount: number;
}

export interface ReorderRequest {
  orderId: string;
}

export interface ReorderResponse {
  success: boolean;
  cartId?: string;
  errorMessage?: string;
}
