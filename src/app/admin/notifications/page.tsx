'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Bell, Users, Eye, CheckCircle2 } from 'lucide-react';
import { adminClient } from '@/lib/api/adminClient';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, sent_recently: 0, total_recipients: 0, total_unread: 0 });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await adminClient.fetch('/api/admin/notifications');
      setNotifications(res.notifications || []);
      
      // Calculate rudimentary stats
      let totalRecipients = 0;
      let totalUnread = 0;
      let recent = 0;
      const now = Date.now();
      
      res.notifications?.forEach((n: any) => {
        totalRecipients += n.recipient_count || 0;
        totalUnread += (n.recipient_count - (n.read_count || 0));
        if (now - n.created_at < 86400000 * 7) recent++;
      });
      
      setStats({
        total: res.total || 0,
        sent_recently: recent,
        total_recipients: totalRecipients,
        total_unread: totalUnread
      });
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Notifications / Messages</h1>
          <p className="text-muted-foreground mt-1">Manage and send in-app notifications</p>
        </div>
        <button
          onClick={() => router.push('/admin/notifications/compose')}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Compose Notification
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Recipients</p>
              <h3 className="text-2xl font-bold">{stats.total_recipients}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Read</p>
              <h3 className="text-2xl font-bold">{stats.total_recipients - stats.total_unread}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unread</p>
              <h3 className="text-2xl font-bold">{stats.total_unread}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Sent Notifications</h2>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No notifications sent yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Audience</th>
                  <th className="p-4 font-medium">Recipients</th>
                  <th className="p-4 font-medium">Read / Unread</th>
                  <th className="p-4 font-medium">Sent Date</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n: any) => (
                  <tr key={n.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{n.title}</div>
                      <div className="text-sm text-muted-foreground">{n.category}</div>
                    </td>
                    <td className="p-4 capitalize">{n.audience_type}</td>
                    <td className="p-4">{n.recipient_count}</td>
                    <td className="p-4">
                      <span className="text-green-600 font-medium">{n.read_count}</span> / 
                      <span className="text-orange-500 font-medium ml-1">{n.recipient_count - n.read_count}</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
