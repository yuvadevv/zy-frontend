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
import { FileArchive, Download, Loader2, UploadCloud, AlertTriangle, MessageCircle } from 'lucide-react';
import { useFileUploadStore } from '@/features/services/store/useFileUploadStore';
import { workerClient } from '@/lib/api/workerClient';
import { toast } from 'react-hot-toast';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const { order, isLoading: isOrderLoading, isRefreshing, error: orderError, fetchOrder, refreshOrder } = useOrder();
  const { timeline, isLoading: isTimelineLoading } = useTimeline();
  
  const { pendingFiles, removePendingFile } = useFileUploadStore();
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  useEffect(() => {
    // Disabled automated R2 file uploads since physical document delivery is now via WhatsApp
  }, []);

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

  const handleMissingFileUpload = async (fileId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      toast.loading('Uploading missing file...', { id: 'missingFile' });
      await workerClient.uploadDocument(file, 'custom', '0', fileId);
      toast.success('File uploaded successfully!', { id: 'missingFile' });
      refreshOrder(orderId);
    } catch (err) {
      toast.error('Failed to upload file', { id: 'missingFile' });
    }
  };

  const handleWhatsAppUpload = () => {
    const waNumber = process.env.NEXT_PUBLIC_BLINTZY_WHATSAPP_NUMBER || '919652929243';
    
    let serviceNames = order.items.map((i: any) => i.title || 'Custom Upload').join(', ');
    if (!serviceNames) serviceNames = 'Custom Upload';

    const msg = `Hi BLINTZY 👋\n\nI'm sending my document to complete my order.\n\nOrder ID: ${order.id}\nService: ${serviceNames}\nAmount: ₹${order.summary.grandTotal}\n\n📎 I am attaching my PDF/ZIP document for this order.\n\nPlease confirm once received.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-card p-6 rounded-2xl shadow-xl max-w-sm w-full flex flex-col items-center text-center border border-border">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-bold mb-2">Uploading your files...</h3>
            <p className="text-muted-foreground text-sm mb-4">Please do not close this screen or refresh the page.</p>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-xs text-primary font-bold mt-2">{uploadProgress}% Complete</p>
          </div>
        </div>
      )}
      <div className="flex flex-col min-h-screen bg-muted/10 pb-24">
      <OrderHeader orderId={order.id} order={order} />
      
      <main className="flex-1 p-4 flex flex-col gap-5 max-w-lg mx-auto w-full">
        {order.customFiles?.some(f => f.uploadStatus === 'awaiting_whatsapp' || f.fileName === 'awaiting_whatsapp' || f.uploadStatus === 'pending' || f.fileName === 'pending_upload') && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl shadow-sm overflow-hidden p-6 text-center">
            <h3 className="text-xl font-black text-amber-900 mb-2">✓ Payment Successful</h3>
            <p className="text-sm font-bold text-amber-900 mb-6">Your order {order.id} has been created.</p>
            
            <div className="bg-white/60 p-4 rounded-lg mb-6 border border-amber-100">
              <p className="text-sm font-bold text-amber-900 mb-1 flex items-center justify-center gap-1.5">
                <span>⚠️ ACTION REQUIRED</span>
              </p>
              <p className="text-sm text-amber-950 font-bold mb-2">Your order is not complete yet.</p>
              <p className="text-sm text-amber-800 font-medium">
                Please send your PDF or ZIP document on WhatsApp to complete your order.
              </p>
            </div>
            
            <button 
              onClick={handleWhatsAppUpload}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors rounded-xl font-black text-base w-full shadow-md uppercase tracking-wide mb-3"
            >
              <MessageCircle className="w-5 h-5" /> SEND DOCUMENT ON WHATSAPP
            </button>
            <p className="text-xs text-amber-800 font-medium leading-tight px-2">
              <strong>Important:</strong> Your order will be processed only after BLINTZY receives your document on WhatsApp.
            </p>
          </div>
        )}
        
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
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileArchive className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground truncate">
                        {file.fileName === 'pending_upload' || file.fileName === 'awaiting_whatsapp' ? 'Awaiting Document' : file.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {file.uploadStatus === 'pending' || file.uploadStatus === 'awaiting_whatsapp' || file.fileName === 'pending_upload' || file.fileName === 'awaiting_whatsapp'
                          ? 'Missing File' 
                          : `${(file.fileSize / 1024 / 1024).toFixed(2)} MB • ${file.uploadStatus}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  {(file.uploadStatus === 'pending' || file.uploadStatus === 'awaiting_whatsapp' || file.fileName === 'pending_upload' || file.fileName === 'awaiting_whatsapp') ? (
                    <div className="flex-shrink-0 w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={handleWhatsAppUpload}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors rounded-lg font-bold text-sm whitespace-nowrap w-full sm:w-auto"
                      >
                        <MessageCircle className="w-4 h-4" /> Upload on WhatsApp
                      </button>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => handleDownloadCustomFile(file.fileId)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg font-bold text-sm whitespace-nowrap w-full sm:w-auto"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <PriceSummaryCard summary={order.summary} />
        
        <HelpSupportCard orderId={order.id} />
      </main>
    </div>
    </>
  );
}
