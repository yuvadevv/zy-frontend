'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Bell, BellOff, Utensils, Printer, Sparkles, Megaphone, Loader2 } from 'lucide-react';
import { usePushNotifications } from '@/lib/notifications/usePushNotifications';
import { workerClient } from '@/lib/api/workerClient';

export default function NotificationsPage() {
  const router = useRouter();
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    loading: pushLoading, 
    requestPermissionAndSubscribe, 
    unsubscribe 
  } = usePushNotifications();

  const [preferences, setPreferences] = useState({
    order_updates: true,
    food_announcements: true,
    promotions: true,
    campus_announcements: true
  });
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch preferences from backend on load
  useEffect(() => {
    async function loadPreferences() {
      try {
        setLoadingPrefs(true);
        const res = await workerClient.getPushPreferences();
        if (res?.data?.preferences || res?.preferences) {
          setPreferences((prev) => ({
            ...prev,
            ...(res.data?.preferences || res.preferences)
          }));
        }
      } catch (err) {
        console.warn('Could not load push preferences:', err);
      } finally {
        setLoadingPrefs(false);
      }
    }
    loadPreferences();
  }, []);

  // 2. Toggle Master Push Subscription
  const handleToggleMasterPush = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await requestPermissionAndSubscribe();
    }
  };

  // 3. Toggle specific category preference
  const togglePreference = async (key: keyof typeof preferences) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    try {
      setIsSaving(true);
      await workerClient.updatePushPreferences(updated);
    } catch (err) {
      console.error('Failed to update preference:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const Switch = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 flex items-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${checked ? 'bg-[#FF6B00]' : 'bg-gray-200'}`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-white font-[Poppins,sans-serif] select-none">
      {/* Top Header */}
      <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-[#151515] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-black text-[#151515] tracking-tight">Notification Settings</h2>
          <span className="text-[11px] font-bold text-gray-400">Push & Alert Preferences</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-32 max-w-xl mx-auto w-full space-y-6">
        {/* Master Push Toggle Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 to-white border border-orange-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isSubscribed ? 'bg-[#FF6B00] text-white shadow-xs' : 'bg-gray-200 text-gray-500'
              }`}>
                {isSubscribed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-xs font-black text-[#151515]">Push Notifications</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {!isSupported
                    ? 'Unsupported on this browser'
                    : isSubscribed
                    ? 'Active on this device'
                    : permission === 'denied'
                    ? 'Blocked in browser settings'
                    : 'Get real-time order alerts'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {pushLoading && <Loader2 className="w-4 h-4 animate-spin text-[#FF6B00]" />}
              <Switch
                checked={isSubscribed}
                onChange={handleToggleMasterPush}
                disabled={pushLoading || !isSupported || permission === 'denied'}
              />
            </div>
          </div>

          {permission === 'denied' && (
            <p className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              Browser notifications are blocked. To re-enable, tap the site settings / lock icon in your browser address bar and allow Notifications.
            </p>
          )}
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[#151515] uppercase tracking-wider text-[11px]">
              Notification Categories
            </h3>
            {isSaving && (
              <span className="text-[10.5px] font-bold text-[#FF6B00] flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </span>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-150 shadow-2xs">
            {/* Order Updates */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-3 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center shrink-0 mt-0.5">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[#151515] block">Order & Token Updates</span>
                  <span className="text-[11px] text-gray-500">Live alerts when food is cooking, ready, or prints arrive</span>
                </div>
              </div>
              <Switch
                checked={preferences.order_updates}
                onChange={() => togglePreference('order_updates')}
              />
            </div>

            {/* Food Court */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-3 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[#151515] block">Campus Food Announcements</span>
                  <span className="text-[11px] text-gray-500">Daily meal schedules, new dish specials, and counter timings</span>
                </div>
              </div>
              <Switch
                checked={preferences.food_announcements}
                onChange={() => togglePreference('food_announcements')}
              />
            </div>

            {/* Campus Announcements */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-3 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[#151515] block">Campus Announcements</span>
                  <span className="text-[11px] text-gray-500">Official college, department, and exam print alerts</span>
                </div>
              </div>
              <Switch
                checked={preferences.campus_announcements}
                onChange={() => togglePreference('campus_announcements')}
              />
            </div>

            {/* Promotions & Offers */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-3 min-w-0 pr-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[#151515] block">Promotions & Campus Fest</span>
                  <span className="text-[11px] text-gray-500">Exclusive student discounts, deals, and festival passes</span>
                </div>
              </div>
              <Switch
                checked={preferences.promotions}
                onChange={() => togglePreference('promotions')}
              />
            </div>
          </div>
        </div>

        {/* Shared Device Security Note */}
        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 space-y-1">
          <strong className="text-gray-800 font-bold block">Privacy & Shared Devices:</strong>
          <p className="text-[11px]">
            When logging out of BLINTZY on a shared computer, notification sessions are safely unlinked to protect your personal orders and academic privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
