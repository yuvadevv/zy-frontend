"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/providers/CartProvider';
import { CheckoutProvider, useCheckout } from '@/features/checkout/providers/CheckoutProvider';
import { usePlaceOrder } from '@/features/checkout/hooks/usePlaceOrder';
import { AppHeader } from '@/features/app-shell/components/AppHeader';
import { CheckoutHeader } from '@/features/checkout/components/CheckoutHeader';
import { PaymentMethodCard } from '@/features/checkout/components/PaymentMethodCard';
import { OrderNotesCard } from '@/features/checkout/components/OrderNotesCard';
import { OrderSummaryCard } from '@/features/checkout/components/OrderSummaryCard';
import { TermsCard } from '@/features/checkout/components/TermsCard';
import { StickyCheckoutBar } from '@/features/checkout/components/StickyCheckoutBar';
import { SuccessAnimation } from '@/features/checkout/components/SuccessAnimation';
import { OrderPolicyCard } from '@/features/checkout/components/OrderPolicyCard';
import { BottomSheet } from '@/design-system/components/feedback/BottomSheet/BottomSheet';
import { useQuery } from '@tanstack/react-query';
import { workerClient } from '@/lib/api/workerClient';

const CheckoutPageContent = () => {
  const router = useRouter();
  const { cart, coupon, deliveryDetails } = useCart();
  const { state, setDeliveryDetails, setPaymentMethodId, setCouponCode, setStudentNotes, setTermsAccepted, isValid, clearSession } = useCheckout();
  const { placeOrder, isPlacingOrder, error: orderError } = usePlaceOrder();
  
  const [successOrderId, setSuccessOrderId] = React.useState<string | null>(null);
  const [confirmedCart, setConfirmedCart] = React.useState<any>(null);

  // If cart is empty, redirect back to cart
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      if (!successOrderId) {
        router.replace(APP_ROUTES.CART);
      }
    }
  }, [cart, router, successOrderId]);

  const { data: pricingResponse } = useQuery({
    queryKey: ['checkout_pricing', cart?.items, state.deliveryDetails?.mode],
    queryFn: () => workerClient.calculatePricing({
      items: cart?.items.map(i => ({
        id: i.id,
        serviceType: i.serviceType,
        manualId: i.referenceId,
        documentId: i.referenceId, // Will use referenceId for custom uploads as well
        printOptions: {
          ...i.printOptions,
          copies: i.quantity
        }
      })) || [],
      deliveryMethod: state.deliveryDetails?.mode || 'delivery',
      couponCode: state.couponCode || coupon
    }),
    enabled: !!cart && cart.items.length > 0
  });

  const displayCart = cart || confirmedCart;
  const backendSummary = pricingResponse?.summary;
  const finalTotal = backendSummary ? backendSummary.grandTotal : (displayCart?.summary.total || 0);

  const handlePlaceOrder = async () => {
    if (!cart) return;
    
    // Merge checkout state with cart provider state for delivery and coupon
    const finalCheckoutState = {
      ...state,
      couponCode: state.couponCode || coupon || null,
      deliveryDetails: state.deliveryDetails || {
        mode: 'CLASSROOM',
        locationName: deliveryDetails ? `College Campus - ${deliveryDetails.building} Room ${deliveryDetails.roomNumber}` : 'College Campus',
        building: deliveryDetails?.building,
        roomNumber: deliveryDetails?.roomNumber
      } as any
    };

    const response = await placeOrder({
      cartId: cart.cartId,
      cartItems: cart.items,
      checkoutState: finalCheckoutState,
      idempotencyKey: Math.random().toString(36).substring(7)
    }, finalTotal);

    if (response.success && response.orderId) {
      setConfirmedCart(cart);
      clearSession();
      setSuccessOrderId(response.orderId);
    }
  };

  if (!displayCart || displayCart.items.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">Cart is empty...</div>;
  }

  // Override summary with backend values if available
  const cartWithBackendPricing = {
    ...displayCart,
    summary: backendSummary ? {
      subtotal: backendSummary.subtotal,
      discount: backendSummary.discount,
      tax: backendSummary.platformFee,
      deliveryFee: backendSummary.deliveryFee,
      total: backendSummary.grandTotal
    } : displayCart.summary
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      {successOrderId && confirmedCart ? (
        <SuccessAnimation 
          orderId={successOrderId}
          cart={confirmedCart}
          onTrack={() => {
            router.push(APP_ROUTES.ORDERS.DETAILS(successOrderId));
          }}
          onContinue={() => router.push(APP_ROUTES.HOME)}
        />
      ) : (
        <>
          <main className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto pb-40">
            <PaymentMethodCard 
              selectedId={state.paymentMethodId}
              onSelect={setPaymentMethodId}
            />
            
            <OrderNotesCard 
              notes={state.studentNotes}
              onChange={setStudentNotes}
            />
            
            <OrderSummaryCard cart={cartWithBackendPricing} />
            
            <OrderPolicyCard />

            <TermsCard 
              accepted={state.termsAccepted}
              onToggle={setTermsAccepted}
            />
          </main>

          <StickyCheckoutBar 
            total={finalTotal}
            isValid={isValid}
            isPlacingOrder={isPlacingOrder}
            onPlaceOrder={handlePlaceOrder}
          />
        </>
      )}

      {/* Error Bottom Sheet */}
      {orderError && (
        <div className="fixed inset-0 z-50 bg-background/50 flex items-end">
          <BottomSheet className="w-full bg-card rounded-t-3xl p-6 min-h-[200px] flex flex-col justify-center items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-border">
            <h3 className="text-xl font-bold text-destructive">Checkout Failed</h3>
            <p className="text-muted-foreground text-center max-w-xs">{orderError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl"
            >
              Try Again
            </button>
          </BottomSheet>
        </div>
      )}
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutPageContent />
    </CheckoutProvider>
  );
}
