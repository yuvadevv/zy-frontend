"use client";
import React from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSupport } from '@/hooks/useSupport';

export const SupportCard = () => {
  const { supportWhatsapp, supportPhone, supportEmail, openWhatsAppSupport, callSupport, emailSupport } = useSupport();

  // If no support is configured, don't show the card at all (or show it but disabled)
  // Let's show the actions but visually disable them if missing, or just omit them.
  // The design calls for 3 grid columns. Let's render all 3 and disable unconfigured ones.
  const actions = [
    {
      type: 'WhatsApp',
      enabled: !!supportWhatsapp,
      label: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => openWhatsAppSupport()
    },
    {
      type: 'Phone',
      enabled: !!supportPhone,
      label: 'Call Us',
      icon: <Phone className="w-5 h-5" />,
      action: () => callSupport()
    },
    {
      type: 'Email',
      enabled: !!supportEmail,
      label: 'Email',
      icon: <Mail className="w-5 h-5" />,
      action: () => emailSupport()
    }
  ];

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="bg-white border border-gray-100 rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h2 className="font-bold text-[16px] text-gray-900 mb-4 text-center">Need Help?</h2>
        
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: action.enabled ? 0.97 : 1 }}
              onClick={() => {
                if (action.enabled) action.action();
              }}
              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-colors ${
                action.enabled 
                  ? 'cursor-pointer hover:bg-orange-50/50 active:bg-orange-100/50 group' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                action.enabled ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' : 'bg-gray-50 text-gray-400'
              }`}>
                {action.icon}
              </div>
              <span className="font-bold text-[12px] text-gray-900 leading-tight text-center whitespace-nowrap">
                {action.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
