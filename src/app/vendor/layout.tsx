import VendorLayout from '@/components/vendor/layout/VendorLayout';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <VendorLayout>{children}</VendorLayout>;
}
