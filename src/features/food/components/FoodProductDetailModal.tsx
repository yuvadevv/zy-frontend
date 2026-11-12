'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Store, Clock, ShieldCheck } from 'lucide-react';
import { FoodProduct } from '../types';
import { DietaryBadge } from './DietaryBadge';
import { useFoodCart } from '../store/useFoodCart';
import { getProductFallbackImage } from '../config/sampleMenu';

interface FoodProductDetailModalProps {
  product: FoodProduct | null;
  onClose: () => void;
}

export const FoodProductDetailModal: React.FC<FoodProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const { addItem, getItemQuantity } = useFoodCart();
  const [quantity, setQuantity] = useState(1);
  const [cookingNotes, setCookingNotes] = useState('');

  if (!product) return null;

  const currentCartQty = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity, undefined, cookingNotes.trim() || undefined);
    onClose();
  };

  const isUnsplash = Boolean(product.image && typeof product.image === 'string' && product.image.includes('images.unsplash.com'));
  const imageSrc =
    !isUnsplash && product.image && typeof product.image === 'string' && product.image.trim().length > 0
      ? product.image.trim()
      : getProductFallbackImage(product.id, product.categoryId, product.name);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-[24px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:text-black shadow-md backdrop-blur-md active:scale-90 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Hero Image */}
          <div className="relative w-full h-52 sm:h-60 bg-gray-900 shrink-0">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getProductFallbackImage(product.id, product.categoryId, product.name);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Badges on image */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <DietaryBadge type={product.dietary} showLabel size="md" />
              </div>
              <span className="text-xl font-black drop-shadow-md">
                ₹{product.price}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10.5px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Store className="w-3 h-3 text-[#FF6B00]" />
                  <span>{product.counterLocation}</span>
                </span>
                <span className="text-[10px] font-semibold text-gray-400">
                  {product.vendorName}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-[#151515] leading-snug">
                {product.name}
              </h2>
              <p className="text-xs sm:text-[13px] text-gray-600 font-medium mt-1.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Kitchen Preparation & Pickup Note */}
            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100/90 flex items-start gap-2.5 text-xs text-gray-700">
              <Clock className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <strong className="text-[11.5px] font-bold text-gray-900">
                  Counter Pickup Direct
                </strong>
                <p className="text-[10.5px] text-gray-600 font-medium leading-relaxed">
                  Cooked hot on campus. Collect with your token at {product.counterLocation}.
                </p>
              </div>
            </div>

            {/* Cooking Notes / Special Requests */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-800">
                Special instructions (Optional)
              </label>
              <input
                type="text"
                value={cookingNotes}
                onChange={(e) => setCookingNotes(e.target.value)}
                placeholder="E.g. Extra spicy, less oil, cut into 4 pieces..."
                maxLength={80}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Bottom Footer Action */}
          <div className="p-4 bg-gray-50/90 border-t border-gray-150 flex items-center justify-between gap-3 shrink-0">
            {/* Quantity Stepper */}
            <div className="inline-flex items-center bg-white border border-gray-250 rounded-xl px-2 py-1 shadow-2xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="p-1.5 text-gray-700 hover:text-black disabled:opacity-30 active:scale-90 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="px-3 text-xs font-black text-[#151515] min-w-[28px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1.5 text-gray-700 hover:text-black active:scale-90 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 rounded-xl bg-[#FF6B00] hover:bg-orange-600 active:scale-[0.98] transition-all text-white font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-sm shadow-orange-500/25"
            >
              <span>{currentCartQty > 0 ? 'Add More' : 'Add to Food Cart'}</span>
              <span>₹{product.price * quantity}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

