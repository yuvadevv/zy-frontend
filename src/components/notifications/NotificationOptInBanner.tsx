'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { usePushNotifications } from '@/lib/notifications/usePushNotifications';

export function NotificationOptInBanner() {
  const { isSupported, permission, isSubscribed, loading, error, requestPermissionAndSubscribe } = usePushNotifications();
  const [isDismissed, setIsDismissed] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Don't show if unsupported or already subscribed or permission explicitly denied
    if (!isSupported || isSubscribed || permission === 'denied' || permission === 'granted') {
      setIsDismissed(true);
      return;
    }

    // Check if dismissed in the last 7 days
    const lastDismissed = localStorage.getItem('bl_push_optin_dismissed');
    if (lastDismissed) {
      const diffMs = Date.now() - parseInt(lastDismissed, 10);
      if (diffMs < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
        return;
      }
    }

    // Show opt-in banner cleanly
    setIsDismissed(false);
  }, [isSupported, isSubscribed, permission]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('bl_push_optin_dismissed', Date.now().toString());
  };

  const handleEnable = async () => {
    const success = await requestPermissionAndSubscribe();
    if (success) {
      setSuccessMessage(true);
      setTimeout(() => {
        setIsDismissed(true);
      }, 2500);
    }
  };

  if (isDismissed) return null;

  return (
    <div className="w-full my-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-orange-50/60 border border-orange-200/90 shadow-sm relative select-none">
      {/* Dismiss X */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      {successMessage ? (
        <div className="flex items-center gap-3 py-1 text-emerald-800">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-black">Notifications Enabled!</h4>
            <p className="text-[11px] text-gray-600 mt-0.5">
              You will receive real-time alerts when your food is ready and prints are delivered.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 pr-6">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#151515] tracking-tight">
                  Stay connected with BLINTZY
                </span>
                <span className="text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-orange-100 text-[#FF6B00]">
                  Official
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Get instant updates about your orders, new food menus and important campus announcements.
              </p>
              {error && (
                <p className="text-[10.5px] text-rose-600 font-bold mt-1">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100/80 transition"
            >
              Not Now
            </button>
            <button
              onClick={handleEnable}
              disabled={loading}
              className="px-4 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] active:scale-95 text-white text-xs font-black shadow-xs transition flex items-center gap-1.5 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enabling...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enable Notifications</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
