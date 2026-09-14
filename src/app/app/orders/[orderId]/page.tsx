"use client";
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOrder } from '@/features/orders/hooks/useOrder';
import { useTimeline } from '@/features/orders/hooks/useTimeline';
import { OrderHeader } from '@/features/orders/components/OrderHeader';
import { OrderStatusCard } from '@/features/orders/components/OrderStatusCard';
import { OrderProgressTimeline } from '@/features/orders/components/OrderProgressTimeline';
import { EstimatedDeliveryCard } from '@/features/orders/components/EstimatedDeliveryCard';
import { PrintDetailsCard } from '@/features/orders/components/PrintDetailsCard';
import { PriceSummaryCard } from '@/features/orders/components/PriceSummaryCard';
import { HelpSupportCard } from '@/features/orders/components/HelpSupportCard';
import { OrderSkeleton } from '@/features/orders/components/OrderSkeleton';
import { OrderErrorState } from '@/features/orders/components/OrderErrorState';
import { OrderEmptyState } from '@/features/orders/components/OrderEmptyState';
import { FileArchive, Download } from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';
import { toast } from 'react-hot-toast';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const { order, isLoading: isOrderLoading, isRefreshing, error: orderError, fetchOrder, refreshOrder } = useOrder();
  const { timeline, isLoading: isTimelineLoading } = useTimeline();

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = isOrderLoading || isTimelineLoading;

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (orderError) {
    return <OrderErrorState error={orderError} onRetry={() => fetchOrder(orderId)} />;
  }

  if (!order || !timeline) {
    return <OrderEmptyState />;
  }

  const handleDownloadCustomFile = async (fileId: string) => {
    try {
      toast.loading('Generating download link...', { id: 'customFile' });
      const url = await workerClient.getCustomFileDownloadUrl(fileId);
      window.open(url, '_blank');
      toast.success('Download started', { id: 'customFile' });
    } catch (err) {
      toast.error('Failed to download file', { id: 'customFile' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 pb-24">
      <OrderHeader orderId={order.id} order={order} />
      
      <main className="flex-1 p-4 flex flex-col gap-5 max-w-lg mx-auto w-full">
        <OrderStatusCard status={order.status} date={order.createdAt} onRefresh={() => refreshOrder(orderId)} isRefreshing={isRefreshing} />
        
        <OrderProgressTimeline timeline={timeline} />
        
        {order.status !== 'cancelled' && order.status !== 'rejected' && (
          <EstimatedDeliveryCard deliveryInfo={order.deliveryInfo} />
        )}
        
        {order.items.map(item => (
          <PrintDetailsCard key={item.id} item={item} />
        ))}
        
        {order.customFiles && order.customFiles.length > 0 && (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-5">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
              <FileArchive className="w-4 h-4 mr-2" /> Custom Uploads
            </h3>
            <div className="space-y-4">
              {order.customFiles.map((file, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileArchive className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{file.fileName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB • {file.uploadStatus}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownloadCustomFile(file.fileId)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg font-bold text-sm whitespace-nowrap w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <PriceSummaryCard summary={order.summary} />
        
        <HelpSupportCard orderId={order.id} />
      </main>
    </div>
  );
}
