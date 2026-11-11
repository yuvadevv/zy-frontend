'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Heart, 
  ShoppingBag, 
  Store, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getFoodProductById, getProductFallbackImage } from '@/features/food/config/sampleMenu';
import { DietaryBadge } from '@/features/food/components/DietaryBadge';
import { useFoodCart } from '@/features/food/store/useFoodCart';
import { FoodVendorConflictModal } from '@/features/food/components/FoodVendorConflictModal';
import { FoodCartDrawer } from '@/features/food/components/FoodCartDrawer';
import { FoodOrderSuccessModal } from '@/features/food/components/FoodOrderSuccessModal';
import { APP_ROUTES } from '@/constants/routes';
import { workerClient } from '@/lib/api/workerClient';
import { FoodProduct } from '@/features/food/types';

export default function FoodProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id as string) || '';

  // Retrieve initial product from sample or cache
  const initialProduct = useMemo(() => {
    return getFoodProductById(productId);
  }, [productId]);

  const [product, setProduct] = useState<FoodProduct | null>(initialProduct || null);
  const [isLoading, setIsLoading] = useState(!initialProduct);

  // Revalidate with live Cloudflare D1 product data
  useEffect(() => {
    let isMounted = true;
    async function loadLiveDetail() {
      if (!productId) return;
      try {
        const res = await workerClient.getFoodProductById(productId);
        if (res?.success && res?.data?.product && isMounted) {
          const liveProd = res.data.product;
          const fallback = getProductFallbackImage(liveProd.id, liveProd.categoryId);
          setProduct({
            ...liveProd,
            image: (liveProd.image && typeof liveProd.image === 'string' && liveProd.image.trim()) ? liveProd.image.trim() : fallback,
            description: (liveProd.description && typeof liveProd.description === 'string' && liveProd.description.trim()) ? liveProd.description.trim() : 'Freshly prepared at campus counter.'
          });
        }
      } catch (err) {
        console.warn('Using offline product details fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadLiveDetail();
    return () => { isMounted = false; };
  }, [productId]);

  // Cart store
  const { 
    addItem, 
    updateQuantity,
    getItemQuantity, 
    getTotalCount, 
    openCartDrawer 
  } = useFoodCart();

  // Local interaction state
  const [quantity, setQuantity] = useState(1);
  const [cookingNotes, setCookingNotes] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Check if item is already in cart
  const existingCartQty = product ? getItemQuantity(product.id) : 0;
  const totalCartCount = getTotalCount();

  // Load favorite state from localStorage
  useEffect(() => {
    if (productId && typeof window !== 'undefined') {
      try {
        const favs = JSON.parse(localStorage.getItem('bl_food_favorites') || '[]');
        setIsFavorited(favs.includes(productId));
      } catch {}
    }
  }, [productId]);

  const toggleFavorite = () => {
    if (!productId || typeof window !== 'undefined') {
      setIsFavorited((prev) => {
        const next = !prev;
        try {
          const favs = JSON.parse(localStorage.getItem('bl_food_favorites') || '[]');
          const updated = next 
            ? [...favs, productId]
            : favs.filter((id: string) => id !== productId);
          localStorage.setItem('bl_food_favorites', JSON.stringify(updated));
        } catch {}
        return next;
      });
    }
  };

  // Quantity controls
  const handleIncrement = () => {
    setQuantity((q) => Math.min(10, q + 1));
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!product || !product.isAvailable) return;

    addItem(product, quantity, undefined, cookingNotes.trim() || undefined);

    // Trigger visual added state
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  // Handle product not found (404 state)
  if (!product) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center p-6 select-none">
        <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6B00] mb-4">
          <AlertCircle className="w-8 h-8 stroke-[2]" />
        </div>
        <h1 className="text-lg font-black text-[#151515] tracking-tight">
          Food Item Not Found
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-1.5 max-w-xs leading-relaxed">
          The dish you are looking for may have been updated or is currently not available on the campus menu.
        </p>
        <button
          onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
          className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#151515] hover:bg-black text-white text-xs font-black shadow-sm active:scale-95 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Campus Food</span>
        </button>
      </div>
    );
  }

  const calculatedTotal = product.price * quantity;

  const imageSrc =
    product.image && typeof product.image === 'string' && product.image.trim().length > 0
      ? product.image.trim()
      : getProductFallbackImage(product.id, product.categoryId);

  return (
    <div className="w-full flex flex-col pb-32 select-none relative">
      {/* ======================================================== */}
      {/* 1. LARGE EDGE-TO-EDGE FOOD PHOTOGRAPH WITH ROUNDED CORNERS */}
      {/* ======================================================== */}
      <div className="relative w-[calc(100%+28px)] -mx-3.5 -mt-2 aspect-[4/3] sm:aspect-[16/10] max-h-[340px] bg-zinc-900 rounded-b-[32px] overflow-hidden shadow-md">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getProductFallbackImage(product.id, product.categoryId);
          }}
        />

        {/* Top Scrim Gradient for floating buttons */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

        {/* 2. Floating Top Header Actions (Back, Favourite, Cart) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
          {/* Back button */}
          <button
            onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#151515] backdrop-blur-md shadow-md active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Back to Campus Food"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Action Group (Favorite + Cart) */}
          <div className="flex items-center gap-2">
            {/* Favourite Action */}
            <button
              onClick={toggleFavorite}
              className={`w-10 h-10 rounded-full backdrop-blur-md shadow-md active:scale-95 transition-all flex items-center justify-center cursor-pointer ${
                isFavorited 
                  ? 'bg-rose-50 text-rose-500' 
                  : 'bg-white/90 hover:bg-white text-gray-700 hover:text-rose-500'
              }`}
              aria-label={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Heart 
                className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 stroke-rose-500' : 'stroke-[2.2]'}`} 
              />
            </button>

            {/* Food Cart Icon */}
            <button
              onClick={() => router.push(APP_ROUTES.FOOD.CART)}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 backdrop-blur-md shadow-md active:scale-95 transition-all flex items-center justify-center relative cursor-pointer"
              aria-label="View Food Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center shadow-xs ring-2 ring-white">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dietary Badge & Counter Location Badge on bottom of image */}
        <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white z-10">
          <DietaryBadge type={product.dietary} showLabel size="md" />

          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white tracking-wide border border-white/20">
            {product.counterLocation}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. PRODUCT INFORMATION CARD                              */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-4 mt-3 px-0.5">
        {/* Title, Badges & Price Row */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex flex-col min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Short product description */}
            <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-1 leading-relaxed">
              {product.description || 'Freshly prepared at the campus counter with authentic ingredients.'}
            </p>
          </div>

          {/* Database Price */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-2xl sm:text-3xl font-black text-[#151515] tracking-tight">
              ₹{product.price}
            </span>
            {product.isMeal && (
              <span className="text-[9.5px] font-black uppercase text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60 mt-0.5">
                Meal Plate
              </span>
            )}
          </div>
        </div>

        {/* 4. Availability Status Banner */}
        {!product.isAvailable && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>This item is currently sold out. Next batch will be prepared tomorrow.</span>
          </div>
        )}

        {/* 5. Vendor & Counter Information */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#FF6B00] shrink-0">
                <Store className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-black text-[#151515]">
                  {product.vendorName}
                </span>
                <span className="text-[10.5px] font-semibold text-gray-500">
                  {product.counterLocation}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Counter Active</span>
            </span>
          </div>

          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500 font-medium">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>~10-15 mins pickup</span>
            </div>
            <div className="flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Counter Collection</span>
            </div>
          </div>
        </div>

        {/* 6. Quantity Selector */}
        {product.isAvailable && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#151515]">
                Select Quantity
              </span>
              <span className="text-[10.5px] text-gray-400 font-medium">
                ₹{product.price} per item
              </span>
            </div>

            <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200/70">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-[#151515] transition flex items-center justify-center shadow-2xs cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-10 text-center text-sm font-black text-[#151515]">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= 10}
                className="w-8 h-8 rounded-lg bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-[#151515] transition flex items-center justify-center shadow-2xs cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* 7. Special Cooking Instructions */}
        {product.isAvailable && (
          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="special-instructions" 
              className="text-xs font-black text-[#151515] flex items-center justify-between"
            >
              <span>Special Cooking Instructions</span>
              <span className="text-[10.5px] font-normal text-gray-400">Optional</span>
            </label>
            <input
              id="special-instructions"
              type="text"
              value={cookingNotes}
              onChange={(e) => setCookingNotes(e.target.value)}
              placeholder="E.g. Extra spicy, less oil, cut into 4 pieces, no onions..."
              maxLength={80}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-[#151515] placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/15 focus:bg-white transition-all shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 8. STICKY BOTTOM ACTION BAR (Part 7 Consistent Design)   */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3.5 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-40 flex items-center justify-between gap-3">
        {!product.isAvailable ? (
          <button
            disabled
            className="w-full py-3.5 px-5 rounded-2xl bg-gray-200 text-gray-400 font-bold text-xs sm:text-sm cursor-not-allowed text-center"
          >
            Currently Sold Out
          </button>
        ) : existingCartQty === 0 ? (
          // IF NOT IN CART: Show Price + Add to Cart Button
          <>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                Price
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight mt-0.5">
                ₹{calculatedTotal}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 max-w-[240px] py-3.5 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98 ${
                addedAnimation 
                  ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                  : 'bg-[#FF6B00] hover:bg-orange-600 text-white shadow-orange-500/30'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <span>Add to Food Cart</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </>
        ) : (
          // IF ALREADY IN CART: Quantity Stepper + View Cart
          <>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                <button
                  onClick={() => updateQuantity(product.id, existingCartQty - 1)}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-gray-50 active:scale-95 text-[#151515] flex items-center justify-center shadow-2xs cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-9 text-center text-xs font-black text-[#151515]">
                  {existingCartQty} in cart
                </span>
                <button
                  onClick={() => updateQuantity(product.id, Math.min(10, existingCartQty + 1))}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-gray-50 active:scale-95 text-[#151515] flex items-center justify-center shadow-2xs cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <button
              onClick={() => router.push(APP_ROUTES.FOOD.CART)}
              className="flex-1 max-w-[190px] py-3.5 px-4 rounded-2xl bg-[#151515] hover:bg-black active:scale-98 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2] text-[#FF6B00]" />
              <span>View Cart</span>
            </button>
          </>
        )}
      </div>

      {/* Food Cart Drawer */}
      <FoodCartDrawer
        onOrderPlaced={() => setIsSuccessModalOpen(true)}
      />

      {/* Order Confirmation Success Modal */}
      <FoodOrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}

