'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { APP_ROUTES } from '@/config/routes';
import { NotificationBadge } from '@/features/notifications/components/NotificationBadge';
export function BottomNavigation() {
  const pathname = usePathname();
  const tabs = Object.values(APP_ROUTES);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex h-20 w-full max-w-[430px] items-center justify-around border-t border-gray-100 bg-white/95 backdrop-blur-md pb-[calc(env(safe-area-inset-bottom)+8px)] px-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        const Icon = tab.icon!;
        return (
          <motion.div
            key={tab.path}
            whileTap={{ scale: 0.92 }}
            className="flex h-full flex-1 touch-manipulation"
          >
            <Link 
              href={tab.path} 
              className="relative flex h-full flex-1 flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 pb-1"
              aria-label={tab.title}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator" 
                  className="absolute top-[6px] w-[60px] h-[36px] rounded-full bg-orange-50" 
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }} 
                />
              )}
              {tab.path === '/app/notifications' ? (
                <NotificationBadge className={`h-6 w-6 relative z-10 transition-colors ${isActive ? 'text-orange-500' : ''}`} iconOnly />
              ) : (
                <Icon className={`h-6 w-6 relative z-10 transition-colors ${isActive ? 'text-orange-500' : ''}`} />
              )}
              <span className={`text-[10px] font-bold relative z-10 transition-colors ${isActive ? 'text-orange-500' : 'font-medium'}`}>
                {tab.title}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
