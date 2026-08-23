"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { CartProvider, useCart } from '@/features/cart/providers/CartProvider';
import { CartList } from '@/features/cart/components/CartList';
import { PriceBreakdown } from '@/features/cart/components/PriceBreakdown';
import { DeliveryCard } from '@/features/cart/components/DeliveryCard';
import { CouponSection } from '@/features/cart/components/CouponSection';
import { StickyCheckoutBar } from '@/features/cart/components/StickyCheckoutBar';
import { CartSkeleton, CartErrorState } from '@/features/cart/components/CartStates';
import { AppHeader } from '@/features/app-shell/components/AppHeader';
import { APP_ROUTES } from '@/constants/routes';

const CartPageContent = () => {
    const router = useRouter();
  const { cart, status, updateQuantity, removeItem, applyCoupon, refreshCart } = useCart();

  const handleCheckout = () => {
    // Analytics: track Checkout Clicked
    console.log("Proceeding to checkout with cart:", cart?.cartId);
    router.push(APP_ROUTES.CHECKOUT);
  };

  const handleEdit = (id: string) => {
    // Navigate back to options page, perhaps passing cartItemId
    console.log("Editing item:", id);
    router.push(APP_ROUTES.MANUALS_WORKFLOW.OPTIONS + '?cartItem=' + id);
  };

  return (
    <div className="flex flex-col w-full h-full pb-24">
      <main className="flex-1 flex flex-col gap-4 w-full max-w-4xl mx-auto pt-2 px-4">
        {status === 'loading' && <CartSkeleton />}
        
        {status === 'error' || status === 'offline' ? (
          <CartErrorState 
            message={status === 'offline' ? "You appear to be offline." : "Failed to load cart."} 
            onRetry={refreshCart} 
          />
        ) : null}

        {status === 'empty' && (
          <CartList items={[]} onUpdateQuantity={() => {}} onRemove={() => {}} onEdit={() => {}} />
        )}

        {status === 'success' && cart && (
          <>
            <CartList 
              items={cart.items} 
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              onEdit={handleEdit}
            />
            
            <div className="h-px w-full bg-border/50 my-2"></div>
            
            <DeliveryCard info={cart.deliveryInfo} onEdit={() => console.log('Edit delivery')} />
            
            <CouponSection />
            
            <PriceBreakdown summary={cart.summary} />
            
            <div className="text-center px-8 mt-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                By proceeding to checkout, you agree to Blintzy's Terms of Service and Printing Policy.
              </p>
            </div>
          </>
        )}
      </main>

      {status === 'success' && cart && cart.items.length > 0 && (
        <StickyCheckoutBar 
          total={cart.summary.total} 
          itemCount={cart.items.reduce((acc, curr) => acc + curr.quantity, 0)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default function CartPage() {
  return <CartPageContent />;
}
