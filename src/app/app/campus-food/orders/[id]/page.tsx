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
  ArrowRight,
  HelpCircle,
  X,
  Send,
  Loader2,
  Building2,
  QrCode,
  Layers
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

  const { activeOrder } = useFoodCart();

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Help & Support Modal State (Part 12)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [issueType, setIssueType] = useState('missing_item');
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [issueSuccessMessage, setIssueSuccessMessage] = useState<string | null>(null);
  const [issueErrorMessage, setIssueErrorMessage] = useState<string | null>(null);

  // 1. Fetch live order details from backend
  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      if (!orderId) return;
      try {
        setLoading(true);
        setError(null);

        const res = await workerClient.getFoodOrder(orderId);
        const resData = res.data || res;

        if (isMounted) {
          if (resData.order || resData.checkout || resData.childOrders) {
            setOrderData(resData);
          } else {
            setOrderData({ order: resData });
          }
        }
      } catch (err: any) {
        console.warn('Backend fetch failed, falling back to local session store:', err);
        if (
          isMounted &&
          activeOrder &&
          (activeOrder.id === orderId ||
            activeOrder.orderId === orderId ||
            activeOrder.orderNumber === orderId)
        ) {
          setOrderData({ order: activeOrder, childOrders: [activeOrder] });
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

  // Support Issue Submission
  const handleReportIssue = async (targetOrderRef: string) => {
    if (!issueDescription.trim() || isSubmittingIssue) return;
    setIsSubmittingIssue(true);
    setIssueSuccessMessage(null);
    setIssueErrorMessage(null);

    try {
      const res = await workerClient.reportFoodOrderIssue(targetOrderRef, {
        issueType,
        description: issueDescription.trim()
      });
      const resData = res.data || res;
      setIssueSuccessMessage(resData.message || 'Your issue has been logged. Our campus team will assist you.');
      setIssueDescription('');
      setTimeout(() => {
        setIsHelpModalOpen(false);
        setIssueSuccessMessage(null);
      }, 2500);
    } catch (err: any) {
      setIssueErrorMessage(err.message || 'Failed to submit issue. Please speak directly to the counter supervisor.');
    } finally {
      setIsSubmittingIssue(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 gap-3 select-none">
        <div className="w-10 h-10 border-3 border-orange-200 border-t-[#FF6B00] rounded-full animate-spin" />
        <span className="text-xs font-bold text-gray-500">
          Loading order and pickup tokens...
        </span>
      </div>
    );
  }

  if (error && !orderData) {
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

  // Resolve child orders (Multi-Counter Support - Part 3 & 10)
  const childOrders: any[] = orderData?.childOrders && orderData.childOrders.length > 0
    ? orderData.childOrders
    : orderData?.order
      ? [orderData.order]
      : [];

  const parentCheckout = orderData?.checkout;
  const isMultiCounter = childOrders.length > 1;

  const mainReference = parentCheckout?.checkout_number || childOrders[0]?.order_number || childOrders[0]?.orderNumber || orderId;

  return (
    <div className="w-full flex flex-col pb-36 select-none relative min-h-screen bg-white">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 -mx-3.5 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push('/app/campus-food/orders')}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#151515] active:scale-95 transition flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Back to Orders"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-base font-black text-[#151515] tracking-tight">
              {isMultiCounter ? 'Unified Order Tracking' : 'Order Details'}
            </h1>
            <span className="text-[10.5px] font-bold text-gray-400 font-mono">
              Ref: {mainReference}
            </span>
          </div>
        </div>

        {/* Help & Support Button (Part 12) */}
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition text-xs font-bold text-gray-700 flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Support</span>
        </button>
      </header>

      {/* Multi-Counter Overview Notice if multiple counters */}
      {isMultiCounter && (
        <div className="mt-3 p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200/90 flex items-center justify-between text-xs text-orange-950 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold">{childOrders.length} Campus Counters</span>
              <span className="text-[10.5px] text-gray-600">Show the respective token & QR code at each counter.</span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#FF6B00] border border-orange-300">
            Split Pickup
          </span>
        </div>
      )}

      {/* 2. CHILD ORDERS (Renders each counter independently) */}
      <div className="flex flex-col gap-6 pt-3">
        {childOrders.map((child, index) => {
          const cOrderNumber = child.order_number || child.orderNumber || child.id;
          const cTokenNumber = child.token_number || child.tokenNumber || 'Token Pending';
          const cVendorName = child.vendor_name || child.vendorName || (child.vendor_id === 'vendor_college_mess' ? 'College Mess Dining' : 'Campus Canteen Stall');
          const cCounterLocation = child.counter_location || child.counterLocation || 'Campus Counter';
          const cPaymentMethod = child.payment_method || child.paymentMethod || parentCheckout?.payment_method || 'ONLINE_UPI';
          const cPaymentStatus = child.payment_status || child.paymentStatus || parentCheckout?.payment_status || 'pending';
          const cOrderStatus = (child.order_status || child.orderStatus || 'confirmed').toLowerCase();
          const cPickupOtp = child.pickup_otp || child.pickupOtp || '000000';
          const cPickupQrSecret = child.pickup_qr_secret || child.pickupQrSecret || cOrderNumber;
          const cGrandTotal = child.grand_total ?? child.grandTotal ?? 0;
          const cItems = child.items || [];

          const isCollected = cOrderStatus === 'completed' || cOrderStatus === 'collected' || cOrderStatus === 'picked_up';
          const isReady = cOrderStatus === 'ready_for_pickup' || cOrderStatus === 'ready';
          const isPaid = cPaymentStatus === 'paid' || cPaymentStatus === 'PAID';

          return (
            <div 
              key={child.id || index} 
              className="flex flex-col gap-3.5 p-4 rounded-3xl bg-white border border-gray-200 shadow-2xs relative"
            >
              {/* Counter Index & Vendor Title */}
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-150">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-black text-xs shadow-2xs">
                    {index + 1}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-black text-[#151515]">
                      {cVendorName}
                    </span>
                    <span className="text-[10.5px] font-bold text-gray-500">
                      {cCounterLocation}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isCollected
                      ? 'bg-gray-100 text-gray-700 border-gray-300'
                      : isReady
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
                        : 'bg-orange-50 text-[#FF6B00] border-orange-300'
                  }`}
                >
                  {isCollected ? 'Picked Up' : isReady ? 'Ready for Pickup' : 'Cooking'}
                </span>
              </div>

              {/* Token Number Hero Card */}
              <div className="p-4 rounded-2xl bg-[#151515] text-white flex flex-col items-center justify-center gap-1 shadow-md">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Pickup Token
                </span>
                <span className="text-3xl sm:text-4xl font-black text-[#FF6B00] font-mono tracking-wider">
                  {cTokenNumber}
                </span>
                <span className="text-[10.5px] text-zinc-400 font-mono mt-0.5">
                  Order ID: {cOrderNumber}
                </span>
              </div>

              {/* Order Status Timeline (Part 10: Actual Backend Status) */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-[#FF6B00]" />
                    <span>Order Progress</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    Status: {cOrderStatus.toUpperCase()}
                  </span>
                </div>

                {/* Progress 4 Bars */}
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="h-1.5 rounded-full bg-[#FF6B00]" />
                  <div className={`h-1.5 rounded-full ${cOrderStatus !== 'payment_pending' ? 'bg-[#FF6B00]' : 'bg-gray-200'}`} />
                  <div className={`h-1.5 rounded-full ${isReady || isCollected ? 'bg-[#FF6B00]' : 'bg-gray-200'}`} />
                  <div className={`h-1.5 rounded-full ${isCollected ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                </div>

                <div className="grid grid-cols-4 text-center text-[9px] font-bold text-gray-500">
                  <span className="text-[#151515]">1. Placed</span>
                  <span className={cOrderStatus !== 'payment_pending' ? 'text-[#151515]' : ''}>2. Kitchen</span>
                  <span className={isReady ? 'text-emerald-700 font-black' : ''}>3. Ready</span>
                  <span className={isCollected ? 'text-emerald-700 font-black' : ''}>4. Picked Up</span>
                </div>
              </div>

              {/* Genuine Pickup QR & 6-Digit Manual Code (Part 11) */}
              {!isCollected ? (
                <div className="flex flex-col gap-1.5">
                  <FoodPickupQR
                    tokenNumber={cTokenNumber}
                    pickupOtp={cPickupOtp}
                    pickupQrSecret={cPickupQrSecret}
                    orderNumber={cOrderNumber}
                  />
                  <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-[10.5px] text-orange-950 flex items-center justify-center text-center font-medium">
                    <span>Show this QR or 6-digit code to the counter staff to claim your dishes.</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>This order has been verified and picked up. Credentials locked.</span>
                </div>
              )}

              {/* Items in this counter order */}
              <div className="p-3.5 rounded-2xl bg-white border border-gray-150 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Dishes for {cVendorName} ({cItems.length})
                </span>

                <div className="divide-y divide-gray-100">
                  {cItems.map((item: any, itIdx: number) => {
                    const name = item.product_name || item.name || item.product?.name || `Dish ${itIdx + 1}`;
                    const qty = item.quantity || 1;
                    const itemTotal = item.item_total ?? item.itemTotal ?? item.totalPrice ?? (item.unitPrice ? item.unitPrice * qty : 0);
                    const dietary = item.dietary || item.product?.dietary || 'veg';

                    return (
                      <div key={itIdx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <DietaryBadge type={dietary} size="sm" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[#151515] truncate">
                              {qty}x {name}
                            </span>
                            {item.cooking_notes && (
                              <span className="text-[10px] text-gray-400 italic truncate">
                                "{item.cooking_notes}"
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-extrabold text-[#151515] shrink-0">
                          ₹{itemTotal}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Counter Total</span>
                  <span className="font-black text-[#151515]">₹{cGrandTotal}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. HELP & SUPPORT MODAL (Part 12) */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl flex flex-col gap-3 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#151515]">Help & Support</h3>
                  <span className="text-[10.5px] font-medium text-gray-400">Order: {mainReference}</span>
                </div>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {issueSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex flex-col items-center text-center gap-2 my-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <span className="font-bold">{issueSuccessMessage}</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-[#151515]">Issue Type</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                  >
                    <option value="missing_item">Missing or Incorrect Item</option>
                    <option value="payment_issue">Payment / UPI Problem</option>
                    <option value="pickup_issue">Counter Pickup Delay / OTP Issue</option>
                    <option value="food_quality">Food Quality or Preparation</option>
                    <option value="cancellation_query">Cancellation Query</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-[#151515]">Describe the problem</label>
                  <textarea
                    rows={3}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Provide specific details so counter staff can assist quickly..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-medium bg-gray-50 focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>

                {issueErrorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                    {issueErrorMessage}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setIsHelpModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReportIssue(childOrders[0]?.id || orderId)}
                    disabled={isSubmittingIssue || !issueDescription.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingIssue ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Submit Issue</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. STICKY BOTTOM RETURN BAR */}
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
