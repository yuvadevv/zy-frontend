'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Plus, Store, Trash2, Edit2, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form State
  const [formId, setFormId] = useState('');
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isActive, setIsActive] = useState(true);

  const loadData = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminClient.getVendors({ page: currentPage, limit: 25 });
      setVendors(data.vendors || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setError("Access Denied. You do not have permission to view vendors.");
      } else {
        setError(err.message || 'Failed to load vendors data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const openAddModal = () => {
    alert("Backend API for creating vendors is not implemented yet. Please contact an administrator.");
  };

  const openEditModal = (v: any) => {
    alert("Backend API for editing vendors is not implemented yet. Please contact an administrator.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDelete = async (id: string, vendorName: string) => {
    alert("Backend API for deactivating vendors is not implemented yet. Please contact an administrator.");
  };

  const columns: Column<any>[] = [
    {
      header: 'Vendor Details',
      cell: (v) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6B00]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{v.name}</div>
            <div className="text-xs text-gray-500">{v.owner_name}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact Info',
      cell: (v) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
            {v.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
            {v.phone}
          </div>
        </div>
      )
    },
    {
      header: 'Location',
      cell: (v) => (
        <div className="flex items-start text-sm text-gray-600 max-w-[200px]">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 mt-0.5 shrink-0" />
          <span className="line-clamp-2">{v.address}</span>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (v) => <StatusBadge status={v.is_active ? 'Active' : 'Inactive'} variant={v.is_active ? 'success' : 'neutral'} />
    },
    {
      header: 'Actions',
      cell: (v) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => openEditModal(v)}
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(v.id, v.name)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const renderMobileCard = (v: any) => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6B00] shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{v.name}</div>
            <div className="text-xs text-gray-500">{v.owner_name}</div>
          </div>
        </div>
        <StatusBadge status={v.is_active ? 'Active' : 'Inactive'} variant={v.is_active ? 'success' : 'neutral'} />
      </div>
      <div className="bg-gray-50 rounded p-3 space-y-2 mt-2">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
          {v.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
          {v.phone}
        </div>
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400 mt-0.5 shrink-0" />
          <span className="line-clamp-2">{v.address}</span>
        </div>
      </div>
      <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100 gap-4">
        <button
          onClick={() => openEditModal(v)}
          className="text-gray-500 hover:text-black flex items-center gap-1 text-sm font-medium"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <button
          onClick={() => handleDelete(v.id, v.name)}
          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
        >
          <Trash2 className="w-3 h-3" />
          Deactivate
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Vendor Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage print shops, view details, and control access.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            data={vendors}
            columns={columns}
            keyExtractor={(v) => v.id}
            isLoading={loading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            renderMobileCard={renderMobileCard}
            emptyMessage="No vendors found."
          />
        </div>
      )}

      {/* Vendor Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl my-8">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Vendor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input 
                  type="text" required
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. QuickPrint Center"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input 
                  type="text" required
                  value={ownerName} onChange={e => setOwnerName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" required
                    value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                <textarea 
                  required rows={2}
                  value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" id="vendorActive"
                  checked={isActive} onChange={e => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] h-4 w-4"
                />
                <label htmlFor="vendorActive" className="text-sm font-medium text-gray-700">Account Active</label>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] disabled:opacity-50 flex justify-center items-center transition-colors">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
