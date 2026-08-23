"use client";

import { usePathname } from 'next/navigation';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === '/app/onboarding';

  const getPageTitle = (path: string) => {
    if (path.includes('/home')) return 'Home';
    if (path.includes('/orders')) return 'Orders';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/manuals')) return 'Manuals';
    if (path.includes('/hall-tickets')) return 'Hall Tickets';
    if (path.includes('/upload')) return 'Custom Upload';
    if (path.includes('/bus-tracking')) return 'Bus Tracking';
    if (path.includes('/services')) return 'Services';
    if (path.includes('/cart')) return 'Shopping Cart';
    if (path.includes('/checkout')) return 'Secure Checkout';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/support')) return 'Support';
    return 'BLINTZY';
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[#FF6B00] shadow-2xl relative overflow-hidden">
      {!isOnboarding && <AppHeader title={pageTitle} />}
      {!isOnboarding ? (
        <main className="flex-1 w-full bg-white rounded-t-[44px] relative z-10 -mt-6 px-3 pt-6 pb-24">
          {children}
        </main>
      ) : (
        children
      )}
      {!isOnboarding && <BottomNavigation />}
    </div>
  );
}
