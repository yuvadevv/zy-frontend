"use client";

import React from 'react';
import { CartProvider } from '@/features/cart/providers/CartProvider';
import { OrderProvider } from '@/features/orders/providers/OrderProvider';
import { NotificationProvider } from '@/features/notifications/providers/NotificationProvider';
import { ProfileProvider } from '@/features/profile/providers/ProfileProvider';
import { StudentProvider } from '@/features/student/providers/StudentProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StudentProvider>
      <ProfileProvider>
        <NotificationProvider>
          <CartProvider>
            <OrderProvider>
              {children}
            </OrderProvider>
          </CartProvider>
        </NotificationProvider>
      </ProfileProvider>
    </StudentProvider>
  );
}
