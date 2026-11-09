'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { DietaryType } from '../types';

interface FoodSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDietary?: DietaryType | 'all';
  onDietaryChange?: (dietary: DietaryType | 'all') => void;
  resultCount?: number;
}

export const FoodSearchBar: React.FC<FoodSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDietary,
  onDietaryChange,
  resultCount,
}) => {
  return (
    <div className="w-full flex flex-col gap-2.5 select-none">
      {/* Premium Rounded Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-[#FF6B00] pointer-events-none stroke-[2.4]" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search meals, biryani, noodles, rolls, snacks..."
          className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-2xl bg-gray-100/90 hover:bg-gray-100 focus:bg-white text-xs sm:text-sm font-semibold text-[#151515] placeholder:text-gray-400 placeholder:font-medium border border-gray-200/60 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/15 focus:outline-none transition-all shadow-2xs"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/70 transition"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dietary Quick Filter Pills (Veg / Non-Veg / Egg) */}
      {onDietaryChange && selectedDietary && (
        <div className="flex items-center justify-between text-xs px-0.5">
          <div 
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar hide-scrollbar py-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => onDietaryChange('all')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                selectedDietary === 'all'
                  ? 'bg-[#151515] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70 border border-transparent'
              }`}
            >
              All Foods
            </button>

            <button
              onClick={() => onDietaryChange('veg')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                selectedDietary === 'veg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-emerald-300 hover:bg-emerald-50/60'
              }`}
            >
              {/* Veg FSSAI symbol */}
              <span className="w-2.5 h-2.5 rounded-sm border border-emerald-600 flex items-center justify-center p-[1px] bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </span>
              <span>Veg Only</span>
            </button>

            <button
              onClick={() => onDietaryChange('non-veg')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                selectedDietary === 'non-veg'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-rose-300 hover:bg-rose-50/60'
              }`}
            >
              {/* Non-Veg symbol */}
              <span className="w-2.5 h-2.5 rounded-sm border border-rose-600 flex items-center justify-center p-[1px] bg-white">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              </span>
              <span>Non-Veg</span>
            </button>

            <button
              onClick={() => onDietaryChange('egg')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                selectedDietary === 'egg'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-amber-300 hover:bg-amber-50/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Egg</span>
            </button>
          </div>

          {resultCount !== undefined && searchQuery && (
            <span className="text-[11px] font-medium text-gray-400 shrink-0 pl-2">
              {resultCount} {resultCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
