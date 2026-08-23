// src/features/order-history/components/OrderActionsMenu.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Download, Share2, HelpCircle, Check, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupport } from '@/hooks/useSupport';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { workerClient } from '@/lib/api/workerClient';

interface OrderActionsMenuProps {
  orderId: string;
  order?: any;
}

export const OrderActionsMenu = ({ orderId, order }: OrderActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null);
  
  const support = useSupport();

  const showToast = (message: string, type: 'success' | 'error' | 'loading', duration = 3000) => {
    setToast({ message, type });
    if (type !== 'loading') {
      setTimeout(() => setToast(null), duration);
    }
  };

  const handleDownload = async () => {
    setIsOpen(false);
    showToast('Preparing invoice...', 'loading');
    
    try {
      // 1. Fetch authoritative order data directly from backend
      const orderData = await workerClient.getOrder(orderId);
      if (!orderData || !orderData.order) throw new Error('Order not found');
      
      // 2. Generate PDF
      await generateInvoicePDF(orderData, support);
      showToast('✓ Invoice downloaded', 'success');
    } catch (e: any) {
      console.error('Invoice generation failed:', e);
      showToast('Unable to generate invoice. Please try again.', 'error');
    }
  };

  const handleShare = async () => {
    setIsOpen(false);
    showToast('Preparing...', 'loading');
    
    try {
      // 1. Fetch authoritative order data directly from backend
      const orderData = await workerClient.getOrder(orderId);
      if (!orderData || !orderData.order) throw new Error('Order not found');

      const success = await support.shareOrderDetails(orderData);
      if (success) {
        showToast('✓ Order details copied', 'success');
      } else {
        showToast('Unable to share', 'error');
      }
    } catch (err: any) {
      showToast('Unable to share. Please try again.', 'error');
    }
  };

  const handleSupport = () => {
    setIsOpen(false);
    if (!support.isAvailable) {
      showToast('Support is currently unavailable', 'error');
      return;
    }
    showToast('Opening WhatsApp...', 'loading');
    setTimeout(() => {
      support.openWhatsAppSupport(order?.publicId || orderId);
      setToast(null);
    }, 500);
  };

  return (
    <>
      <button 
        aria-label="Order actions"
        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:scale-95 transition-all shrink-0"
      >
        <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Global Toast Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-safe left-0 right-0 z-[200] flex justify-center mb-6 px-4 pointer-events-none"
            >
              <div className="bg-gray-900 text-white px-5 py-3.5 rounded-[16px] shadow-2xl flex items-center gap-3">
                {toast.type === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-orange-500" />}
                {toast.type === 'success' && <Check className="w-5 h-5 text-green-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                <span className="font-semibold text-[15px]">{toast.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Dim Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
              />
              
              {/* Bottom Sheet Container */}
              <div className="fixed inset-0 z-[101] pointer-events-none flex justify-center items-end sm:items-center sm:p-4">
                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100 || info.velocity.y > 500) {
                      setIsOpen(false);
                    }
                  }}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  className="w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl pointer-events-auto flex flex-col overflow-hidden pb-safe"
                  onClick={e => e.stopPropagation()} 
                >
                  {/* Drag Handle */}
                  <div className="w-full flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                  </div>
                  
                  <div className="flex flex-col gap-1 px-4 pb-6 pt-2">
                    <button 
                      aria-label="Download invoice"
                      onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                      className="w-full flex items-center gap-4 p-4 min-h-[64px] rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[16px] font-bold text-gray-900">Download Invoice</span>
                        <span className="text-[13px] font-medium text-gray-500">Get a PDF copy</span>
                      </div>
                    </button>
                    
                    <button 
                      aria-label="Share order details"
                      onClick={(e) => { e.stopPropagation(); handleShare(); }}
                      className="w-full flex items-center gap-4 p-4 min-h-[64px] rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Share2 className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[16px] font-bold text-gray-900">Share Details</span>
                        <span className="text-[13px] font-medium text-gray-500">Share your order information</span>
                      </div>
                    </button>
                    
                    <button 
                      aria-label="Report an issue with this order"
                      onClick={(e) => { e.stopPropagation(); handleSupport(); }}
                      className="w-full flex items-center gap-4 p-4 min-h-[64px] rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[16px] font-bold text-gray-900">Report Issue</span>
                        <span className="text-[13px] font-medium text-gray-500">Need help with this order?</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
