// src/features/checkout/components/DeliveryLocationSelector.tsx
"use client";
import React from 'react';
import { DeliveryDetails } from '../types';
import { MOCK_DELIVERY_MODES } from '../services/mockCheckout';

interface DeliveryLocationSelectorProps {
  onSelect: (details: DeliveryDetails) => void;
  selectedId?: string;
}

export const DeliveryLocationSelector = ({ onSelect, selectedId }: DeliveryLocationSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      {MOCK_DELIVERY_MODES.map((mode) => (
        <button
          key={mode.locationId}
          onClick={() => onSelect(mode)}
          className={`flex items-start text-left p-4 rounded-xl border ${
            selectedId === mode.locationId 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'border-border bg-card hover:bg-muted/30'
          } transition-colors`}
        >
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">{mode.locationName}</h3>
            <p className="text-muted-foreground text-xs mt-1">Est. {mode.estimatedTime}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
            selectedId === mode.locationId ? 'border-primary' : 'border-muted-foreground/30'
          }`}>
            {selectedId === mode.locationId && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </div>
        </button>
      ))}
    </div>
  );
};
