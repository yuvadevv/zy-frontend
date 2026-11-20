'use client';

import { useState, useEffect, useCallback } from 'react';
import { workerClient } from '@/lib/api/workerClient';

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermissionStatus;
  isSubscribed: boolean;
  loading: boolean;
  error: string | null;
  requestPermissionAndSubscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermissionStatus>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check support and existing permission on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission as NotificationPermissionStatus);
      const cached = localStorage.getItem('bl_push_subscribed');
      if (cached === 'true' && Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    } else {
      setPermission('unsupported');
    }
  }, []);

  // Request Permission and Subscribe
  const requestPermissionAndSubscribe = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
      setError('Push notifications are not supported on this browser or device.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Request user permission
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermissionStatus);

      if (result !== 'granted') {
        setError('Notification permission was not granted.');
        setLoading(false);
        return false;
      }

      // 2. Ensure Service Worker is registered
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      // 3. Obtain Token: Check for Firebase Web SDK or Web Push Subscription
      let token = '';

      // Check if Firebase config is supplied via env
      const fbApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const fbProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const fbSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
      const fbAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
      const fbVapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

      if (fbApiKey && fbProjectId && fbSenderId && fbAppId) {
        try {
          const { initializeApp, getApps } = await import('firebase/app');
          const { getMessaging, getToken } = await import('firebase/messaging');

          const app = getApps().length === 0
            ? initializeApp({
                apiKey: fbApiKey,
                projectId: fbProjectId,
                messagingSenderId: fbSenderId,
                appId: fbAppId
              })
            : getApps()[0];

          const messaging = getMessaging(app);
          token = await getToken(messaging, {
            serviceWorkerRegistration: registration,
            vapidKey: fbVapidKey
          });
        } catch (fbErr: any) {
          console.warn('[Push] Firebase SDK token fallback to WebPush:', fbErr?.message);
        }
      }

      // Fallback: Generate or retrieve standard WebPush token
      if (!token) {
        try {
          const existingSub = await registration.pushManager.getSubscription();
          if (existingSub) {
            token = JSON.stringify(existingSub.toJSON());
          } else {
            // Generate standard WebPush subscription
            const newSub = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: fbVapidKey || undefined
            });
            token = JSON.stringify(newSub.toJSON());
          }
        } catch {
          // Local device token generator for campus testing
          token = localStorage.getItem('bl_device_token') || `wp_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          localStorage.setItem('bl_device_token', token);
        }
      }

      // 4. Send token to authenticated backend
      const platform = navigator.userAgent.includes('Mobile') ? 'web_mobile' : 'web_desktop';
      const deviceInfo = navigator.userAgent.slice(0, 120);

      const res = await workerClient.subscribePush({
        fcmToken: token,
        platform,
        deviceInfo,
        preferences: {
          order_updates: true,
          food_announcements: true,
          promotions: true,
          campus_announcements: true
        }
      });

      if (res?.success) {
        localStorage.setItem('bl_push_subscribed', 'true');
        localStorage.setItem('bl_push_token', token);
        setIsSubscribed(true);
        return true;
      } else {
        throw new Error(res?.error?.message || 'Server rejected push registration');
      }
    } catch (err: any) {
      console.error('[Push Subscription Error]:', err);
      setError(err?.message || 'Failed to complete push notification setup.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unsubscribe
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bl_push_token');
      await workerClient.unsubscribePush(token || undefined);

      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
      }

      localStorage.removeItem('bl_push_subscribed');
      localStorage.removeItem('bl_push_token');
      setIsSubscribed(false);
      return true;
    } catch (err: any) {
      console.error('[Push Unsubscribe Error]:', err);
      setError(err?.message || 'Failed to unsubscribe.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    error,
    requestPermissionAndSubscribe,
    unsubscribe
  };
}
