'use client';

import React, { useState, useEffect } from 'react';
import { workerClient } from '@/lib/api/workerClient';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface PricingRule {
  id: string;
  service_type: string;
  pricing_method: string;
  min_pages: number | null;
  max_pages: number | null;
  customer_unit_price: number;
  vendor_unit_price: number;
  blintzy_unit_earning: number;
  is_active: number;
  notes: string | null;
}

export default function VendorPricingConfig() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PricingRule>>({});

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const res = await workerClient.fetch('/api/admin/pricing/vendor-blintzy');
      setRules(res.pricing_rules);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSave = async () => {
    try {
      if (isEditing === 'new') {
        await workerClient.fetch('/api/admin/pricing/vendor-blintzy', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      } else {
        await workerClient.fetch(`/api/admin/pricing/vendor-blintzy/${isEditing}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      }
      setIsEditing(null);
      fetchRules();
    } catch (err) {
      alert('Failed to save pricing rule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    try {
      await workerClient.fetch(`/api/admin/pricing/vendor-blintzy/${id}`, { method: 'DELETE' });
      fetchRules();
    } catch (err) {
      alert('Failed to delete rule');
    }
  };

  const getServiceName = (type: string) => {
    const map: Record<string, string> = {
      'bw_single': 'B&W Single Sided',
      'bw_double': 'B&W Double Sided',
      'color_single': 'Color Single Sided',
      'color_double': 'Color Double Sided',
      'spiral_binding': 'Spiral Binding',
      'delivery': 'Delivery Fee'
    };
    return map[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Configure Vendor Costs & BLINTZY Margins</h3>
        <button
          onClick={() => {
            setFormData({
              service_type: 'bw_single',
              pricing_method: 'per_page',
              customer_unit_price: 0,
              vendor_unit_price: 0,
              blintzy_unit_earning: 0,
              is_active: 1
            });
            setIsEditing('new');
          }}
          className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e66000] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 border-y border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Pages</th>
              <th className="px-4 py-3 font-medium text-right text-gray-900">Customer Price</th>
              <th className="px-4 py-3 font-medium text-right text-red-600">Vendor Cost</th>
              <th className="px-4 py-3 font-medium text-right text-green-600">BLINTZY Margin</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">{getServiceName(rule.service_type)}</td>
                <td className="px-4 py-4 text-gray-500">{rule.pricing_method}</td>
                <td className="px-4 py-4 text-gray-500">
                  {rule.min_pages !== null ? `${rule.min_pages} - ${rule.max_pages || '∞'}` : 'N/A'}
                </td>
                <td className="px-4 py-4 text-right font-medium">₹{rule.customer_unit_price}</td>
                <td className="px-4 py-4 text-right text-red-600 font-medium">₹{rule.vendor_unit_price}</td>
                <td className="px-4 py-4 text-right text-green-600 font-medium">₹{rule.blintzy_unit_earning}</td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => { setFormData(rule); setIsEditing(rule.id); }} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors mr-2">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(rule.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && !isLoading && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No pricing rules configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing === 'new' ? 'Add Pricing Rule' : 'Edit Pricing Rule'}
              </h2>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select 
                  value={formData.service_type || 'bw_single'}
                  onChange={e => setFormData({...formData, service_type: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF6B00] focus:ring-[#FF6B00] sm:text-sm"
                >
                  <option value="bw_single">B&W Single Sided</option>
                  <option value="bw_double">B&W Double Sided</option>
                  <option value="color_single">Color Single Sided</option>
                  <option value="color_double">Color Double Sided</option>
                  <option value="spiral_binding">Spiral Binding</option>
                  <option value="delivery">Delivery Fee</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Pages</label>
                  <input type="number" value={formData.min_pages || ''} onChange={e => setFormData({...formData, min_pages: parseInt(e.target.value) || null})} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF6B00] focus:ring-[#FF6B00] sm:text-sm" placeholder="Leave empty if N/A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Pages</label>
                  <input type="number" value={formData.max_pages || ''} onChange={e => setFormData({...formData, max_pages: parseInt(e.target.value) || null})} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF6B00] focus:ring-[#FF6B00] sm:text-sm" placeholder="Leave empty if N/A" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Customer Price</label>
                  <input type="number" step="0.01" value={formData.customer_unit_price || 0} onChange={e => setFormData({...formData, customer_unit_price: parseFloat(e.target.value) || 0})} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF6B00] focus:ring-[#FF6B00] sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-1">Vendor Cost</label>
                  <input type="number" step="0.01" value={formData.vendor_unit_price || 0} onChange={e => {
                    const vendorCost = parseFloat(e.target.value) || 0;
                    const customerPrice = formData.customer_unit_price || 0;
                    setFormData({...formData, vendor_unit_price: vendorCost, blintzy_unit_earning: customerPrice - vendorCost});
                  }} className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">BLINTZY Margin</label>
                  <input type="number" step="0.01" value={formData.blintzy_unit_earning || 0} onChange={e => {
                    const blintzyMargin = parseFloat(e.target.value) || 0;
                    const customerPrice = formData.customer_unit_price || 0;
                    setFormData({...formData, blintzy_unit_earning: blintzyMargin, vendor_unit_price: customerPrice - blintzyMargin});
                  }} className="w-full rounded-lg border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
                </div>
              </div>
              
              <div>
                 <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={formData.is_active === 1} onChange={e => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} className="rounded text-[#FF6B00] focus:ring-[#FF6B00]" />
                    Rule is Active
                 </label>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
              <button onClick={() => setIsEditing(null)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B00] hover:bg-[#e66000] rounded-lg shadow-sm transition-colors">
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
