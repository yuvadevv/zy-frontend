'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Loader2,
  Lock,
  Building2,
  GraduationCap,
  Calendar,
  Layers,
  Hash,
  ExternalLink
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
    getSubtotal, 
    getGrandTotal,
    getVendorGroups,
    setActiveOrder,
    placeOrder,
    clearCart
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

  // Part 5: Student Details strictly read-only from authenticated student profile / DB
  const rawName = profile?.full_name || (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.name || '';
  const studentName = cleanStudentName(rawName, user?.email);
  const phoneNumber = profile?.phone_number || (user as any)?.phone || (user as any)?.user_metadata?.phone || (user as any)?.user_metadata?.phone_number || '';
  const rollNumber = academicRecord?.roll_number || (user as any)?.user_metadata?.roll_number || '';
  const branchName = academicRecord?.branches?.name || (user as any)?.user_metadata?.branch || '';
  const academicYear = academicRecord?.academic_years?.name || (academicRecord?.academic_years as any)?.label || (user as any)?.user_metadata?.academic_year || '';
  const sectionName = academicRecord?.sections?.name || (user as any)?.user_metadata?.section || '';

  const hasMissingProfileFields = !studentName || !phoneNumber || !rollNumber || !branchName;

  const vendorGroups = getVendorGroups();

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

        const res = await workerClient.previewFoodOrder(payload);
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
  }, [items]);

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
        paymentMethod,
        idempotencyKey: idempotencyKeyRef.current,
        studentName,
        studentPhone: phoneNumber,
      });

      const resData = createRes.data || createRes;
      const orderData = resData.order || resData.orders?.[0];
      const checkoutData = resData.checkout;

      if (!orderData && !checkoutData) {
        throw new Error(createRes.error?.message || 'Failed to initialize food order.');
      }

      // Clear cart from local state
      clearCart();

      // Target redirect route
      const destinationId = checkoutData?.id || orderData?.id || orderData?.order_number || orderData?.orderNumber;

      // Case A: Pay at Counter (CASH_AT_COUNTER)
      if (paymentMethod === 'CASH_AT_COUNTER' || !resData.requiresPayment) {
        if (orderData) setActiveOrder(orderData);
        router.replace(APP_ROUTES.FOOD.ORDER_CONFIRMATION(destinationId));
        return;
      }

      // Case B: Pay Online (ONLINE_UPI)
      const paymentInfo = resData.payment;

      if (!paymentInfo) {
        throw new Error('Payment gateway order information missing from server response.');
      }

      // Subcase B1: Development Mock Mode
      if (paymentInfo.keyId === 'mock_key') {
        await new Promise((resolve) => setTimeout(resolve, 600));

        await workerClient.verifyFoodPayment({
          checkoutId: checkoutData?.id,
          orderId: orderData?.id,
          providerOrderId: paymentInfo.providerOrderId,
          providerPaymentId: `mock_pay_${Date.now()}`,
        });

        const verifiedOrder = {
          ...orderData,
          payment_status: 'paid',
          paymentStatus: 'PAID',
        };

        if (verifiedOrder) setActiveOrder(verifiedOrder);
        router.replace(APP_ROUTES.FOOD.ORDER_CONFIRMATION(destinationId));
        return;
      }

      // Subcase B2: Production / Test Razorpay Gateway
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not connect to payment gateway. Please check your internet connection.');
      }

      const options = {
        key: paymentInfo.keyId,
        amount: Math.round(paymentInfo.amount * 100), // paise
        currency: paymentInfo.currency || 'INR',
        name: 'BLINTZY Campus Food',
        description: `Campus Dining Pickup Order - ${checkoutData?.checkoutNumber || 'Unified Checkout'}`,
        order_id: paymentInfo.providerOrderId,
        handler: async function (response: any) {
          try {
            // Strictly verify signature on server before confirming order
            await workerClient.verifyFoodPayment({
              checkoutId: checkoutData?.id,
              orderId: orderData?.id,
              providerOrderId: paymentInfo.providerOrderId,
              providerPaymentId: response.razorpay_payment_id,
              providerSignature: response.razorpay_signature,
            });

            const verifiedOrder = {
              ...orderData,
              payment_status: 'paid',
              paymentStatus: 'PAID',
            };

            if (verifiedOrder) setActiveOrder(verifiedOrder);
            router.replace(APP_ROUTES.FOOD.ORDER_CONFIRMATION(destinationId));
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
            setErrorMessage('Payment was cancelled. Your order remains pending, you can retry anytime.');
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
              Verified Campus Food Collection
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
        {/* Multi-Counter Context Cards (Part 3) */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
              Counters for this Order ({vendorGroups.length})
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Direct Pickup
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {vendorGroups.map((group) => (
              <div 
                key={group.vendorId}
                className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200/90 shadow-2xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-2xs shrink-0">
                    <Store className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-xs font-black text-[#151515] truncate">
                      {group.vendorName}
                    </span>
                    <span className="text-[10.5px] font-bold text-orange-950 truncate">
                      {group.counterLocation}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-xs font-black text-[#151515]">
                    ₹{group.subtotal}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500">
                    {group.items.length} {group.items.length === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/70 text-[10.5px] text-gray-600 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
            <span>Separate tokens will be generated for each counter for fast, zero-confusion collection.</span>
          </div>
        </section>

        {/* Part 5: Authenticated Student Information (6 Verified Read-Only Fields) */}
        <section className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-150">
            <div className="flex items-center gap-1.5 font-black text-xs text-[#151515]">
              <User className="w-4 h-4 text-[#FF6B00]" />
              <span>Student Identity (Read-Only)</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-2.5 h-2.5" />
              <span>Database Verified</span>
            </span>
          </div>

          {/* Missing fields guidance notice */}
          {hasMissingProfileFields && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Some academic profile fields are incomplete.</span>
              </div>
              <Link 
                href="/app/profile" 
                className="font-bold text-[#FF6B00] hover:underline shrink-0 flex items-center gap-0.5"
              >
                <span>Edit Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* 6 Grid Fields */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* 1. Full Student Name */}
            <div className="flex flex-col p-2.5 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Full Name
              </span>
              <span className="font-extrabold text-[#151515] mt-0.5 truncate">
                {studentName || 'Campus Student'}
              </span>
            </div>

            {/* 2. Registered Mobile Number */}
            <div className="flex flex-col p-2.5 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Registered Mobile
              </span>
              <span className="font-extrabold text-[#151515] mt-0.5 truncate">
                {phoneNumber || 'Not configured'}
              </span>
            </div>

            {/* 3. Roll Number */}
            <div className="flex flex-col p-2.5 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-2.5 h-2.5" />
                <span>Roll Number</span>
              </span>
              <span className="font-extrabold text-[#151515] mt-0.5 truncate">
                {rollNumber || 'Not specified'}
              </span>
            </div>

            {/* 4. Branch */}
            <div className="flex flex-col p-2.5 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5" />
                <span>Branch</span>
              </span>
              <span className="font-extrabold text-[#151515] mt-0.5 truncate">
                {branchName || 'Not specified'}
              </span>
            </div>

            {/* 5. Academic Year / Class */}
            <div className="flex flex-col p-2.5 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                <span>Academic Year</span>
              </span>
              <span className="font-extrabold text-[#151515] mt-0.5 truncate">
                {academicYear || 'Current Year'}
              </span>
            </div>

            {/* 6. Section */}
            <div className="flex flex-col p-2.5 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-2.5 h-2.5" />
                <span>Section</span>
              </span>
              <span className="font-extrabold text-[#151515] mt-0.5 truncate">
                {sectionName || 'General'}
              </span>
            </div>
          </div>
        </section>

        {/* 3. Payment Method Selection (Part 4) */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 px-0.5">
            Select Payment Method
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Option A: Online UPI (Recommended) */}
            <button
              type="button"
              onClick={() => setPaymentMethod('ONLINE_UPI')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                paymentMethod === 'ONLINE_UPI'
                  ? 'bg-orange-50/90 border-[#FF6B00] shadow-2xs ring-1 ring-[#FF6B00]'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                paymentMethod === 'ONLINE_UPI'
                  ? 'bg-[#FF6B00] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <CreditCard className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#151515]">
                    Pay Online (Instant UPI)
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#FF6B00] text-white">
                    Instant
                  </span>
                </div>
                <p className="text-[10.5px] text-gray-500 font-medium mt-0.5 leading-snug">
                  GPay, PhonePe, Paytm or UPI Apps. Single combined payment for all counters.
                </p>
              </div>
            </button>

            {/* Option B: Pay Cash at Counter */}
            <button
              type="button"
              onClick={() => setPaymentMethod('CASH_AT_COUNTER')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                paymentMethod === 'CASH_AT_COUNTER'
                  ? 'bg-orange-50/90 border-[#FF6B00] shadow-2xs ring-1 ring-[#FF6B00]'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                paymentMethod === 'CASH_AT_COUNTER'
                  ? 'bg-[#FF6B00] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <Banknote className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#151515]">
                    Pay at Counter (Cash/POS)
                  </span>
                </div>
                <p className="text-[10.5px] text-gray-500 font-medium mt-0.5 leading-snug">
                  Pay directly to staff upon pickup. Token marked paid upon staff confirmation.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* 4. Order Summary Card */}
        <section className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-150">
            <span className="font-black text-[#151515]">Total Payable</span>
            <div className="flex items-center gap-1.5">
              {isCalculatingPreview && (
                <Loader2 className="w-3 h-3 text-[#FF6B00] animate-spin" />
              )}
              <span className="text-base font-black text-[#151515]">
                ₹{displayTotal}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
            <span>Items Count: {items.length}</span>
            <span>Platform & Delivery Fee: ₹0</span>
          </div>
        </section>
      </div>

      {/* 5. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3.5 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-40 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
            {paymentMethod === 'ONLINE_UPI' ? 'Pay Online' : 'Pay at Counter'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight mt-0.5">
            ₹{displayTotal}
          </span>
        </div>

        <button
          onClick={handleConfirmOrder}
          disabled={isSubmitting || items.length === 0}
          className="flex-1 max-w-[240px] py-3.5 px-5 rounded-2xl bg-[#FF6B00] hover:bg-orange-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{paymentMethod === 'ONLINE_UPI' ? 'Pay & Place Order' : 'Confirm Order'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
