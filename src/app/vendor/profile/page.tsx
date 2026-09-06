'use client';

import { useState, useEffect } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { User, Save, Building, Phone, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await vendorClient.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        business_name: data.business_name || '',
        contact_person: data.contact_person || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        description: data.description || ''
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await vendorClient.updateProfile(formData);
      toast.success('Profile updated successfully');
      loadProfile();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <User className="w-8 h-8 mr-3 text-[#FF6B00]" />
            Business Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your business details and contact information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Account Details (Read Only) */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">Account Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email / Login</label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-medium">{profile?.email}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-bold uppercase">{profile?.status}</div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center"><Building className="w-4 h-4 mr-2" /> Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text" name="business_name" value={formData.business_name} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text" name="contact_person" value={formData.contact_person} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description" rows={3} value={formData.description} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center"><Phone className="w-4 h-4 mr-2" /> Contact & Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text" name="phone" value={formData.phone} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text" name="address" value={formData.address} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text" name="city" value={formData.city} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text" name="state" value={formData.state} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                />
              </div>
            </div>
          </div>
          
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-[#e66000] focus:ring-4 focus:ring-orange-200 disabled:opacity-50 transition-all flex items-center shadow-sm"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
