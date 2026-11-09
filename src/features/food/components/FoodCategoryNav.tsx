'use client';

import React from 'react';
import { 
  LayoutGrid, 
  Utensils, 
  Soup, 
  Flame, 
  CookingPot, 
  Egg, 
  UtensilsCrossed, 
  Pizza, 
  Drumstick, 
  Sandwich, 
  Coffee,
  LucideIcon
} from 'lucide-react';
import { FOOD_CATEGORIES } from '../config/categories';

interface FoodCategoryNavProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  Utensils,
  Soup,
  Flame,
  CookingPot,
  Egg,
  UtensilsCrossed,
  Pizza,
  Drumstick,
  Sandwich,
  Coffee,
};

export const FoodCategoryNav: React.FC<FoodCategoryNavProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <nav className="w-full select-none" aria-label="Food Categories">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 scroll-smooth">
        {FOOD_CATEGORIES.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const IconComponent = (category.iconName && ICON_MAP[category.iconName]) || LayoutGrid;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-[#151515] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200/90 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <IconComponent 
                className={`w-3.5 h-3.5 stroke-[2.2] ${
                  isSelected ? 'text-[#FF6B00]' : 'text-gray-500'
                }`} 
              />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

