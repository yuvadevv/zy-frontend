"use client";
import React from 'react';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

import { Printer } from 'lucide-react';

export const WidgetEmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-6 px-4 bg-gray-50 border border-gray-100 rounded-[24px] text-center shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-3 text-orange-500">
      <Printer size={36} strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-4 px-4">{description}</p>
    {actionLabel && (
      <Button onClick={onAction} className="w-full max-w-[200px] h-[44px] rounded-[16px] text-[14px]">
        {actionLabel}
      </Button>
    )}
  </div>
);



