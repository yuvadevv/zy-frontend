// src/features/notifications/providers/NotificationProvider.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { NotificationItem, NotificationCategory } from '../types';
import { notificationService } from '../services/notificationService';
import { useNotificationAnalytics } from '../hooks/useNotificationAnalytics';

interface NotificationContextProps {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  activeCategory: NotificationCategory | 'ALL';
  setActiveCategory: (category: NotificationCategory | 'ALL') => void;
  loadMore: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'ALL'>('ALL');

  const { trackNotificationRead } = useNotificationAnalytics();

  const fetchNotifications = useCallback(async (currentPage: number, isLoadMore = false) => {
    try {
      if (!isLoadMore) setIsLoading(true);
      else setIsLoadingMore(true);

      const response = await notificationService.fetchNotifications(currentPage);
      
      setUnreadCount(response.unreadCount);
      setHasMore(response.items.length > 0 && notifications.length + response.items.length < response.total);

      if (isLoadMore) {
        setNotifications(prev => [...prev, ...response.items]);
      } else {
        setNotifications(response.items);
      }
      setPage(currentPage);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [notifications.length]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => {
        fetchNotifications(1);
      }, 0);
    }
    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    await fetchNotifications(page + 1, true);
  };

  const refresh = async () => {
    await fetchNotifications(1, false);
  };

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      await notificationService.markAsRead(id);
      trackNotificationRead(id);
    } catch (error) {
      await refresh(); // Rollback on failure
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => n.status === 'UNREAD' ? { ...n, status: 'READ' } : n));
      setUnreadCount(0);
      await notificationService.markAllAsRead();
    } catch (error) {
      await refresh();
    }
  };

  const archiveNotification = async (id: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      await notificationService.archiveNotification(id);
    } catch (error) {
      await refresh();
    }
  };

  const filteredNotifications = activeCategory === 'ALL' 
    ? notifications 
    : notifications.filter(n => n.category === activeCategory);

  return (
    <NotificationContext.Provider value={{
      notifications: filteredNotifications,
      unreadCount,
      isLoading,
      isLoadingMore,
      error,
      hasMore: activeCategory === 'ALL' ? hasMore : false, // Disable pagination for strict local filtering for now
      activeCategory,
      setActiveCategory,
      loadMore,
      markAsRead,
      markAllAsRead,
      archiveNotification,
      refresh
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
