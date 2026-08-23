'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Smartphone, LogOut, Check } from 'lucide-react';
import { useSecurity } from '@/features/profile/hooks/useSecurity';
import { authService } from '@/features/auth/services/authService';

export default function SecurityPage() {
  const router = useRouter();
  const { logoutAll } = useSecurity();
  const [deviceInfo, setDeviceInfo] = useState({ os: 'Unknown OS', browser: 'Unknown Browser', name: 'Current Device' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Basic client-side UA parsing for MVP
    const ua = window.navigator.userAgent;
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';
    let name = 'Device';

    if (ua.indexOf('Win') !== -1) { os = 'Windows'; name = 'Windows PC'; }
    else if (ua.indexOf('Mac') !== -1) { os = 'macOS'; name = 'MacBook / Mac'; }
    else if (ua.indexOf('Linux') !== -1) { os = 'Linux'; name = 'Linux PC'; }
    else if (ua.indexOf('Android') !== -1) { os = 'Android'; name = 'Android Device'; }
    else if (ua.indexOf('like Mac') !== -1) { os = 'iOS'; name = 'iPhone / iPad'; }

    if (ua.indexOf('Chrome') !== -1) browser = 'Google Chrome';
    else if (ua.indexOf('Safari') !== -1) browser = 'Safari';
    else if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
    else if (ua.indexOf('Edge') !== -1) browser = 'Microsoft Edge';

    setDeviceInfo({ os, browser, name });
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAll();
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
      setShowLogoutAllConfirm(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white min-h-[100dvh]">
      <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10 gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-black transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-black">Security & Devices</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-2 py-3">
          <span className="text-sm font-semibold text-black">Current Active Device</span>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50/50 border border-green-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-black flex items-center gap-2">
                    {deviceInfo.name}
                    <span className="text-[10px] uppercase bg-green-500 text-white font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3" /> Current Session
                    </span>
                  </span>
                  <span className="text-sm text-gray-500 mt-0.5">{deviceInfo.browser} • {deviceInfo.os}</span>
                  <span className="text-xs text-gray-500 mt-1 font-medium">Last Active: Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="h-px bg-gray-100 w-full" />
          
          <div className="pt-2">
            {!showLogoutConfirm ? (
              <button 
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setShowLogoutAllConfirm(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 py-4 rounded-xl transition-colors"
              >
                Log Out
              </button>
            ) : (
              <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="text-sm font-bold text-gray-800 text-center">Are you sure you want to log out?</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    disabled={isLoggingOut}
                    className="flex-1 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Log Out'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            {!showLogoutAllConfirm ? (
              <button 
                onClick={() => {
                  setShowLogoutAllConfirm(true);
                  setShowLogoutConfirm(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 py-4 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout from all devices
              </button>
            ) : (
              <div className="flex flex-col gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <span className="text-sm font-bold text-red-700 text-center">Invalidate all active sessions across all devices?</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowLogoutAllConfirm(false)}
                    disabled={isLoggingOut}
                    className="flex-1 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogoutAll}
                    disabled={isLoggingOut}
                    className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
