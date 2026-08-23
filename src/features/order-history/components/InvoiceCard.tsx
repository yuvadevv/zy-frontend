// src/features/order-history/components/InvoiceCard.tsx
import React from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { Invoice } from '../types';
import { formatHistoryCurrency, formatHistoryDate } from '../utils/formatters';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface InvoiceCardProps {
  invoice: Invoice;
  onDownload: () => void;
  isDownloading: boolean;
}

export const InvoiceCard = ({ invoice, onDownload, isDownloading }: InvoiceCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">Tax Invoice</span>
            <span className="text-xs text-muted-foreground">{invoice.invoiceNumber}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {invoice.paymentStatus}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 bg-muted/30 rounded-xl border border-border/50 text-sm">
        <div className="flex justify-between items-start">
          <span className="text-muted-foreground">Billed To</span>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-foreground">{invoice.studentName}</span>
            <span className="text-xs text-muted-foreground">{invoice.rollNumber} • {invoice.department}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium text-foreground">{formatHistoryDate(invoice.date)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-medium text-foreground">{invoice.orderId}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Items</h4>
        {invoice.items.map(item => (
          <div key={item.id} className="flex justify-between items-start text-sm">
            <div className="flex flex-col gap-1 w-2/3">
              <span className="font-medium text-foreground leading-snug">{item.documentName}</span>
              <span className="text-xs text-muted-foreground">
                {item.pages} Pages • {item.copies} Copies
              </span>
            </div>
            <span className="font-semibold">{formatHistoryCurrency(item.price)}</span>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-border/50 my-1" />

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatHistoryCurrency(invoice.subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Platform Fee</span>
          <span>{formatHistoryCurrency(invoice.platformFee)}</span>
        </div>
        <div className="flex justify-between items-center text-muted-foreground">
          <span>GST (18%)</span>
          <span>{formatHistoryCurrency(invoice.gst)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-border font-bold text-foreground">
        <span>Grand Total</span>
        <span className="text-xl text-primary">{formatHistoryCurrency(invoice.grandTotal)}</span>
      </div>

      <Button 
        onClick={onDownload}
        isDisabled={isDownloading}
        className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        {isDownloading ? 'Downloading...' : 'Download PDF Invoice'}
      </Button>
    </div>
  );
};
