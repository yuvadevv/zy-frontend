// src/features/notifications/components/NotificationPreferencesCard.tsx
import React from 'react';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';
import { Loader2 } from 'lucide-react';
import { NotificationPreferenceType } from '../types';

export const NotificationPreferencesCard = () => {
  const { preferences, isLoading, togglePreference } = useNotificationPreferences();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleToggle = (id: NotificationPreferenceType, enabled: boolean) => {
    togglePreference(id, enabled);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <h3 className="font-bold text-foreground">Channels</h3>
          <p className="text-xs text-muted-foreground">How would you like to receive notifications?</p>
        </div>
        <div className="flex flex-col">
          {preferences.filter(p => ['PUSH', 'EMAIL', 'SMS', 'WHATSAPP'].includes(p.id)).map(pref => (
            <div key={pref.id} className="flex items-center justify-between p-4 border-b border-border/50 last:border-0">
              <div className="flex flex-col pr-4">
                <span className="text-sm font-semibold text-foreground">{pref.label}</span>
                <span className="text-xs text-muted-foreground leading-snug">{pref.description}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={pref.enabled}
                  onChange={(e) => handleToggle(pref.id, e.target.checked)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <h3 className="font-bold text-foreground">Categories</h3>
          <p className="text-xs text-muted-foreground">What type of notifications do you want?</p>
        </div>
        <div className="flex flex-col">
          {preferences.filter(p => !['PUSH', 'EMAIL', 'SMS', 'WHATSAPP'].includes(p.id)).map(pref => (
            <div key={pref.id} className="flex items-center justify-between p-4 border-b border-border/50 last:border-0">
              <div className="flex flex-col pr-4">
                <span className="text-sm font-semibold text-foreground">{pref.label}</span>
                <span className="text-xs text-muted-foreground leading-snug">{pref.description}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={pref.enabled}
                  disabled={pref.isSystemMandatory}
                  onChange={(e) => handleToggle(pref.id, e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  pref.isSystemMandatory 
                    ? 'bg-primary/50 after:translate-x-full cursor-not-allowed' 
                    : 'bg-muted peer-checked:after:translate-x-full peer-checked:bg-primary cursor-pointer'
                }`}></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
