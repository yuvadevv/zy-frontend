// src/features/order-history/utils/formatters.ts

export const formatHistoryDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatHistoryCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const generateInvoiceNumber = (orderId: string): string => {
  const parts = orderId.split('-');
  return `INV-${new Date().getFullYear()}-${parts[parts.length - 1]}`;
};
