'use client';

import React from 'react';
import { FOOD_CATEGORIES } from '../config/categories';
import { getFoodIllustrationDataUri } from '../utils/foodIllustrations';
import { Sparkles } from 'lucide-react';

interface FoodCategoryTilesProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const FoodCategoryTiles: React.FC<FoodCategoryTilesProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const handleTileClick = (categoryId: string) => {
    // If student clicks active category, toggle back to 'all'
    if (selectedCategoryId === categoryId && categoryId !== 'all') {
      onSelectCategory('all');
    } else {
      onSelectCategory(categoryId);
    }
  };

  return (
    <section className="w-full select-none" aria-label="Explore Categories">
      {/* Category Section Header */}
      <div className="flex items-center justify-between px-0.5 mb-2.5">
        <div>
          <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
            <span>Explore Categories</span>
          </h3>
          <p className="text-[10.5px] font-medium text-gray-400 mt-0.5">
            What are you craving today?
          </p>
        </div>

        {selectedCategoryId !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-[11px] font-black text-[#FF6B00] hover:text-orange-700 active:scale-95 transition bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60"
          >
            Reset to All ✕
          </button>
        )}
      </div>

      {/* Horizontal Swipe Scrollable Tiles Strip (100% Scrollbar Free in All Browsers) */}
      <div 
        className="category-scroll-rail flex items-start gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar hide-scrollbar scroll-smooth py-1.5 px-0.5 [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:!w-0 [&::-webkit-scrollbar]:!h-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        data-no-scrollbar
      >
        {FOOD_CATEGORIES.map((category) => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleTileClick(category.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none cursor-pointer active:scale-95 transition-all"
              style={{ width: 76 }}
              aria-pressed={isSelected}
            >
              {/* Circular Food Image Container */}
              <div
                className={`relative w-[64px] h-[64px] sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden p-[2px] transition-all duration-200 ${
                  isSelected
                    ? 'ring-[2.5px] ring-[#FF6B00] ring-offset-2 ring-offset-white shadow-md scale-105'
                    : 'border border-gray-200 bg-gray-50/80 shadow-2xs hover:border-gray-300 hover:shadow-xs group-hover:scale-102'
                }`}
              >
                <img
                  src={category.image && category.image.trim().length > 0 ? category.image.trim() : getFoodIllustrationDataUri(category.id, category.label)}
                  alt={category.label}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFoodIllustrationDataUri(category.id, category.label);
                  }}
                />

                {/* Active indicator dot badge */}
                {isSelected && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#FF6B00] border-2 border-white rounded-full shadow-xs" />
                )}
              </div>

              {/* Category Name Directly Below Image */}
              <span
                className={`text-[11px] leading-[1.125rem] text-center line-clamp-2 max-w-[74px] transition-colors ${
                  isSelected
                    ? 'font-black text-[#FF6B00]'
                    : 'font-bold text-gray-700 group-hover:text-black'
                }`}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scoped CSS reset to guarantee scrollbar is hidden on all browsers */}
      <style dangerouslySetInnerHTML={{ __html: `
        .category-scroll-rail::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          -webkit-appearance: none !important;
          background: transparent !important;
        }
      `}} />
    </section>
  );
};
