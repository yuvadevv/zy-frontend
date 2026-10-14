'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionManager } from '@/utils/SessionManager';
import { SplashScreen } from '@/features/bootstrap/components/SplashScreen';

export function RootAuthRedirect() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    const hasStoredTokens = Boolean(SessionManager.getToken() || SessionManager.getRefreshToken());

    if (!hasStoredTokens && !isStandalone) {
      return;
    }

    setChecking(true);

    async function checkSession() {
      try {
        const token = await SessionManager.getValidToken();
        if (token) {
          router.replace('/app/home');
          return;
        }

        if (isStandalone) {
          router.replace('/login');
          return;
        }
      } catch (err) {
        console.warn('Root auth check error:', err);
      }
      setChecking(false);
    }

    checkSession();
  }, [router]);

  if (checking) {
    return <SplashScreen />;
  }

  return null;
}
