// src/features/notifications/components/NotificationActionMenu.tsx
import React, { useState } from 'react';
import { MoreVertical, Check, Trash2, Share2, Archive } from 'lucide-react';
import { NotificationItem } from '../types';
import { useNotifications } from '../providers/NotificationProvider';

interface NotificationActionMenuProps {
  notification: NotificationItem;
}

export const NotificationActionMenu = ({ notification }: NotificationActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { markAsRead, archiveNotification } = useNotifications();

  const handleAction = async (e: React.MouseEvent, action: () => Promise<void>) => {
    e.stopPropagation();
    setIsOpen(false);
    await action();
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-1 rounded-full hover:bg-muted/50 text-muted-foreground"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-1 overflow-hidden">
            {notification.status === 'UNREAD' && (
              <button 
                onClick={(e) => handleAction(e, () => markAsRead(notification.id))}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark as read
              </button>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Mock sharing
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button 
              onClick={(e) => handleAction(e, () => archiveNotification(notification.id))}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2"
            >
              <Archive className="w-4 h-4" />
              Archive
            </button>
            <div className="h-px bg-border my-1" />
            <button 
              onClick={(e) => handleAction(e, () => archiveNotification(notification.id))} // Maps to archive for safety
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-500 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};
