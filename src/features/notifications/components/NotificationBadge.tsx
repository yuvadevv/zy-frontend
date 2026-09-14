// src/features/notifications/components/NotificationBadge.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../providers/NotificationProvider';
import { Bell, Check, Clock, Megaphone, AlertCircle, BookOpen, ClipboardList, Calendar } from 'lucide-react';
import Link from 'next/link';

interface NotificationBadgeProps {
  className?: string;
  iconOnly?: boolean;
}

const ICONS: Record<string, any> = {
  megaphone: Megaphone,
  'alert-circle': AlertCircle,
  'book-open': BookOpen,
  'clipboard-list': ClipboardList,
  calendar: Calendar,
  bell: Bell,
};

export const NotificationBadge = ({ className = '', iconOnly = false }: NotificationBadgeProps) => {
  const { unreadCount, notifications, markAsRead, refresh } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      refresh(); // Refresh on open
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} ref={dropdownRef}>
      <button onClick={handleToggle} className="relative p-2 rounded-full hover:bg-muted transition-colors">
        <Bell className="w-6 h-6 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && !iconOnly && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-card border shadow-xl rounded-xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="p-4 border-b flex justify-between items-center bg-muted/30">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <Bell className="w-8 h-8 opacity-20 mb-2" />
                <p className="text-sm">No notifications yet.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.slice(0, 5).map((n) => {
                  const Icon = ICONS[n.category] || Bell;
                  return (
                    <div key={n.id} className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors flex gap-4 ${n.status === 'UNREAD' ? 'bg-primary/5' : ''}`}>
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.status === 'UNREAD' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate ${n.status === 'UNREAD' ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{n.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                          {n.status === 'UNREAD' && (
                            <button onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }} className="text-xs text-primary hover:underline flex items-center gap-1">
                              <Check className="w-3 h-3" /> Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-muted/30">
            <Link 
              href="/app/notifications" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2 text-sm text-primary font-medium hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
