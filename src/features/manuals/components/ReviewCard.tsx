import React from 'react';
import { Manual, PrintConfig, PriceBreakdown as ManualPriceBreakdown } from '../types';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { PriceBreakdown } from '@/features/cart/components/PriceBreakdown';

interface ReviewCardProps {
  manual: Manual;
  config: PrintConfig;
  priceBreakdown: ManualPriceBreakdown;
  estimatedDelivery: string;
  onAddToCart: () => void;
  isAddingToCart?: boolean;
  offerDiscount?: number;
  isLaunchActive?: boolean;
  appliedOffer?: string | null;
  onApplyOffer?: (code: string | null) => Promise<{ success: boolean; error?: string }>;
  isApplyingOffer?: boolean;
}

export const ReviewCard = ({ 
  manual, 
  config, 
  priceBreakdown, 
  estimatedDelivery, 
  onAddToCart, 
  isAddingToCart,
  offerDiscount = 0,
  isLaunchActive = true,
  appliedOffer,
  onApplyOffer,
  isApplyingOffer
}: ReviewCardProps) => {
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
              {config.bindingType === 'none' ? 'No Binding' : config.bindingType}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Copies</span>
            <span className="font-semibold text-foreground">{config.copies}x</span>
          </div>
        </div>
      </div>

      <PriceBreakdown 
        summary={{
          subtotal: priceBreakdown.total || 0,
          originalSubtotal: (priceBreakdown.originalPrintingCost || 0) + (priceBreakdown.originalBindingCost || 0) || priceBreakdown.total,
          printingCost: priceBreakdown.printingCost || 0,
          originalPrintingCost: priceBreakdown.originalPrintingCost || priceBreakdown.printingCost || 0,
          bindingCost: priceBreakdown.bindingCost || 0,
          originalBindingCost: priceBreakdown.originalBindingCost || priceBreakdown.bindingCost || 0,
          discount: offerDiscount,
          offerDiscount: offerDiscount,
          deliveryFee: 0,
          platformFee: 0,
          isLaunchActive: isLaunchActive,
          appliedOffer: appliedOffer,
          total: priceBreakdown.total
        }}
        onApplyOffer={onApplyOffer}
        isApplyingOffer={isApplyingOffer}
      />
      
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
