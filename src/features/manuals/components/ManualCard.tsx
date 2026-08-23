import React from 'react';
import { Manual } from '../types';
import { Badge } from '@/design-system/components/common/Badge/Badge';
import { motion } from 'framer-motion';

interface ManualCardProps {
  manual: Manual;
  onClick: (manualId: string) => void;
}

export const ManualCard = ({ manual, onClick }: ManualCardProps) => {
  const isAvailable = manual.availability === 'in_stock';
  
  return (
    <motion.button
      whileTap={isAvailable ? { scale: 0.98 } : undefined}
      onClick={() => isAvailable && onClick(manual.id)}
      className={`relative w-full flex flex-col p-4 rounded-xl border text-left shadow-sm transition-all ${
        isAvailable 
          ? 'bg-card border-border hover:border-primary/50' 
          : 'bg-secondary/30 border-border opacity-70 cursor-not-allowed'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-base text-foreground pr-4 line-clamp-2 leading-tight">
          {manual.name}
        </h3>
        {manual.availability === 'out_of_stock' && (
          <Badge>Out of Stock</Badge>
        )}
        {manual.availability === 'pre_order' && (
          <Badge>Pre-Order</Badge>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <span>📄</span> {manual.pages} Pages
        </span>
        <span className="flex items-center gap-2">
          <span>🌐</span> {manual.language}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Base Price</span>
          <span className="font-bold text-primary">₹{manual.basePrice}</span>
        </div>
        
        {isAvailable && (
          <span className="text-sm font-semibold text-primary">Configure →</span>
        )}
      </div>
    </motion.button>
  );
};
