'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Store, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Info, 
  AlertTriangle,
  ReceiptText,
  Building2
} from 'lucide-react';
import { useFoodCart } from '@/features/food/store/useFoodCart';
import { DietaryBadge } from '@/features/food/components/DietaryBadge';
import { SAMPLE_FOOD_MENU, getProductFallbackImage } from '@/features/food/config/sampleMenu';
import { APP_ROUTES } from '@/constants/routes';

export default function FoodCartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getGrandTotal,
    getVendorGroups
  } = useFoodCart();

  const subtotal = getSubtotal();
  const grandTotal = getGrandTotal();
  const vendorGroups = getVendorGroups();

  // Validate cart items against live catalogue data
  const validatedItems = useMemo(() => {
    return items.map((cartItem) => {
      const liveProduct = SAMPLE_FOOD_MENU.find((p) => p.id === cartItem.productId);
      return {
        ...cartItem,
        isAvailable: liveProduct ? liveProduct.isAvailable : true,
        catalogPrice: liveProduct ? liveProduct.price : cartItem.unitPrice,
      };
    });
  }, [items]);

  const hasUnavailableItems = validatedItems.some((item) => !item.isAvailable);

  const handleProceedToCheckout = () => {
    if (items.length === 0 || hasUnavailableItems) return;
    router.push(APP_ROUTES.FOOD.CHECKOUT);
  };

  return (
    <div className="w-full flex flex-col pb-36 select-none relative min-h-screen bg-white">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 -mx-3.5 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#151515] active:scale-95 transition flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Back to food menu"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-base font-black text-[#151515] tracking-tight">
              Food Cart & Summary
            </h1>
            <span className="text-[10.5px] font-bold text-gray-400">
              {items.length} {items.length === 1 ? 'item' : 'items'} • {vendorGroups.length} {vendorGroups.length === 1 ? 'Counter' : 'Counters'}
            </span>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 active:scale-95 transition flex items-center gap-1 cursor-pointer"
            title="Clear all cart items"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </header>

      {/* 2. MAIN CONTENT */}
      {items.length === 0 ? (
        // EMPTY STATE
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 gap-3">
          <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF6B00] mb-2 shadow-2xs">
            <ShoppingBag className="w-9 h-9 stroke-[1.8]" />
          </div>
          <h2 className="text-lg font-black text-[#151515] tracking-tight">
            Your Food Cart is Empty
          </h2>
          <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
            You haven't added any campus meals or snacks yet. Browse today's canteen specials and fresh mess plates.
          </p>
          <button
            onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF6B00] hover:bg-orange-600 active:scale-95 transition-all text-white text-xs font-black shadow-md shadow-orange-500/25 cursor-pointer"
          >
            <span>Explore Campus Menu</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        // ACTIVE CART CONTENT
        <div className="flex flex-col gap-4 pt-3">
          {/* Multi-Counter Context Banner */}
          <section className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-2xs shrink-0">
                  <Store className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-xs font-black text-[#151515]">
                    {vendorGroups.length > 1 ? 'Multi-Counter Cart' : vendorGroups[0]?.vendorName || 'Campus Food Counter'}
                  </span>
                  <span className="text-[10.5px] font-bold text-gray-600">
                    {vendorGroups.length > 1 
                      ? `${vendorGroups.length} separate pickup tokens will be issued`
                      : vendorGroups[0]?.counterLocation || 'Campus Counter'}
                  </span>
                </div>
              </div>

              <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#FF6B00] border border-orange-300 shadow-2xs shrink-0">
                {vendorGroups.length > 1 ? 'Unified Checkout' : 'Token Pickup'}
              </span>
            </div>

            <div className="pt-2 border-t border-orange-200/60 flex items-center gap-1.5 text-[10.5px] text-gray-600 font-medium">
              <Info className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span>Direct counter collection with secure 6-digit OTP and QR token. Zero extra fees.</span>
            </div>
          </section>

          {/* Warning for unavailable items if any */}
          {hasUnavailableItems && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Item Availability Changed</strong>
                <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                  One or more items in your cart are currently sold out. Please remove them to proceed with checkout.
                </p>
              </div>
            </div>
          )}

          {/* Cart Items Grouped By Vendor / Counter (Part 8) */}
          <div className="flex flex-col gap-4">
            {vendorGroups.map((group) => (
              <section 
                key={group.vendorId} 
                className="flex flex-col rounded-2xl bg-white border border-gray-200/90 overflow-hidden shadow-2xs"
              >
                {/* Vendor Counter Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-orange-50/40 border-b border-gray-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-xs font-black text-[#151515] truncate">
                        {group.vendorName}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 truncate">
                        {group.counterLocation}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200 shrink-0">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items in this Vendor Group */}
                <div className="divide-y divide-gray-100">
                  {group.items.map((cartItem) => {
                    const fallbackImg = getProductFallbackImage(cartItem.product.id, cartItem.product.categoryId);
                    const imageSrc = cartItem.product.image && typeof cartItem.product.image === 'string' && cartItem.product.image.trim().length > 0
                      ? cartItem.product.image.trim()
                      : fallbackImg;

                    return (
                      <div 
                        key={cartItem.id}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 group"
                      >
                        {/* Food Image Thumbnail */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-250/70 shrink-0 shadow-2xs">
                          <img
                            src={imageSrc}
                            alt={cartItem.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackImg;
                            }}
                          />
                          <div className="absolute top-1 left-1 p-0.5 bg-white/95 rounded-xs shadow-2xs">
                            <DietaryBadge type={cartItem.product.dietary} size="sm" />
                          </div>
                        </div>

                        {/* Details (Name, Note, Price) */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                          <div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-[#151515] leading-snug line-clamp-2">
                              {cartItem.product.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-semibold text-gray-500">
                                ₹{cartItem.unitPrice} each
                              </span>
                            </div>
                          </div>

                          {cartItem.notes && (
                            <span className="text-[10px] text-gray-500 italic mt-1 line-clamp-1">
                              Note: "{cartItem.notes}"
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls & Line Total */}
                        <div className="flex flex-col items-end justify-between shrink-0 gap-2">
                          <span className="text-xs sm:text-sm font-black text-[#151515]">
                            ₹{cartItem.totalPrice}
                          </span>

                          {/* Quantity Stepper */}
                          <div className="inline-flex items-center bg-gray-100 rounded-xl p-0.5 border border-gray-200/80">
                            <button
                              onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white hover:bg-gray-50 active:scale-90 transition flex items-center justify-center text-[#151515] shadow-2xs cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              {cartItem.quantity === 1 ? (
                                <Trash2 className="w-3 h-3 text-rose-600" />
                              ) : (
                                <Minus className="w-3 h-3 stroke-[2.5]" />
                              )}
                            </button>
                            <span className="w-7 text-center text-xs font-black text-[#151515]">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                              disabled={cartItem.quantity >= 10}
                              className="w-7 h-7 rounded-lg bg-white hover:bg-gray-50 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center text-[#151515] shadow-2xs cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vendor Subtotal Footer */}
                <div className="px-4 py-2.5 bg-gray-50/70 border-t border-gray-150 flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>{group.vendorName} Subtotal</span>
                  <span className="font-black text-[#151515]">₹{group.subtotal}</span>
                </div>
              </section>
            ))}
          </div>

          {/* Bill Summary Card */}
          <section className="p-4 rounded-2xl bg-white border border-gray-150 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-150 text-xs font-black text-[#151515]">
              <ReceiptText className="w-4 h-4 text-[#FF6B00]" />
              <span>Payment Breakdown</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Items Total ({items.length} items)</span>
              <span className="font-bold text-[#151515]">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Campus Pickup Service</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>

            <div className="pt-2 border-t border-gray-150 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#151515]">
                  Combined Grand Total
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {vendorGroups.length > 1 ? '1 Single payment for all counters' : 'All taxes & counter fees included'}
                </span>
              </div>
              <span className="text-lg font-black text-[#151515]">
                ₹{grandTotal}
              </span>
            </div>
          </section>

          {/* Continue Shopping Button */}
          <div className="flex justify-center pt-1">
            <button
              onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
              className="text-xs font-bold text-[#FF6B00] hover:text-orange-700 active:scale-95 transition flex items-center gap-1"
            >
              <span>+ Add More Campus Specials</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. STICKY BOTTOM ACTION BAR */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3.5 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-40 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
              To Pay
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight mt-0.5">
              ₹{grandTotal}
            </span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={hasUnavailableItems}
            className="flex-1 max-w-[240px] py-3.5 px-5 rounded-2xl bg-[#FF6B00] hover:bg-orange-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
}
