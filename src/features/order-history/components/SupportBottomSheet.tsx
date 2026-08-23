import React from 'react';
import { BottomSheet } from '@/design-system/components/feedback/BottomSheet/BottomSheet';
import { MessageCircle, Phone, Mail, Package, AlertCircle, FileText, CreditCard } from 'lucide-react';

interface SupportBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

export const SupportBottomSheet = ({ isOpen, onClose }: SupportBottomSheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const supportOptions = [
    { 
      icon: <MessageCircle className="w-6 h-6 text-green-500" />, 
      label: 'WhatsApp', 
      subtitle: 'Chat with our support team' 
    },
    { 
      icon: <Phone className="w-6 h-6 text-blue-500" />, 
      label: 'Call Us', 
      subtitle: 'Talk directly with our team' 
    },
    { 
      icon: <Mail className="w-6 h-6 text-orange-500" />, 
      label: 'Email Us', 
      subtitle: 'We\'ll reply as soon as possible' 
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dim Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  onClose();
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl pointer-events-auto flex flex-col overflow-hidden pb-safe"
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>
              
              <div className="px-6 pb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
                <button 
                  onClick={onClose} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-500 text-sm font-bold">✕</span>
                </button>
              </div>
              
              <div className="flex flex-col px-4 pb-8 max-h-[80vh] overflow-y-auto">
                {supportOptions.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={onClose}
                    className="flex items-center justify-between w-full p-4 mb-2 min-h-[72px] hover:bg-gray-50 active:scale-[0.98] rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                        {opt.icon}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[16px] font-bold text-gray-900 leading-tight">
                          {opt.label}
                        </span>
                        <span className="text-[13px] font-medium text-gray-500 mt-0.5">
                          {opt.subtitle}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
