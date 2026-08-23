'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Save, AlertCircle, Settings2, Globe, Truck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalBanner, setGlobalBanner] = useState({ text: '', active: false, type: 'info' });
  const [platformFee, setPlatformFee] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportWhatsapp, setSupportWhatsapp] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminClient.getSettings();
      const s = data.settings || {};
      
      setSettings(s);
      setMaintenanceMode(s.maintenance_mode === true || s.maintenance_mode === 'true');
      if (s.global_banner) setGlobalBanner(s.global_banner);
      setPlatformFee(Number(s.platform_fee) || 0);
      setDeliveryFee(Number(s.delivery_fee) || 0);
      setSupportEmail(s.support_email || '');
      setSupportPhone(s.support_phone || '');
      setSupportWhatsapp(s.support_whatsapp || '');
      
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setError("Access Denied. You need the 'settings.manage' permission.");
      } else {
        setError(err.message || 'Failed to load settings');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const updates = [
        { key: 'maintenance_mode', value: maintenanceMode },
        { key: 'global_banner', value: globalBanner },
        { key: 'platform_fee', value: platformFee },
        { key: 'delivery_fee', value: deliveryFee },
        { key: 'support_email', value: supportEmail },
        { key: 'support_phone', value: supportPhone },
        { key: 'support_whatsapp', value: supportWhatsapp }
      ];

      await adminClient.updateSettings(updates);
      toast.success('Settings updated successfully');
      loadSettings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure global application variables and maintenance modes.</p>
        </div>
        <div className="flex justify-end">
          <button 
            type="submit" 
            form="settingsForm"
            disabled={saving}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      <form id="settingsForm" onSubmit={handleSave} className="space-y-6">
        
        {/* Maintenance Mode */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2 bg-gray-50/50">
            <Settings2 className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">System State</h2>
          </div>
          <div className="p-6">
            <label className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-500 mt-1">Disables student access and shows a maintenance screen.</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Global Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2 bg-gray-50/50">
            <Globe className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Global Announcements</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Enable Banner</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={globalBanner.active}
                  onChange={(e) => setGlobalBanner({...globalBanner, active: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
              </div>
            </div>
            
            {globalBanner.active && (
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
                  <select 
                    value={globalBanner.type} 
                    onChange={e => setGlobalBanner({...globalBanner, type: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Yellow)</option>
                    <option value="danger">Critical (Red)</option>
                    <option value="success">Success (Green)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Message</label>
                  <input 
                    type="text" 
                    value={globalBanner.text} 
                    onChange={e => setGlobalBanner({...globalBanner, text: e.target.value})}
                    placeholder="e.g. Exams are approaching! Ensure your manuals are ordered."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Fees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2 bg-gray-50/50">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Pricing & Fees</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <CreditCard className="w-4 h-4 mr-1 text-gray-400" />
                Platform Fee (₹)
              </label>
              <p className="text-xs text-gray-500 mb-2">Fixed fee added to all orders for platform maintenance.</p>
              <input 
                type="number" step="0.5" min="0" required
                value={platformFee} 
                onChange={e => setPlatformFee(parseFloat(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Truck className="w-4 h-4 mr-1 text-gray-400" />
                Hostel Delivery Fee (₹)
              </label>
              <p className="text-xs text-gray-500 mb-2">Cost applied when a student chooses hostel delivery.</p>
              <input 
                type="number" step="0.5" min="0" required
                value={deliveryFee} 
                onChange={e => setDeliveryFee(parseFloat(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2 bg-gray-50/50">
            <Globe className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Support Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input 
                type="email" 
                value={supportEmail} 
                onChange={e => setSupportEmail(e.target.value)}
                placeholder="support@blintzy.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
              <input 
                type="tel" 
                value={supportPhone} 
                onChange={e => setSupportPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Support Number</label>
              <input 
                type="tel" 
                value={supportWhatsapp} 
                onChange={e => setSupportWhatsapp(e.target.value)}
                placeholder="e.g. 919876543210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
              <p className="text-[11px] text-gray-500 mt-1">Include country code without '+'. Example: 919876543210</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
