"use client";

import { usePathname } from 'next/navigation';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === '/app/onboarding';
  const isFoodRoute = pathname.startsWith('/app/campus-food');
  const isProductDetailPage = isFoodRoute && 
    pathname !== '/app/campus-food' &&
    pathname !== '/app/campus-food/stall' && 
    pathname !== '/app/campus-food/mess';

  const getPageTitle = (path: string) => {
    if (path.includes('/home')) return 'Home';
    if (path === '/app/campus-food/stall') return 'Private Food Stall';
    if (path === '/app/campus-food/mess') return 'College Mess';
    if (path.includes('/campus-food')) return 'Campus Food';
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
    if (path.includes('/offers')) return 'Offers & Discounts';
    if (path.includes('/campus-fest')) return 'Campus Fest';
    if (path.includes('/refer')) return 'Refer & Earn';
    if (path.includes('/leaderboard')) return 'Leaderboards';
    return 'BLINTZY';
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <div className={`mx-auto flex min-h-screen w-full max-w-[430px] flex-col ${isFoodRoute ? 'bg-white' : 'bg-[#FF6B00]'} shadow-2xl relative overflow-hidden`}>
      {!isOnboarding && !isFoodRoute && <AppHeader title={pageTitle} />}
      {!isOnboarding ? (
        <main className={`flex-1 w-full bg-white ${isFoodRoute ? 'pt-safe pt-2' : 'rounded-t-[28px] -mt-4 pt-4'} relative z-10 px-3.5 pb-28 sm:pb-32`}>
          {children}
        </main>
      ) : (
        children
      )}
      {!isOnboarding && !isProductDetailPage && <BottomNavigation />}
    </div>
  );
}
