'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Store, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck, 
  ChefHat, 
  Utensils, 
  Receipt,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';
import { useFoodCart } from '@/features/food/store/useFoodCart';
import { FoodPickupQR } from '@/features/food/components/FoodPickupQR';
import { DietaryBadge } from '@/features/food/components/DietaryBadge';
import { APP_ROUTES } from '@/constants/routes';

export default function FoodOrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) || '';

  const { activeOrder, clearActiveOrder } = useFoodCart();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vendor Pickup Verification Simulator State
  const [isVerifyingPickup, setIsVerifyingPickup] = useState(false);
  const [pickupResult, setPickupResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  // 1. Fetch live order details from backend
  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      if (!orderId) return;
      try {
        setLoading(true);
        setError(null);

        // First attempt fetching via workerClient
        const res = await workerClient.getFoodOrder(orderId);
        if (isMounted && res.data?.order) {
          setOrder(res.data.order);
        } else if (isMounted && res.order) {
          setOrder(res.order);
        }
      } catch (err: any) {
        console.warn('Backend fetch failed, falling back to local session store:', err);
        // Fallback to active order in local Zustand store if offline or matching
        if (
          isMounted &&
          activeOrder &&
          (activeOrder.id === orderId ||
            activeOrder.orderId === orderId ||
            activeOrder.orderNumber === orderId)
        ) {
          setOrder(activeOrder);
        } else {
          setError('Order details could not be loaded.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, activeOrder]);

  // 2. Vendor Simulator Handler: Test backend verification and replay prevention
  const handleSimulateVendorPickup = async () => {
    if (!order) return;
    setIsVerifyingPickup(true);
    setPickupResult(null);

    const credential = order.pickup_otp || order.pickupOtp || order.pickup_qr_secret || order.pickupQrSecret;

    try {
      const res = await workerClient.verifyFoodPickup(order.id || order.orderId || orderId, credential);
      setPickupResult({
        success: true,
        message: res.data?.message || res.message || 'Pickup verified successfully!',
      });
      // Refresh order status
      setOrder((prev: any) => ({
        ...prev,
        order_status: 'collected',
        orderStatus: 'collected',
        payment_status: 'paid',
        paymentStatus: 'PAID',
        collected_at: Date.now(),
      }));
    } catch (err: any) {
      setPickupResult({
        success: false,
        error: err.message || 'Verification failed. Credential may have expired or already been used.',
      });
    } finally {
      setIsVerifyingPickup(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 gap-3 select-none">
        <div className="w-10 h-10 border-3 border-orange-200 border-t-[#FF6B00] rounded-full animate-spin" />
        <span className="text-xs font-bold text-gray-500">
          Loading order verification details...
        </span>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center gap-4 select-none">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-black text-gray-900">Order Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">{error}</p>
        </div>
        <button
          onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
          className="px-4 py-2 rounded-xl bg-[#151515] text-white text-xs font-black"
        >
          Back to Food Menu
        </button>
      </div>
    );
  }

  const orderNumber = order.order_number || order.orderNumber || order.orderId || orderId;
  const tokenNumber = order.token_number || order.tokenNumber || 'F-101';
  const vendorName = order.vendor_name || order.vendorName || 'Campus Counter';
  const counterLocation = order.counter_location || order.counterLocation || 'Main Counter';
  const paymentMethod = order.payment_method || order.paymentMethod || 'ONLINE_UPI';
  const paymentStatus = order.payment_status || order.paymentStatus || 'pending';
  const orderStatus = order.order_status || order.orderStatus || 'confirmed';
  const pickupOtp = order.pickup_otp || order.pickupOtp || '0000';
  const pickupQrSecret = order.pickup_qr_secret || order.pickupQrSecret || orderNumber;
  const grandTotal = order.grand_total ?? order.grandTotal ?? 0;
  const items = order.items || [];

  const isCollected = orderStatus.toLowerCase() === 'collected';
  const isPaid = paymentStatus.toLowerCase() === 'paid';

  return (
    <div className="w-full flex flex-col pb-36 select-none relative min-h-screen bg-white">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 -mx-3.5 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#151515] active:scale-95 transition flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Back to Campus Food"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-base font-black text-[#151515] tracking-tight">
              Order Confirmation
            </h1>
            <span className="text-[10.5px] font-bold text-gray-400 font-mono">
              Ref: {orderNumber}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${
            isCollected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-orange-50 text-[#FF6B00] border-orange-300'
          }`}
        >
          {isCollected ? 'Collected' : 'Order Active'}
        </span>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex flex-col gap-4 pt-3">
        {/* Token Number Hero Banner */}
        <section className="p-5 rounded-3xl bg-[#151515] text-white flex flex-col items-center justify-center gap-2 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest">
            Campus Pickup Token
          </span>

          <span className="text-4xl sm:text-5xl font-black text-[#FF6B00] tracking-wider font-mono">
            {tokenNumber}
          </span>

          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-300 font-semibold text-center">
            <Store className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <span>{counterLocation}</span>
          </div>

          <div className="mt-2 pt-2.5 border-t border-zinc-800/80 w-full flex items-center justify-between text-[11px] text-zinc-400">
            <span>Vendor: <strong className="text-white">{vendorName}</strong></span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Prep: ~10-15 mins</span>
            </span>
          </div>
        </section>

        {/* Live Order Status Stepper */}
        <section className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-900 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-[#FF6B00]" />
              <span>Kitchen Progress</span>
            </span>
            <span
              className={`text-[10.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isCollected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-orange-50 text-[#FF6B00] border-orange-200'
              }`}
            >
              {isCollected ? 'Completed' : 'Freshly Cooking'}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5">
            <div className="h-1.5 rounded-full bg-[#FF6B00]" />
            <div className={`h-1.5 rounded-full ${orderStatus !== 'confirmed' ? 'bg-[#FF6B00]' : 'bg-orange-200 animate-pulse'}`} />
            <div className={`h-1.5 rounded-full ${isCollected ? 'bg-[#FF6B00]' : 'bg-gray-200'}`} />
            <div className={`h-1.5 rounded-full ${isCollected ? 'bg-emerald-500' : 'bg-gray-200'}`} />
          </div>

          <div className="grid grid-cols-4 text-center text-[9.5px] font-bold text-gray-500">
            <span className="text-gray-900">1. Confirmed</span>
            <span className="text-[#FF6B00]">2. Cooking</span>
            <span>3. Ready</span>
            <span className={isCollected ? 'text-emerald-700 font-black' : ''}>4. Collected</span>
          </div>
        </section>

        {/* 3. SECURE PICKUP VERIFICATION (QR & OTP) */}
        <section className="flex flex-col gap-2">
          <FoodPickupQR
            tokenNumber={tokenNumber}
            pickupOtp={pickupOtp}
            pickupQrSecret={pickupQrSecret}
            orderNumber={orderNumber}
          />
        </section>

        {/* 4. ORDER ITEMS BREAKDOWN */}
        <section className="p-4 rounded-2xl bg-white border border-gray-150 shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs">
            <span className="font-black text-gray-900 uppercase tracking-wider text-[11px]">
              Items Ordered ({items.length})
            </span>
            <span className="text-gray-400 font-mono text-[10.5px]">
              {new Date(order.created_at || order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {items.map((item: any, idx: number) => {
              const name = item.product_name || item.name || item.product?.name || `Item ${idx + 1}`;
              const qty = item.quantity || 1;
              const itemTotal = item.item_total ?? item.itemTotal ?? item.totalPrice ?? (item.unitPrice ? item.unitPrice * qty : 0);
              const dietary = item.dietary || item.product?.dietary || 'veg';

              return (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <DietaryBadge type={dietary} size="sm" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-900 truncate">
                        {qty}x {name}
                      </span>
                      {item.cooking_notes && (
                        <span className="text-[10px] text-gray-400 italic truncate">
                          "{item.cooking_notes}"
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-black text-gray-900 shrink-0">
                    ₹{itemTotal}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. PAYMENT & BILL SUMMARY */}
        <section className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-2xs flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between text-gray-600">
            <span>Payment Method</span>
            <span className="font-extrabold text-gray-900">
              {paymentMethod === 'ONLINE_UPI' ? 'Paid Online (UPI)' : 'Pay at Counter (Cash/UPI)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span>Payment Status</span>
            <span
              className={`font-black text-[10.5px] px-2 py-0.2 rounded-md ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isPaid ? 'PAID' : 'PAYABLE AT COUNTER'}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span>Counter Pickup</span>
            <span className="font-bold text-emerald-600">FREE</span>
          </div>

          <div className="pt-2 border-t border-gray-200 flex items-center justify-between font-black text-sm text-[#151515]">
            <span>{isPaid ? 'Amount Paid' : 'Amount Due at Collection'}</span>
            <span className="text-[#FF6B00] text-base">₹{grandTotal}</span>
          </div>
        </section>

        {/* 6. VENDOR PICKUP VERIFICATION SIMULATOR (Demonstrates Server-side Replay Prevention) */}
        <section className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
              <span>Counter Verification Simulator</span>
            </div>
            <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
              Live Test Tool
            </span>
          </div>

          <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
            Test the vendor backend endpoint: Click below to verify this order's pickup credential (OTP: <strong>{pickupOtp}</strong>).
            Subsequent attempts are blocked by the backend to prevent QR code reuse.
          </p>

          <button
            onClick={handleSimulateVendorPickup}
            disabled={isVerifyingPickup || isCollected}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
              isCollected
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-[#FF6B00] hover:bg-orange-600 text-white shadow-xs active:scale-98 disabled:opacity-60'
            }`}
          >
            {isVerifyingPickup ? (
              <span>Verifying with Backend...</span>
            ) : isCollected ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Verified & Collected (Credentials Locked)</span>
              </>
            ) : (
              <>
                <span>Simulate Counter Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {pickupResult && (
            <div
              className={`p-2.5 rounded-xl text-xs font-semibold ${
                pickupResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {pickupResult.success ? pickupResult.message : pickupResult.error}
            </div>
          )}
        </section>
      </div>

      {/* 3. STICKY BOTTOM RETURN BAR */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3.5 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-40 flex items-center justify-between gap-3">
        <button
          onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
          className="flex-1 py-3 px-4 rounded-xl bg-[#151515] hover:bg-black active:scale-98 transition text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <span>Return to Campus Food</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
}

