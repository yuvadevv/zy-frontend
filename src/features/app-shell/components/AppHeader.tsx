'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/features/cart/providers/CartProvider';
import { APP_ROUTES } from '@/constants/routes';

export function AppHeader({ title }: { title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/app/home';
  const isFoodRoute = pathname.startsWith('/app/campus-food');
  const { cart } = useCart();
  
  const itemCount = cart?.items?.length || 0;

  const handleBack = () => {
    if (pathname === '/app/campus-food') {
      router.push(APP_ROUTES.HOME);
    } else if (pathname.startsWith('/app/campus-food/')) {
      router.push(APP_ROUTES.CAMPUS_FOOD);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-0 flex flex-col justify-end w-full bg-[#FF6B00] text-white pt-safe h-[66px] pb-3 px-5 rounded-b-[28px]">
      <div className="flex items-center justify-between w-full relative z-10">
        <div className="flex items-center gap-2.5 z-10">
          {!isHome ? (
            <button 
              onClick={handleBack} 
              className="text-white hover:opacity-80 active:scale-95 transition flex items-center justify-center w-8 h-8 -ml-1 rounded-full"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          ) : (
            <span className="font-black tracking-tight text-[20px] text-white select-none">BLINTZY</span>
          )}
        </div>
        
        {!isHome && (
          <h1 className="text-[17px] font-bold absolute left-0 right-0 text-center pointer-events-none truncate px-12 tracking-tight">
            {title}
          </h1>
        )}
        
        <div className="flex items-center justify-end gap-2 z-10">
          {!isFoodRoute ? (
            <button 
              onClick={() => router.push(APP_ROUTES.CART)}
              className="text-white hover:opacity-90 active:scale-95 transition flex items-center justify-center relative w-9 h-9 rounded-full bg-white/10"
              aria-label={`Shopping Cart, ${itemCount} items`}
            >
              <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.4} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#FF6B00] text-[9.5px] font-black px-1.5 py-0.5 rounded-full min-w-[17px] text-center shadow-xs ring-2 ring-[#FF6B00] leading-none">
                  {itemCount}
                </span>
              )}
            </button>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/20 select-none">
              Food
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
