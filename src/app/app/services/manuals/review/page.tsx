"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { ReviewCard } from '@/features/manuals/components/ReviewCard';
import { PrintConfig } from '@/features/manuals/types';
import { mapManual } from '@/features/manuals/mappers';
import { APP_ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/providers/CartProvider';
import { CartItem } from '@/features/cart/types';
import { workerClient } from '@/lib/api/workerClient';
import { useQuery } from '@tanstack/react-query';

function ReviewSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manualId = searchParams.get('manualId') || '';
  const { addItem } = useCart();

  const [isAdding, setIsAdding] = useState(false);
  const [manual, setManual] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const config: PrintConfig = {
    copies: parseInt(searchParams.get('copies') || '1', 10),
    singleSided: searchParams.get('singleSided') === 'true',
    color: searchParams.get('color') === 'true',
    bindingType: (searchParams.get('bindingType') as PrintConfig['bindingType']) || 'spiral',
    paperSize: (searchParams.get('paperSize') as PrintConfig['paperSize']) || 'a4',
  };

  useEffect(() => {
    if (manualId) {
      workerClient.getManual(manualId)
        .then((res: any) => {
          if (res && res.manual) {
             setManual(mapManual(res.manual));
          } else {
             setManual(mapManual(res));
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [manualId]);

  const { data: pricingResponse, isLoading: pricingLoading } = useQuery({
    queryKey: ['pricing', manualId, config],
    queryFn: () => workerClient.calculatePricing({
      items: [{
        serviceType: 'manual',
        manualId,
        printOptions: {
          color: config.color,
          singleSided: config.singleSided,
          bindingType: config.bindingType,
          copies: config.copies
        }
      }],
      deliveryMethod: 'delivery'
    }),
    enabled: !!manualId
  });

  if (loading || pricingLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!manual) return <div className="p-8 text-center">Manual not found</div>;

  const priceBreakdown = pricingResponse?.items?.[0] || null;
  const orderSummary = pricingResponse?.summary || null;
  
  if (!priceBreakdown) return <div className="p-8 text-center">Failed to calculate price.</div>;

  const estimatedDelivery = pricingResponse?.estimatedDelivery || 'Tomorrow, 9:15 AM';

  const handleAddToCart = () => {
    setIsAdding(true);
    
    const cartItem: CartItem = {
      id: `ci_${Date.now()}`,
      referenceId: manual.id,
      serviceType: 'manual',
      title: manual.name,
      subtitle: `${manual.subjectId} • ${config.copies} Copies`,
      quantity: 1, // Quantity is 1 because copies are handled in config
      printOptions: {
        copies: config.copies,
        singleSided: config.singleSided,
        color: config.color,
        bindingType: config.bindingType || 'spiral',
        paperSize: config.paperSize || 'a4',
      },
      priceBreakdown: {
        base: priceBreakdown?.unitPrice || 0,
        printing: priceBreakdown?.printingAmount || 0,
        binding: priceBreakdown?.bindingFee || 0,
        color: config.color ? 4 * config.copies : 0, // Approx color portion
        total: priceBreakdown?.subtotal || 0
      },
      status: 'in_cart',
      editable: true,
      removable: true
    };
    
    addItem(cartItem);

    // Provide a small delay before navigation
    setTimeout(() => {
      router.push(APP_ROUTES.CART);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-safe">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-2xl font-bold text-foreground">Review Order</h1>
          <p className="text-sm text-muted-foreground mt-1">Please confirm your print settings</p>
        </div>
        <ReviewCard 
          manual={manual} 
          config={config} 
          priceBreakdown={{
            basePrice: priceBreakdown.unitPrice,
            printingCost: priceBreakdown.printingAmount,
            bindingCost: priceBreakdown.bindingFee,
            
            total: priceBreakdown.finalTotal
          }} 
          estimatedDelivery={estimatedDelivery}
          onAddToCart={handleAddToCart}
          isAddingToCart={isAdding}
        />
      </div>
    </div>
  );
}

export default function ReviewSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ReviewSelectionContent />
    </Suspense>
  );
}
