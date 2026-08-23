'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    orderUpdates: true,
    deliveryUpdates: true,
    promotions: false,
    newManuals: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div 
      onClick={onChange}
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 flex items-center ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-white min-h-[100dvh]">
      <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10 gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-black transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-black">Notification Settings</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-32">
        <div className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-bold text-black uppercase tracking-wider text-xs">Orders</h3>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-black">Order Updates</span>
                  <span className="text-xs text-gray-500">Alerts when your order is placed or updated</span>
                </div>
                <Switch checked={settings.orderUpdates} onChange={() => toggleSetting('orderUpdates')} />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-black">Delivery Updates</span>
                  <span className="text-xs text-gray-500">Alerts when your prints are out for delivery</span>
                </div>
                <Switch checked={settings.deliveryUpdates} onChange={() => toggleSetting('deliveryUpdates')} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-black uppercase tracking-wider text-xs">Offers & News</h3>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-black">Promotions</span>
                  <span className="text-xs text-gray-500">Special discounts and seasonal offers</span>
                </div>
                <Switch checked={settings.promotions} onChange={() => toggleSetting('promotions')} />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-black">New Manuals</span>
                  <span className="text-xs text-gray-500">Be the first to know when new semester manuals arrive</span>
                </div>
                <Switch checked={settings.newManuals} onChange={() => toggleSetting('newManuals')} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
