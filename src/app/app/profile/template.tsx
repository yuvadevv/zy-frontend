'use client';

import React from 'react';
import { PageTransition } from '@/design-system/components/layout/PageTransition';

export default function ProfileTemplate({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition mode="slide">
      {children}
    </PageTransition>
  );
}
