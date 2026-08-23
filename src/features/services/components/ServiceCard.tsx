'use client';
import React from 'react';
import { Service } from '../types';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  service: Service;
  onClick: (id: string) => void;
}

export const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const isInteractable =
    service.enabled && !service.disabled && !service.comingSoon && !service.maintenance;

  return (
    <motion.button
      onClick={() => isInteractable && onClick(service.id)}
      disabled={!isInteractable}
      whileTap={isInteractable ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        w-full text-left relative flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-200 group
        ${
          isInteractable
            ? 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-[0_4px_14px_rgba(255,107,0,0.08)] cursor-pointer'
            : 'bg-gray-50 border-gray-100 opacity-70 cursor-not-allowed'
        }
      `}
      aria-label={`Select service: ${service.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-white shadow-sm shrink-0 ${service.color}`}
        >
          <span className="text-2xl">
            {service.icon === 'Book'
              ? '📚'
              : service.icon === 'Ticket'
                ? '🎟️'
                : service.icon === 'Copy'
                  ? '📄'
                  : service.icon === 'Upload'
                    ? '📤'
                    : '⚙️'}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {service.badge && (
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-orange-50 text-orange-600">
              {service.badge}
            </span>
          )}
          {service.beta && (
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-50 text-purple-600">
              Beta
            </span>
          )}
          {service.comingSoon && (
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-100 text-gray-500 border border-gray-200">
              Coming Soon
            </span>
          )}
          {service.maintenance && (
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-50 text-red-500">
              Maintenance
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-1">
        <h3 className="font-bold text-gray-900 text-[16px] leading-tight flex items-center justify-between">
          <span>{service.title}</span>
          {isInteractable && (
            <span className="text-orange-400/50 group-hover:text-orange-500 text-xl font-light -mr-1 transition-colors group-hover:translate-x-0.5">→</span>
          )}
        </h3>
        {service.subtitle && (
          <p className="text-xs font-semibold text-orange-500">{service.subtitle}</p>
        )}
        <p className="text-[13.5px] text-gray-500 leading-snug line-clamp-2 mt-1">
          {service.description}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-2 pt-3 border-t border-gray-100 text-xs text-gray-400 font-medium">
        {service.estimatedTime && (
          <div className="flex items-center gap-1.5">
            <span>⏱️</span>
            <span>{service.estimatedTime}</span>
          </div>
        )}
        {service.estimatedPrice !== undefined && (
          <div className="flex items-center gap-1.5">
            <span>💳</span>
            <span>Est. ₹{service.estimatedPrice}</span>
          </div>
        )}
      </div>

      {/* Absolute overlay for disabled/maintenance states to intercept clicks completely if needed, though button disabled handles it */}
    </motion.button>
  );
};
