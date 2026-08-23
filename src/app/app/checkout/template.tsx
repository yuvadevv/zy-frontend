'use client';

import React from 'react';
import { PageTransition } from '@/design-system/components/layout/PageTransition';

export default function CheckoutTemplate({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition mode="slide">
      {children}
    </PageTransition>
  );
}
