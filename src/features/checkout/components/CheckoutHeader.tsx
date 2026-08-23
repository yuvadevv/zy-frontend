// src/features/checkout/components/CheckoutHeader.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export const CheckoutHeader = () => {
  const router = useRouter();
  
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center">
      <button 
        onClick={() => router.back()} 
        className="mr-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-bold text-foreground">Secure Checkout</h1>
    </header>
  );
};
