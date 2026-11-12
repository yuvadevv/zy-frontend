'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FoodStudentHeader } from '@/features/food/components/FoodStudentHeader';
import { FoodSearchBar } from '@/features/food/components/FoodSearchBar';
import { FoodPromoBanner } from '@/features/food/components/FoodPromoBanner';
import { FoodCategoryTiles } from '@/features/food/components/FoodCategoryTiles';
import { FoodProductCard } from '@/features/food/components/FoodProductCard';
import { FoodProductDetailModal } from '@/features/food/components/FoodProductDetailModal';
import { FoodVendorConflictModal } from '@/features/food/components/FoodVendorConflictModal';
import { FoodFloatingCartBar } from '@/features/food/components/FoodFloatingCartBar';
import { FoodCartDrawer } from '@/features/food/components/FoodCartDrawer';
import { FoodOrderSuccessModal } from '@/features/food/components/FoodOrderSuccessModal';
import { SAMPLE_FOOD_MENU, getProductFallbackImage } from '@/features/food/config/sampleMenu';
import { FOOD_CATEGORIES } from '@/features/food/config/categories';
import { FoodProduct, DietaryType } from '@/features/food/types';
import { APP_ROUTES } from '@/constants/routes';
import { workerClient } from '@/lib/api/workerClient';
import { 
  Flame, 
  Clock, 
  Coffee, 
  SearchX, 
  RotateCcw, 
  Store,
  ArrowRight,
  Sparkles,
  Utensils
} from 'lucide-react';

export default function UnifiedCampusFoodPage() {
  const router = useRouter();

  // Search & Filter State
  const [products, setProducts] = useState<FoodProduct[]>(SAMPLE_FOOD_MENU);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType | 'all'>('all');
  const [showAllPopular, setShowAllPopular] = useState(false);

  // Fetch dynamic food catalogue from Cloudflare D1 backend
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveProducts() {
      try {
        setIsLoading(true);
        const res = await workerClient.getFoodProducts();
        if (res?.success && Array.isArray(res?.data?.products) && res.data.products.length > 0) {
          if (isMounted) {
            setProducts(res.data.products.map((p: any) => {
              const fallback = getProductFallbackImage(p.id, p.categoryId, p.name);
              const isBlockedCdn = p.image && typeof p.image === 'string' && p.image.includes('images.unsplash.com');
              const finalImage = (!p.image || isBlockedCdn) ? fallback : p.image.trim();
              return {
                ...p,
                image: finalImage,
                description: (p.description && typeof p.description === 'string' && p.description.trim().length > 0) ? p.description.trim() : 'Freshly prepared at campus counter.',
                isPopular: p.isPopular ?? (p.categoryId === 'breakfast' || p.categoryId === 'fast-food' || p.price > 80),
                isMeal: p.isMeal ?? (p.categoryId === 'meals' || p.categoryId === 'veg-meals')
              };
            }));
          }
        }
      } catch (err) {
        console.warn('Using offline food catalog fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchLiveProducts();
    return () => { isMounted = false; };
  }, []);

  // Modal State
  const [selectedProductForModal, setSelectedProductForModal] = useState<FoodProduct | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleOpenDetails = (product: FoodProduct) => {
    router.push(APP_ROUTES.FOOD.PRODUCT_DETAIL(product.id));
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Dietary filter
      if (selectedDietary !== 'all' && product.dietary !== selectedDietary) {
        return false;
      }

      // 2. Category filter
      if (selectedCategoryId !== 'all') {
        // Match exact category or mapped category
        if (selectedCategoryId === 'meals' && (product.categoryId === 'meals' || product.categoryId === 'veg-meals')) {
          // match
        } else if (selectedCategoryId === 'fast-food' && (product.categoryId === 'fast-food' || product.categoryId === 'chicken-fast-food')) {
          // match
        } else if (selectedCategoryId === 'snacks' && (product.categoryId === 'snacks' || product.categoryId === 'snacks-beverages')) {
          // match
        } else if (product.categoryId !== selectedCategoryId) {
          return false;
        }
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.categoryId.toLowerCase().includes(query);
        const matchesVendor = product.counterLocation.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesVendor) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, selectedCategoryId, selectedDietary]);

  // Check if student is browsing the default curated feed
  const isBrowsingAll = selectedCategoryId === 'all' && !searchQuery.trim() && selectedDietary === 'all';

  // Curated section groupings matching specific campus discovery sections
  const popularItems = useMemo(() => {
    return products.filter((p) => p.isPopular);
  }, [products]);

  const displayedPopular = showAllPopular ? popularItems : popularItems.slice(0, 4);

  // 1. Today's Meals
  const todaysMeals = useMemo(() => {
    return products.filter((p) => p.categoryId === 'meals' || p.isMeal);
  }, [products]);

  // 2. Veg Curries
  const vegCurries = useMemo(() => {
    return products.filter((p) => p.categoryId === 'veg-curries');
  }, [products]);

  // 3. Chicken Specials
  const chickenSpecials = useMemo(() => {
    return products.filter((p) => p.categoryId === 'chicken-curries');
  }, [products]);

  // 4. Fried Rice & Noodles
  const friedRiceAndNoodles = useMemo(() => {
    return products.filter((p) => ['fried-rice', 'noodles', 'egg-items'].includes(p.categoryId));
  }, [products]);

  // 5. Pizza & Fast Food
  const pizzaAndFastFood = useMemo(() => {
    return products.filter((p) => ['pizza', 'fast-food'].includes(p.categoryId));
  }, [products]);

  // 6. Rolls & Quick Bites
  const rollsAndQuickBites = useMemo(() => {
    return products.filter((p) => ['chicken-rolls', 'breakfast'].includes(p.categoryId));
  }, [products]);

  // 7. Snacks & Beverages
  const snacksAndBeverages = useMemo(() => {
    return products.filter((p) => ['snacks', 'snacks-beverages'].includes(p.categoryId));
  }, [products]);

  const selectedCategoryLabel = useMemo(() => {
    const found = FOOD_CATEGORIES.find((c) => c.id === selectedCategoryId);
    return found ? found.label : selectedCategoryId.replace('-', ' ');
  }, [selectedCategoryId]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    setSelectedDietary('all');
  };

  return (
    <div className="w-full flex flex-col gap-3.5 sm:gap-4 pb-24 select-none">
      {/* ======================================================== */}
      {/* 1. STUDENT HEADER — PERSONALIZED                         */}
      {/* ======================================================== */}
      <FoodStudentHeader />

      {/* ======================================================== */}
      {/* 2. SEARCH BAR                                            */}
      {/* ======================================================== */}
      <FoodSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDietary={selectedDietary}
        onDietaryChange={setSelectedDietary}
        resultCount={filteredProducts.length}
      />

      {/* ======================================================== */}
      {/* 3. PROMOTIONAL BANNER (Compact, shown on default view)   */}
      {/* ======================================================== */}
      {isBrowsingAll && <FoodPromoBanner />}

      {/* ======================================================== */}
      {/* 4. FOOD CATEGORIES                                       */}
      {/* ======================================================== */}
      <FoodCategoryTiles
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* ======================================================== */}
      {/* 5. FEED CONTENT: POPULAR ON CAMPUS OR FILTERED RESULTS    */}
      {/* ======================================================== */}
      {isBrowsingAll ? (
        // DEFAULT CURATED FEED
        <div className="flex flex-col gap-6 pt-1">
          {/* Section: 🔥 Popular on Campus */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🔥</span>
                <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                  Popular on Campus
                </h2>
              </div>
              <button
                onClick={() => setShowAllPopular((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] font-black text-[#FF6B00] hover:text-orange-700 active:scale-95 transition"
              >
                <span>{showAllPopular ? 'Show Less' : 'View All'}</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {displayedPopular.map((product) => (
                <FoodProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={handleOpenDetails}
                />
              ))}
            </div>
          </section>

          {/* Section 1: Today's Meals */}
          {todaysMeals.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 stroke-[2.4]" />
                  <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                    Today's Meals
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Mess & Canteen
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {todaysMeals.map((product) => (
                  <FoodProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Veg Curries */}
          {vegCurries.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 stroke-[2.4]" />
                  <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                    Veg Curries
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Pure Veg Special
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {vegCurries.map((product) => (
                  <FoodProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Chicken Specials */}
          {chickenSpecials.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600 stroke-[2.4]" />
                  <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                    Chicken Specials
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Hot & Spicy
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {chickenSpecials.map((product) => (
                  <FoodProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 4: Fried Rice & Noodles */}
          {friedRiceAndNoodles.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 stroke-[2.4]" />
                  <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                    Fried Rice & Noodles
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  Wok Tossed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {friedRiceAndNoodles.map((product) => (
                  <FoodProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 5: Pizza & Fast Food */}
          {pizzaAndFastFood.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 stroke-[2.4]" />
                  <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                    Pizza & Fast Food
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Crispy & Fresh
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {pizzaAndFastFood.map((product) => (
                  <FoodProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 6: Rolls & Quick Bites */}
          {rollsAndQuickBites.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#FF6B00] stroke-[2.4]" />
                  <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                    Rolls & Quick Bites
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  Campus Favourites
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {rollsAndQuickBites.map((product) => (
                  <FoodProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 7: Snacks & Beverages */}
          {snacksAndBeverages.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-amber-600 stroke-[2.4]" />
                  <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                    Snacks & Beverages
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Between Lectures
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {snacksAndBeverages.map((product) => (
                  <FoodProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        // FILTERED LIST OR SEARCH RESULTS
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#151515] tracking-tight">
                {searchQuery
                  ? `Search: "${searchQuery}"`
                  : `Category: ${selectedCategoryLabel}`}
              </h2>
              <span className="text-[11px] font-semibold text-gray-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item available' : 'items available'}
              </span>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-[#FF6B00] hover:underline"
            >
              Show All Foods
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            // Clean empty search state
            <div className="w-full rounded-2xl bg-white border border-gray-150 p-8 flex flex-col items-center justify-center text-center gap-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <SearchX className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  No matching food items found
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1 max-w-xs leading-relaxed">
                  Try searching with a different keyword or reset your dietary and category filters.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {filteredProducts.map((product) => (
                <FoodProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={handleOpenDetails}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Campus Service Info Footer Pill */}
      <section className="mt-2 p-3.5 rounded-2xl bg-gray-50 border border-gray-150 flex items-start gap-3 text-xs text-gray-600">
        <Store className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <strong className="text-gray-900 font-bold">
            Counter Pickup at Campus Kitchens
          </strong>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Food orders are prepared fresh at the canteen and dining hall counters. Orders are routed directly to the designated counter for instant token collection.
          </p>
        </div>
      </section>

      {/* Floating Bottom Cart Bar */}
      <FoodFloatingCartBar />

      {/* Product Detail Modal */}
      <FoodProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      {/* Multi-Vendor Conflict Modal */}
      <FoodVendorConflictModal />

      {/* Food Cart Drawer */}
      <FoodCartDrawer
        onOrderPlaced={() => setIsSuccessModalOpen(true)}
      />

      {/* Order Confirmation / Success Modal */}
      <FoodOrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
