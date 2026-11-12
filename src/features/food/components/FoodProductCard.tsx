'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';
import { FoodProduct } from '../types';
import { DietaryBadge } from './DietaryBadge';
import { useFoodCart } from '../store/useFoodCart';
import { APP_ROUTES } from '@/constants/routes';
import { getProductFallbackImage } from '../config/sampleMenu';

interface FoodProductCardProps {
  product: FoodProduct;
  onOpenDetails?: (product: FoodProduct) => void;
}

export const FoodProductCard: React.FC<FoodProductCardProps> = ({
  product,
  onOpenDetails,
}) => {
  const router = useRouter();
  const { getItemQuantity, addItem, updateQuantity } = useFoodCart();
  const quantity = getItemQuantity(product.id);

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(product);
    } else {
      router.push(APP_ROUTES.FOOD.PRODUCT_DETAIL(product.id));
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  const [imgError, setImgError] = React.useState(false);

  // Short clean label for counter location
  const counterTag = product.vendorName === 'CHOPSTICKS' || product.counterLocation.includes('Chopsticks')
    ? 'CHOPSTICKS'
    : product.vendorName === 'RCE MESS' || product.counterLocation.includes('Mess')
    ? 'RCE MESS'
    : (product.vendorName || 'Counter');

  // Guaranteed valid food image URL (falls back to offline SVG vector illustration)
  const isUnsplash = Boolean(product.image && typeof product.image === 'string' && product.image.includes('images.unsplash.com'));
  const imageSrc =
    !imgError && !isUnsplash && product.image && typeof product.image === 'string' && product.image.trim().length > 0
      ? product.image.trim()
      : getProductFallbackImage(product.id, product.categoryId, product.name);

  return (
    <div
      onClick={handleCardClick}
      className="group relative w-full h-full bg-white rounded-2xl border border-gray-150/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-gray-250 transition-all flex flex-col overflow-hidden cursor-pointer select-none"
    >
      {/* 1. Food Image with Aspect Ratio & Badges */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Dietary Badge (Top-Left) */}
        <div className="absolute top-2 left-2 z-10 p-1 bg-white/95 backdrop-blur-xs rounded-md shadow-xs flex items-center justify-center">
          <DietaryBadge type={product.dietary} size="sm" />
        </div>

        {/* Counter Tag (Top-Right) */}
        <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 bg-black/65 backdrop-blur-xs rounded-md text-[9px] font-bold text-white tracking-wide shadow-xs truncate max-w-[85px]">
          {counterTag}
        </div>
      </div>

      {/* 2 & 3 & 4. Card Content: Name, Description, and Fixed Bottom Action Row */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div className="flex flex-col">
          {/* 2. Product Name (Strict maximum two lines, locked height for alignment) */}
          <div className="h-[2.25rem] sm:h-[2.5rem] flex items-start overflow-hidden">
            <h3 className="text-xs sm:text-[13px] font-extrabold text-[#151515] group-hover:text-[#FF6B00] transition-colors leading-[1.125rem] sm:leading-[1.25rem] line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* 3. Short Description (Strict maximum two lines, locked height for alignment) */}
          <div className="h-[1.75rem] sm:h-[2rem] flex items-start overflow-hidden mt-1">
            <p className="text-[10.5px] sm:text-[11px] text-gray-500 font-medium leading-[0.875rem] sm:leading-[1rem] line-clamp-2">
              {product.description || 'Freshly prepared at campus counter.'}
            </p>
          </div>
        </div>

        {/* 4. Action Row (Price & ADD button strictly pushed to bottom row) */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5">
          {/* Price */}
          <div className="flex items-baseline gap-1 min-w-0">
            <span className="text-xs sm:text-sm font-black text-[#151515] truncate">
              ₹{product.price}
            </span>
            {product.isMeal && (
              <span className="text-[9px] font-bold text-[#FF6B00] bg-orange-50 px-1 py-0.2 rounded border border-orange-200/60 hidden xs:inline">
                Meal
              </span>
            )}
          </div>

          {/* ADD Button / Quantity Stepper */}
          <div className="shrink-0">
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="px-3 py-1 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-lg text-[11px] font-black uppercase tracking-wider shadow-xs shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                aria-label={`Add ${product.name} to cart`}
              >
                <span>ADD</span>
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            ) : (
              <div className="inline-flex items-center bg-[#151515] text-white rounded-lg border border-zinc-700 shadow-2xs text-[11px] sm:text-xs font-bold px-1 py-0.5">
                <button
                  onClick={handleDecrement}
                  className="p-1 hover:text-[#FF6B00] active:scale-90 transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                </button>
                <span className="px-1.5 font-black text-xs min-w-[18px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-1 hover:text-[#FF6B00] active:scale-90 transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
