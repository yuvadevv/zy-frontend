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
  ReceiptText
} from 'lucide-react';
import { useFoodCart } from '@/features/food/store/useFoodCart';
import { DietaryBadge } from '@/features/food/components/DietaryBadge';
import { FoodVendorConflictModal } from '@/features/food/components/FoodVendorConflictModal';
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
    vendorName,
    counterLocation,
    vendorId,
  } = useFoodCart();

  const subtotal = getSubtotal();
  const grandTotal = getGrandTotal();

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
              {items.length} {items.length === 1 ? 'item' : 'items'} in cart
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
          {/* Vendor & Counter Context Card */}
          <section className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-2xs shrink-0">
                  <Store className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-xs font-black text-[#151515] truncate">
                    {vendorName || 'Campus Counter'}
                  </span>
                  <span className="text-[10.5px] font-bold text-gray-600 truncate">
                    {counterLocation || 'Main Canteen Counter'}
                  </span>
                </div>
              </div>

              <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#FF6B00] border border-orange-300 shadow-2xs shrink-0">
                Single Counter
              </span>
            </div>

            <div className="pt-2 border-t border-orange-200/60 flex items-center gap-1.5 text-[10.5px] text-gray-600 font-medium">
              <Info className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span>Direct pickup token generated upon order placement. No delivery charges.</span>
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

          {/* Cart Items List */}
          <section className="flex flex-col rounded-2xl bg-white border border-gray-150 overflow-hidden shadow-2xs divide-y divide-gray-100">
            <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-150 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-600">
                Selected Dishes
              </span>
              <span className="text-[11px] font-bold text-gray-500">
                {items.length} {items.length === 1 ? 'Dish' : 'Dishes'}
              </span>
            </div>

            {validatedItems.map((cartItem) => (
              <div 
                key={cartItem.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 group"
              >
                {/* Food Image Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-250/70 shrink-0 shadow-2xs">
                  <img
                    src={
                      cartItem.product.image && typeof cartItem.product.image === 'string' && cartItem.product.image.trim().length > 0
                        ? cartItem.product.image.trim()
                        : getProductFallbackImage(cartItem.product.id, cartItem.product.categoryId)
                    }
                    alt={cartItem.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getProductFallbackImage(cartItem.product.id, cartItem.product.categoryId);
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
                      {!cartItem.isAvailable && (
                        <span className="text-[9.5px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          Sold Out
                        </span>
                      )}
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
                      className="w-7 h-7 rounded-lg bg-white hover:bg-gray-50 active:scale-90 transition flex items-center justify-center text-[#151515] shadow-2xs cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Add More Items Button */}
          <button
            onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
            className="w-full py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-[#FF6B00] text-gray-600 hover:text-[#FF6B00] text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More Items From Menu</span>
          </button>

          {/* 3. BILL SUMMARY */}
          <section className="p-4 rounded-2xl bg-white border border-gray-150 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <ReceiptText className="w-4 h-4 text-[#FF6B00]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#151515]">
                Bill Summary
              </h3>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Item Subtotal</span>
              <span className="font-bold text-gray-900">₹{subtotal}</span>
            </div>

            {/* Counter Pickup (Transparent - no fake delivery fees) */}
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Counter Pickup Fee</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>

            {/* Final Payable Total */}
            <div className="pt-2.5 border-t border-gray-150 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#151515]">
                  To Pay
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Inclusive of all counter prices
                </span>
              </div>
              <span className="text-lg font-black text-[#FF6B00]">
                ₹{grandTotal}
              </span>
            </div>
          </section>

          {/* Counter Switch Notice */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 text-[11px] text-gray-500 leading-relaxed font-medium">
            <strong className="text-gray-800 font-bold block mb-0.5">
              Pickup Instructions:
            </strong>
            Orders are routed directly to <span className="font-bold text-gray-800">{counterLocation}</span>. After placing the order, show your digital token number on screen to collect your hot food.
          </div>
        </div>
      )}

      {/* 4. STICKY BOTTOM CHECKOUT ACTION BAR */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3.5 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-40 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
              Final Total
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight mt-0.5">
              ₹{grandTotal}
            </span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={hasUnavailableItems}
            className={`flex-1 py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98 ${
              hasUnavailableItems
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-[#FF6B00] hover:bg-orange-600 text-white shadow-orange-500/30'
            }`}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Multi-Vendor Conflict Modal */}
      <FoodVendorConflictModal />
    </div>
  );
}

