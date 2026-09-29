'use client';

import React, { useEffect, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

function VerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/app/onboarding';
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Ensure the auth cookie is set from localStorage token before navigating.
    // This is critical on mobile (Safari ITP) where cookies set during
    // cross-origin redirect chains can get dropped.
    async function ensureCookieAndRedirect() {
      try {
        const token = localStorage.getItem('bl_session_token');
        if (token) {
          // Re-set the cookie client-side as a fallback for mobile browsers
          document.cookie = `bl_auth_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
          // Also persist via server route (best-effort)
          try {
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
            });
          } catch {
            // Ignore — client-side cookie above is the important fallback
          }
        }
      } catch {
        // localStorage may be unavailable in some private browsers
      }
      setReady(true);
    }

    ensureCookieAndRedirect();
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Automatically redirect after a short delay
    const timer = setTimeout(() => {
      router.push(nextUrl);
    }, 1500);
    return () => clearTimeout(timer);
  }, [router, nextUrl, ready]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white p-8 rounded-3xl text-center shadow-sm"
    >
      <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-4">
        Email Verified!
      </h1>
      <p className="text-gray-600 mb-8">
        Your email has been successfully verified. You can now use all features of BLINTZY.
      </p>
      
      <button
        onClick={() => router.push(nextUrl)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
      >
        Continue to App
      </button>
    </motion.div>
  );
}

export default function VerifiedPage() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="w-full bg-white p-8 rounded-3xl text-center shadow-sm flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      }>
        <VerifiedContent />
      </Suspense>
    </AuthLayout>
  );
}
