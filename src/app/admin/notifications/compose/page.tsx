'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2, Megaphone, AlertCircle, BookOpen, ClipboardList, Notebook, CalendarCheck, Calendar, Briefcase, Presentation, Rocket, Receipt, Gift, AlertTriangle, Wrench, Bell } from 'lucide-react';
import { adminClient } from '@/lib/api/adminClient';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'Announcement', icon: Megaphone, iconId: 'megaphone' },
  { id: 'Important Notice', icon: AlertCircle, iconId: 'alert-circle' },
  { id: 'Academic', icon: BookOpen, iconId: 'book-open' },
  { id: 'Examination', icon: ClipboardList, iconId: 'clipboard-list' },
  { id: 'Event', icon: Calendar, iconId: 'calendar' },
  { id: 'General', icon: Bell, iconId: 'bell' },
];

export default function ComposeNotificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'Announcement',
    icon: 'megaphone',
    action_label: '',
    action_url: '',
    audience_type: 'all', // all, filtered, individual
  });

  const [audienceFilter, setAudienceFilter] = useState({
    branches: [],
    sections: [],
    years: [],
    selected_users: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      return toast.error('Title and message are required');
    }

    try {
      setLoading(true);
      const res = await adminClient.fetch('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          audience_filter: audienceFilter
        })
      });
      toast.success(`Notification sent to ${res.recipient_count} users!`);
      router.push('/admin/notifications');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Compose Notification</h1>
          <p className="text-muted-foreground mt-1">Send a new in-app notification</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card p-6 rounded-xl border space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Notification Details</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                className="w-full p-2 border rounded-lg bg-background"
                value={formData.category}
                onChange={e => {
                  const cat = CATEGORIES.find(c => c.id === e.target.value);
                  setFormData({...formData, category: cat?.id || '', icon: cat?.iconId || 'bell'});
                }}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.id}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input 
              required
              type="text" 
              className="w-full p-2 border rounded-lg bg-background"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Tomorrow's Classes Suspended"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea 
              required
              rows={4}
              className="w-full p-2 border rounded-lg bg-background resize-none"
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="Enter the notification message..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Action Label (Optional)</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg bg-background"
                value={formData.action_label}
                onChange={e => setFormData({...formData, action_label: e.target.value})}
                placeholder="e.g. View Timetable"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Action URL (Optional)</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg bg-background"
                value={formData.action_url}
                onChange={e => setFormData({...formData, action_url: e.target.value})}
                placeholder="e.g. /app/timetable"
              />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Audience Selection</h2>
          
          <div className="flex gap-4">
            {['all', 'filtered', 'individual'].map(type => (
              <label key={type} className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 flex-1">
                <input 
                  type="radio" 
                  name="audience_type" 
                  value={type}
                  checked={formData.audience_type === type}
                  onChange={e => setFormData({...formData, audience_type: e.target.value})}
                />
                <span className="capitalize font-medium">{type === 'all' ? 'Everyone' : type === 'filtered' ? 'Filtered Users' : 'Selected Individuals'}</span>
              </label>
            ))}
          </div>

          {formData.audience_type === 'filtered' && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <p className="text-sm text-muted-foreground">Note: Filtering by branches/sections is supported. In this simplified UI, you'd select from available branches.</p>
              {/* Simplified filtering UI for the prompt constraints */}
            </div>
          )}

          {formData.audience_type === 'individual' && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <p className="text-sm text-muted-foreground">In a full UI, a searchable user combobox would appear here to add student IDs.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </form>
    </div>
  );
}
