'use client';

import React from 'react';
import { DietaryType } from '../types';

interface DietaryBadgeProps {
  type: DietaryType;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, showLabel = false, size = 'md' }) => {
  const isVeg = type === 'veg';
  const isEgg = type === 'egg';
  const isNonVeg = type === 'non-veg';

  const boxSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  const borderColor = isVeg
    ? 'border-emerald-600'
    : isEgg
    ? 'border-amber-600'
    : 'border-rose-600';

  const dotColor = isVeg
    ? 'bg-emerald-600'
    : isEgg
    ? 'bg-amber-600'
    : 'bg-rose-600';

  const labelText = isVeg ? 'Pure Veg' : isEgg ? 'Egg' : 'Non-Veg';
  const labelColor = isVeg ? 'text-emerald-700' : isEgg ? 'text-amber-700' : 'text-rose-700';

  return (
    <div className="inline-flex items-center gap-1.5 shrink-0" title={labelText}>
      <div className={`${boxSize} rounded-[3px] border-[1.5px] ${borderColor} flex items-center justify-center bg-white p-[1.5px]`}>
        <div className={`${dotSize} rounded-full ${dotColor}`} />
      </div>
      {showLabel && (
        <span className={`text-[10px] font-bold ${labelColor}`}>
          {labelText}
        </span>
      )}
    </div>
  );
};

