'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Store, 
  Clock, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  User,
  MapPin,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useFoodCart } from '@/features/food/store/useFoodCart';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { cleanStudentName } from '@/features/food/components/FoodStudentHeader';
import { DietaryBadge } from '@/features/food/components/DietaryBadge';
import { FoodPaymentMethod } from '@/features/food/types';
import { APP_ROUTES } from '@/constants/routes';
import { workerClient } from '@/lib/api/workerClient';

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function FoodCheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    vendorId,
    vendorName, 
    counterLocation, 
    getSubtotal, 
    getGrandTotal,
    setActiveOrder,
    placeOrder 
  } = useFoodCart();

  const { profile, academicRecord } = useStudent();
  const { user } = useAuthSession();

  const [paymentMethod, setPaymentMethod] = useState<FoodPaymentMethod>('ONLINE_UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live verified backend preview state
  const [verifiedTotal, setVerifiedTotal] = useState<number | null>(null);
  const [isCalculatingPreview, setIsCalculatingPreview] = useState(false);

  // Idempotency: generate unique key per checkout session
  const idempotencyKeyRef = useRef<string>(`foid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const isRequestInFlight = useRef(false);

  // If cart is empty, redirect back to campus food
  useEffect(() => {
    if (items.length === 0 && !isRequestInFlight.current) {
      router.replace(APP_ROUTES.CAMPUS_FOOD);
    }
  }, [items, router]);

  // Student info resolution
  const rawName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  const studentName = cleanStudentName(rawName, user?.email);
  const collegeName = academicRecord?.colleges?.name || 'Ramachandra College of Engineering';
  const phoneNumber = profile?.phone_number || (user as any)?.phone || user?.user_metadata?.phone || user?.user_metadata?.phone_number || '';

  // 1. Authoritative Backend Pricing Preview Check
  useEffect(() => {
    let isMounted = true;

    async function checkBackendPricing() {
      if (items.length === 0) return;
      try {
        setIsCalculatingPreview(true);
        const payload = items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          cookingNotes: i.notes,
        }));

        const res = await workerClient.previewFoodOrder(payload, vendorId || undefined);
        const previewData = res.data || res;
        if (isMounted && previewData.grandTotal !== undefined) {
          setVerifiedTotal(previewData.grandTotal);
        }
      } catch (err: any) {
        console.warn('Backend preview check fallback to local computation:', err);
      } finally {
        if (isMounted) setIsCalculatingPreview(false);
      }
    }

    checkBackendPricing();

    return () => {
      isMounted = false;
    };
  }, [items, vendorId]);

  const clientSubtotal = getSubtotal();
  const displayTotal = verifiedTotal ?? getGrandTotal();

  // 2. Secure Order Confirmation & Payment Gateway Flow
  const handleConfirmOrder = async () => {
    if (items.length === 0 || isSubmitting || isRequestInFlight.current) return;

    isRequestInFlight.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const itemsPayload = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        cookingNotes: i.notes || undefined,
      }));

      // Step 1: Create Order on Backend (Authoritative Server Pricing + Idempotency)
      const createRes = await workerClient.createFoodOrder({
        items: itemsPayload,
        vendorId: vendorId || items[0]?.product?.vendorId || 'vendor_canteen_stall',
        paymentMethod,
        idempotencyKey: idempotencyKeyRef.current,
        studentName,
        studentPhone: phoneNumber,
      });

      const orderData = createRes.data?.order || createRes.order;
      if (!orderData) {
        throw new Error(createRes.error?.message || 'Failed to initialize food order.');
      }

      // Case A: Pay at Counter (CASH_AT_COUNTER)
      if (paymentMethod === 'CASH_AT_COUNTER' || !createRes.data?.requiresPayment) {
        setActiveOrder(orderData);
        router.replace(APP_ROUTES.FOOD.ORDER_CONFIRMATION(orderData.id || orderData.order_number || orderData.orderNumber));
        return;
      }

      // Case B: Pay Online (ONLINE_UPI)
      const paymentInfo = createRes.data?.payment || createRes.payment;

      if (!paymentInfo) {
        throw new Error('Payment gateway order information missing from server response.');
      }

      // Subcase B1: Development Mock Mode
      if (paymentInfo.keyId === 'mock_key') {
        // Simulate gateway verification
        await new Promise((resolve) => setTimeout(resolve, 800));

        await workerClient.verifyFoodPayment({
          orderId: orderData.id,
          providerOrderId: paymentInfo.providerOrderId,
          providerPaymentId: `mock_pay_${Date.now()}`,
        });

        const verifiedOrder = {
          ...orderData,
          payment_status: 'paid',
          paymentStatus: 'PAID',
        };

        setActiveOrder(verifiedOrder);
        router.replace(APP_ROUTES.FOOD.ORDER_CONFIRMATION(orderData.id || orderData.order_number || orderData.orderNumber));
        return;
      }

      // Subcase B2: Production / Test Razorpay Gateway
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not connect to payment gateway. Please check your internet connection.');
      }

      const options = {
        key: paymentInfo.keyId,
        amount: paymentInfo.amount * 100, // paise
        currency: paymentInfo.currency || 'INR',
        name: 'BLINTZY Food',
        description: `Campus Dining Pickup - Token Order`,
        order_id: paymentInfo.providerOrderId,
        handler: async function (response: any) {
          try {
            // Strictly verify signature on server before confirming order
            await workerClient.verifyFoodPayment({
              orderId: orderData.id,
              providerOrderId: paymentInfo.providerOrderId,
              providerPaymentId: response.razorpay_payment_id,
              providerSignature: response.razorpay_signature,
            });

            const verifiedOrder = {
              ...orderData,
              payment_status: 'paid',
              paymentStatus: 'PAID',
            };

            setActiveOrder(verifiedOrder);
            router.replace(APP_ROUTES.FOOD.ORDER_CONFIRMATION(orderData.id || orderData.order_number || orderData.orderNumber));
          } catch (verifyErr: any) {
            console.error('Server signature verification failed:', verifyErr);
            setErrorMessage('Payment was received, but server signature verification failed. Please show your UPI confirmation at the counter.');
            setIsSubmitting(false);
            isRequestInFlight.current = false;
          }
        },
        prefill: {
          name: studentName,
          contact: phoneNumber,
          email: user?.email || '',
        },
        theme: {
          color: '#FF6B00',
        },
        modal: {
          ondismiss: function () {
            setErrorMessage('Payment was cancelled. Your cart items are preserved, you can retry whenever you are ready.');
            setIsSubmitting(false);
            isRequestInFlight.current = false;
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setErrorMessage(resp.error?.description || 'Payment failed. Please try another UPI app or select Pay at Counter.');
        setIsSubmitting(false);
        isRequestInFlight.current = false;
      });

      rzp.open();
    } catch (err: any) {
      console.error('Order Submission Error:', err);
      // Fallback local placement if offline test
      if (err.message && err.message.includes('fetch')) {
        const fallbackOrder = placeOrder(paymentMethod);
        setActiveOrder(fallbackOrder);
        router.replace(APP_ROUTES.FOOD.ORDER_CONFIRMATION(fallbackOrder.orderId || fallbackOrder.tokenNumber));
        return;
      }
      setErrorMessage(err.message || 'Failed to place food order. Please try again.');
      setIsSubmitting(false);
      isRequestInFlight.current = false;
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col pb-36 select-none relative min-h-screen bg-white">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 -mx-3.5 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push(APP_ROUTES.FOOD.CART)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#151515] active:scale-95 transition flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Back to Cart"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-base font-black text-[#151515] tracking-tight">
              Order Checkout
            </h1>
            <span className="text-[10.5px] font-bold text-gray-400">
              Verified Campus Dining Counter
            </span>
          </div>
        </div>
      </header>

      {/* Error or Cancellation Banner */}
      {errorMessage && (
        <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed font-medium">
            {errorMessage}
          </div>
        </div>
      )}

      {/* 2. BODY CONTENT */}
      <div className="flex flex-col gap-4 pt-3">
        {/* Counter Pickup Context Card */}
        <section className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/90 shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-2xs shrink-0">
                <Store className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-xs font-black text-[#151515] truncate">
                  {vendorName || 'Campus Food Counter'}
                </span>
                <span className="text-[11px] font-bold text-orange-950 truncate">
                  {counterLocation || 'Main Canteen Counter'}
                </span>
              </div>
            </div>

            <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#FF6B00] border border-orange-300 shadow-2xs">
              Token Pickup
            </span>
          </div>

          <div className="pt-2.5 border-t border-orange-200/70 flex items-center justify-between text-[11px] text-gray-700 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Prep Time: ~10-15 mins</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Kitchen</span>
            </div>
          </div>
        </section>

        {/* Student Pickup Identity */}
        <section className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-gray-200/60">
            <div className="flex items-center gap-1.5 font-bold text-gray-700">
              <User className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Student Details</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
              Authenticated Student
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-[#151515]">{studentName}</span>
            <span className="text-gray-500 font-medium">{phoneNumber || 'Campus Student'}</span>
          </div>

          <div className="flex items-center gap-1 text-[10.5px] text-gray-500 font-medium">
            <MapPin className="w-3 h-3 text-[#FF6B00] shrink-0" />
            <span className="truncate">{collegeName}</span>
          </div>
        </section>

        {/* Order Items Review */}
        <section className="p-3.5 rounded-2xl bg-white border border-gray-150 shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
              Order Items ({items.length})
            </span>
            <button
              onClick={() => router.push(APP_ROUTES.FOOD.CART)}
              className="text-[11px] font-bold text-[#FF6B00] hover:underline cursor-pointer"
            >
              Edit Cart
            </button>
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <DietaryBadge type={item.product.dietary} size="sm" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-[#151515] truncate">
                      {item.quantity}x {item.product.name}
                    </span>
                    {item.notes && (
                      <span className="text-[10px] text-gray-400 italic truncate">
                        "{item.notes}"
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-black text-[#151515] shrink-0">
                  ₹{item.totalPrice}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Method Selector */}
        <section className="p-3.5 rounded-2xl bg-white border border-gray-150 shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
              Select Payment Method
            </span>
            <span className="text-[10px] font-bold text-gray-400">
              Server-Verified Security
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Online UPI */}
            <button
              type="button"
              onClick={() => setPaymentMethod('ONLINE_UPI')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                paymentMethod === 'ONLINE_UPI'
                  ? 'border-[#FF6B00] bg-orange-50/60 ring-2 ring-[#FF6B00]/20'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <CreditCard className="w-4 h-4 text-[#FF6B00]" />
                {paymentMethod === 'ONLINE_UPI' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                )}
              </div>
              <span className="font-black text-xs text-[#151515]">Pay Online (UPI)</span>
              <span className="text-[10px] text-gray-500 font-medium">GPay / PhonePe / QR</span>
            </button>

            {/* Pay at Counter */}
            <button
              type="button"
              onClick={() => setPaymentMethod('CASH_AT_COUNTER')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                paymentMethod === 'CASH_AT_COUNTER'
                  ? 'border-[#FF6B00] bg-orange-50/60 ring-2 ring-[#FF6B00]/20'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Banknote className="w-4 h-4 text-[#FF6B00]" />
                {paymentMethod === 'CASH_AT_COUNTER' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                )}
              </div>
              <span className="font-black text-xs text-[#151515]">Pay at Counter</span>
              <span className="text-[10px] text-gray-500 font-medium">Cash / UPI on pickup</span>
            </button>
          </div>

          {/* Payment Method Details Note */}
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-150 text-[11px] text-gray-600 leading-relaxed font-medium">
            {paymentMethod === 'ONLINE_UPI' ? (
              <p>
                🔒 <strong>Online UPI:</strong> Pay instantly via any UPI app. Token is generated and sent directly to kitchen display upon server signature verification.
              </p>
            ) : (
              <p>
                💵 <strong>Pay at Counter:</strong> Order token is generated immediately. Pay with cash or UPI at the canteen counter when collecting your food.
              </p>
            )}
          </div>
        </section>

        {/* Bill Summary */}
        <section className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-2xs flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between text-gray-600">
            <span>Items Subtotal</span>
            <span className="font-bold text-gray-900">
              ₹{clientSubtotal}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span>Counter Pickup</span>
            <span className="font-bold text-emerald-600">FREE</span>
          </div>

          <div className="pt-2 border-t border-gray-200 flex items-center justify-between font-black text-sm text-[#151515]">
            <div className="flex items-center gap-1.5">
              <span>Total Payable Amount</span>
              {isCalculatingPreview && (
                <Loader2 className="w-3 h-3 text-[#FF6B00] animate-spin" />
              )}
            </div>
            <span className="text-[#FF6B00] text-base">₹{displayTotal}</span>
          </div>
        </section>
      </div>

      {/* 3. STICKY BOTTOM CONFIRMATION BUTTON */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3.5 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-40 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
            Final Payable
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight mt-0.5">
            ₹{displayTotal}
          </span>
        </div>

        <button
          onClick={handleConfirmOrder}
          disabled={isSubmitting}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-[#FF6B00] hover:bg-orange-600 active:scale-98 transition-all text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/30 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
              <span>Securing Order Token...</span>
            </>
          ) : (
            <>
              <span>
                {paymentMethod === 'ONLINE_UPI' ? 'Pay Online & Confirm' : 'Confirm & Generate Token'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
