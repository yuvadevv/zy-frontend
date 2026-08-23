'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/features/cart/providers/CartProvider';
import { APP_ROUTES } from '@/constants/routes';

export function AppHeader({ title }: { title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/app/home';
  const { cart } = useCart();
  
  const itemCount = cart?.items?.length || 0;

  return (
    <header className="sticky top-0 z-0 flex flex-col justify-end w-full bg-[#FF6B00] text-white pt-[env(safe-area-inset-top)] h-[72px] pb-[1.625rem] px-6 rounded-b-[44px]">
      <div className="flex items-center justify-between w-full relative z-10">
        <div className="flex items-center gap-3 z-10">
          {!isHome ? (
            <button onClick={() => router.back()} className="text-white hover:opacity-80 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          ) : (
            <div className="font-extrabold tracking-wide text-lg">BLINTZY</div>
          )}
        </div>
        
        <h1 className="text-[19px] font-extrabold absolute left-0 right-0 text-center pointer-events-none truncate px-[5.5rem] tracking-wide">
          {title}
        </h1>
        
        <div className="flex items-center justify-end gap-3 z-10">
          <button 
            onClick={() => router.push(APP_ROUTES.CART)}
            className="text-white hover:opacity-80 transition-opacity flex items-center justify-center relative"
          >
            <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#FF6B00] text-[10px] font-bold px-[5px] py-[1px] rounded-full min-w-[18px] text-center shadow-sm">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
