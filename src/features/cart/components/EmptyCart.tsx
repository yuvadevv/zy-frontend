"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/routes';
import { Button } from '@/design-system/components/buttons/Button/Button';

export const EmptyCart = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh] gap-4">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-foreground tracking-tight">Your cart is empty</h2>
      <p className="text-muted-foreground text-sm max-w-[250px] mb-4 leading-relaxed">
        Looks like you haven&apos;t added any prints to your cart yet.
      </p>
      <Button 
        onClick={() => router.push(APP_ROUTES.SERVICES.HUB)}
        className="px-8 bg-primary text-primary-foreground font-bold shadow-md hover:shadow-lg transition-all"
      >
        Browse Services
      </Button>
    </div>
  );
};
