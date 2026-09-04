'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Save, AlertCircle, Settings2, Globe, Truck, CreditCard, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalBanner, setGlobalBanner] = useState({ text: '', active: false, type: 'info' });
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportWhatsapp, setSupportWhatsapp] = useState('');

  // Pricing Settings State
  const [pricingSettings, setPricingSettings] = useState({
    printRates: { bw_single: 1.0, bw_double: 1.5, color_single: 5.0, color_double: 8.0 },
    bindingFees: { none: 0, spiral: 30.0, soft_bound: 50.0, hard_bound: 100.0 },
    defaultDeliveryFee: 40.0,
    platformFee: 0,
    platformFeeEnabled: false
  });

  // Delivery Settings State
  const [deliverySettings, setDeliverySettings] = useState({
    shopOpenTime: '09:00',
    dailyCutoffTime: '18:00',
    normalDeliveryTime: '09:15',
    afterCutoffDeliveryTime: '09:10'
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminClient.getSettings();
      const s = data.settings || {};
      
      setMaintenanceMode(s.maintenance_mode === true || s.maintenance_mode === 'true');
      if (s.global_banner) setGlobalBanner(s.global_banner);
      setSupportEmail(s.support_email || '');
      setSupportPhone(s.support_phone || '');
      setSupportWhatsapp(s.support_whatsapp || '');

      if (s.pricing_settings) {
        try {
          const parsed = typeof s.pricing_settings === 'string' ? JSON.parse(s.pricing_settings) : s.pricing_settings;
          setPricingSettings({ ...pricingSettings, ...parsed });
        } catch (e) {}
      } else {
        // Migration from old fields
        setPricingSettings(prev => ({
          ...prev,
          platformFee: Number(s.platform_fee) || 0,
          defaultDeliveryFee: Number(s.delivery_fee) || 0
        }));
      }

      if (s.delivery_settings) {
        try {
          const parsed = typeof s.delivery_settings === 'string' ? JSON.parse(s.delivery_settings) : s.delivery_settings;
          setDeliverySettings({ ...deliverySettings, ...parsed });
        } catch (e) {}
      }
      
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
        { key: 'global_banner', value: JSON.stringify(globalBanner) },
        { key: 'support_email', value: supportEmail },
        { key: 'support_phone', value: supportPhone },
        { key: 'support_whatsapp', value: supportWhatsapp },
        { key: 'pricing_settings', value: JSON.stringify(pricingSettings) },
        { key: 'delivery_settings', value: JSON.stringify(deliverySettings) }
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
          <p className="text-sm text-gray-500 mt-1">Configure global application variables and pricing logic.</p>
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
        
        {/* Pricing & Fees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2 bg-gray-50/50">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Pricing & Fees (Single Source of Truth)</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">Printing Rates (₹ / page or sheet)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">B&W Single Sided</label>
                  <input type="number" step="0.5" required value={pricingSettings.printRates.bw_single} onChange={e => setPricingSettings({...pricingSettings, printRates: {...pricingSettings.printRates, bw_single: parseFloat(e.target.value)}})} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">B&W Double Sided</label>
                  <input type="number" step="0.5" required value={pricingSettings.printRates.bw_double} onChange={e => setPricingSettings({...pricingSettings, printRates: {...pricingSettings.printRates, bw_double: parseFloat(e.target.value)}})} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Color Single Sided</label>
                  <input type="number" step="0.5" required value={pricingSettings.printRates.color_single} onChange={e => setPricingSettings({...pricingSettings, printRates: {...pricingSettings.printRates, color_single: parseFloat(e.target.value)}})} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Color Double Sided</label>
                  <input type="number" step="0.5" required value={pricingSettings.printRates.color_double} onChange={e => setPricingSettings({...pricingSettings, printRates: {...pricingSettings.printRates, color_double: parseFloat(e.target.value)}})} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">Binding Fees (₹)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">No Binding</label>
                  <input type="number" step="0.5" required value={pricingSettings.bindingFees.none} onChange={e => setPricingSettings({...pricingSettings, bindingFees: {...pricingSettings.bindingFees, none: parseFloat(e.target.value)}})} className="w-full border rounded px-3 py-2 text-sm bg-gray-50" readOnly />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Spiral Binding</label>
                  <input type="number" step="0.5" required value={pricingSettings.bindingFees.spiral} onChange={e => setPricingSettings({...pricingSettings, bindingFees: {...pricingSettings.bindingFees, spiral: parseFloat(e.target.value)}})} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">Delivery & Platform Fees (₹)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Delivery Fee (0 = Free)</label>
                  <input type="number" step="0.5" required value={pricingSettings.defaultDeliveryFee} onChange={e => setPricingSettings({...pricingSettings, defaultDeliveryFee: parseFloat(e.target.value)})} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 flex items-center justify-between">
                    <span>Platform Fee</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={pricingSettings.platformFeeEnabled} onChange={e => setPricingSettings({...pricingSettings, platformFeeEnabled: e.target.checked})} />
                      <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                    </label>
                  </label>
                  <input type="number" step="0.5" required value={pricingSettings.platformFee} onChange={e => setPricingSettings({...pricingSettings, platformFee: parseFloat(e.target.value)})} disabled={!pricingSettings.platformFeeEnabled} className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2 bg-gray-50/50">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Delivery Schedule & ETA</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Shop Opening Time</label>
              <input type="time" required value={deliverySettings.shopOpenTime} onChange={e => setDeliverySettings({...deliverySettings, shopOpenTime: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Daily Order Cut-off Time</label>
              <input type="time" required value={deliverySettings.dailyCutoffTime} onChange={e => setDeliverySettings({...deliverySettings, dailyCutoffTime: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Target Delivery (Before Cut-off)</label>
              <input type="time" required value={deliverySettings.normalDeliveryTime} onChange={e => setDeliverySettings({...deliverySettings, normalDeliveryTime: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Target Delivery (After Cut-off)</label>
              <input type="time" required value={deliverySettings.afterCutoffDeliveryTime} onChange={e => setDeliverySettings({...deliverySettings, afterCutoffDeliveryTime: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
