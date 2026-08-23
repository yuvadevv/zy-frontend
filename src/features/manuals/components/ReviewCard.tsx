import React from 'react';
import { Manual, PrintConfig } from '../types';
import { PriceBreakdown } from '../utils/priceEngine';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface ReviewCardProps {
  manual: Manual;
  config: PrintConfig;
  priceBreakdown: PriceBreakdown;
  estimatedDelivery: string;
  onAddToCart: () => void;
  isAddingToCart?: boolean;
}

export const ReviewCard = ({ manual, config, priceBreakdown, estimatedDelivery, onAddToCart, isAddingToCart }: ReviewCardProps) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-b border-border/50 pb-4">
          <h2 className="text-xl font-bold text-foreground leading-tight">{manual.name}</h2>
          <span className="text-sm text-muted-foreground">{manual.subjectId.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Print Type</span>
            <span className="font-semibold text-foreground capitalize">
              {config.singleSided ? 'Single Sided' : 'Double Sided'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Color Mode</span>
            <span className="font-semibold text-foreground capitalize">
              {config.color ? 'Color Print' : 'Black & White'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Binding</span>
            <span className="font-semibold text-foreground capitalize">
              {config.bindingType === 'none' ? 'Stapled' : config.bindingType}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Copies</span>
            <span className="font-semibold text-foreground">{config.copies}x</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base Manual</span>
          <span className="font-medium">₹{priceBreakdown.basePrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Printing</span>
          <span className="font-medium">₹{priceBreakdown.printingCost}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Binding</span>
          <span className="font-medium">₹{priceBreakdown.bindingCost}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-bold text-green-600">FREE</span>
        </div>
        <div className="border-t border-border/50 pt-3 flex justify-between items-center mt-1">
          <span className="font-bold text-foreground">Total Price</span>
          <span className="text-2xl font-black text-primary">₹{priceBreakdown.total}</span>
        </div>
      </div>
      
      <div className="bg-secondary/20 rounded-xl p-4 flex flex-col items-center justify-center border border-secondary/30">
        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estimated Delivery</span>
        <span className="text-sm font-bold text-foreground">{estimatedDelivery}</span>
      </div>

      <Button
        onClick={onAddToCart}
        isDisabled={isAddingToCart}
        className="w-full bg-primary text-primary-foreground font-bold py-6 text-lg mt-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
      >
        {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
      </Button>
    </div>
  );
};
