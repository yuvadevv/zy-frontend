'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // BLINTZY: Old multi-step onboarding wizard removed.
    // New Google sign-in users enter the app directly at /app/home.
    // Academic details are collected separately via the Academic Profile Modal before ordering.
    router.replace('/app/home');
  }, [router]);

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
        <p className="text-sm font-semibold text-gray-600">Taking you to BLINTZY...</p>
      </div>
    </div>
  );
}
