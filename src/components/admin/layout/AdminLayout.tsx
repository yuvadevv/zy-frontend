'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthSession } from '@/features/auth/providers/AuthProvider';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading } = useAuthSession();
  const isLoginPage = pathname === '/admin/login';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse state

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !session && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [session, isLoading, isLoginPage, router]);

  // Handle sidebar collapse based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsSidebarCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
