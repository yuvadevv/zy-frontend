import VendorLayout from '@/components/vendor/layout/VendorLayout';
import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <VendorLayout>{children}</VendorLayout>;
}
