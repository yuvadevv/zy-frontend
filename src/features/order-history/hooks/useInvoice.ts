// src/features/order-history/hooks/useInvoice.ts
import { useState, useEffect } from 'react';
import { invoiceService } from '../services/invoiceService';
import { Invoice } from '../types';
import { useHistoryAnalytics } from './useHistoryAnalytics';

export const useInvoice = (orderId: string) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { trackInvoiceViewed, trackInvoiceDownloaded } = useHistoryAnalytics();

  const loadInvoice = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await invoiceService.fetchInvoiceDetails(orderId);
      setInvoice(data);
      trackInvoiceViewed(orderId);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (orderId && mounted) {
      setTimeout(() => {
        loadInvoice();
      }, 0);
    }
    return () => { mounted = false; };
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const downloadInvoice = async () => {
    if (!orderId) return;
    try {
      setIsDownloading(true);
      await invoiceService.downloadInvoice(orderId);
      trackInvoiceDownloaded(orderId);
    } catch (err) {
      console.error("Failed to download invoice", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return { invoice, isLoading, error, downloadInvoice, isDownloading, retry: loadInvoice };
};
