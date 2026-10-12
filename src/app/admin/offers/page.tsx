'use client';

import React, { useEffect, useState } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Tag, Plus, CheckCircle, XCircle, AlertCircle, Loader2, Calendar, Percent } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(30);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(100);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [badgeText, setBadgeText] = useState('Campus Fest Special');
  const [termsText, setTermsText] = useState('Discount applies to printing charges only. Excludes binding, delivery, and platform fees.');
  const [isActive, setIsActive] = useState(true);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await adminClient.getOffers();
      setOffers(res.offers || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleToggleStatus = async (offer: any) => {
    try {
      const newStatus = offer.is_active === 1 ? 0 : 1;
      await adminClient.updateOffer(offer.id, { is_active: newStatus });
      toast.success(`Offer ${offer.code} ${newStatus ? 'activated' : 'deactivated'}`);
      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, is_active: newStatus } : o));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update offer');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        description: description.trim(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        max_discount_amount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        min_order_amount: Number(minOrderAmount) || 0,
        eligible_services: ['all'],
        eligible_components: ['printing'],
        badge_text: badgeText.trim(),
        terms_text: termsText.trim(),
        is_active: isActive ? 1 : 0
      };

      await adminClient.createOffer(payload);
      toast.success('Offer created successfully');
      setShowModal(false);
      resetForm();
      loadOffers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create offer');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCode('');
    setTitle('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(30);
    setMaxDiscountAmount(100);
    setMinOrderAmount(0);
    setBadgeText('Campus Fest Special');
    setTermsText('Discount applies to printing charges only. Excludes binding, delivery, and platform fees.');
    setIsActive(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#FF6B00]" />
            Offers & Campaign Discounts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage Blintzy Campus Fest offers. Base print prices and binding rules remain centralized in Pricing Settings.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Campaign Offer
        </button>
      </div>

      {/* Scope Safeguard Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-orange-900 space-y-1">
          <p className="font-bold">Discount Scope Safeguard</p>
          <p>
            Offers apply strictly to eligible <strong>printing costs</strong> by default. Binding fees, delivery charges, and platform fees are preserved and excluded from discount calculations to protect vendor and delivery margins.
          </p>
        </div>
      </div>

      {/* Offers Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">No Offers Configured</h3>
          <p className="text-sm text-gray-500 mt-1">Create your first campaign offer to start promoting discounts.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Offer & Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Scope</th>
                  <th className="px-6 py-4">Max Cap / Min Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{offer.title}</div>
                      <div className="text-xs font-mono text-[#FF6B00] mt-0.5">{offer.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700">
                        <Percent className="w-3.5 h-3.5" />
                        {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <span className="font-semibold text-gray-900">Printing only</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div>Cap: {offer.max_discount_amount ? `₹${offer.max_discount_amount}` : 'None'}</div>
                      <div>Min: ₹{offer.min_order_amount || 0}</div>
                    </td>
                    <td className="px-6 py-4">
                      {offer.is_active === 1 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(offer)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                          offer.is_active === 1
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-green-200 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {offer.is_active === 1 ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-gray-900 mb-4">Create Campaign Offer</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Offer Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CAMPUSFEST30"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-semibold uppercase outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blintzy Campus Fest 30% OFF"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none focus:border-[#FF6B00] bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Value {discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={discountType === 'percentage' ? 100 : undefined}
                    value={discountValue}
                    onChange={e => setDiscountValue(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscountAmount}
                    onChange={e => setMaxDiscountAmount(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={e => setMinOrderAmount(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. Campus Fest — 30% OFF"
                  value={badgeText}
                  onChange={e => setBadgeText(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Terms Text</label>
                <textarea
                  rows={2}
                  value={termsText}
                  onChange={e => setTermsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#FF6B00] rounded focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-800">
                  Activate Offer Immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#FF6B00] text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
