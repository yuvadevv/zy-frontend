'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Plus, Store, Trash2, Edit2, AlertCircle, Phone, Mail, MapPin, Search, Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form State
  const [formId, setFormId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const loadData = async (currentPage = page, searchQuery = search) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminClient.getVendors({ page: currentPage, limit: 25, search: searchQuery });
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData(1, search);
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormId('');
    setBusinessName('');
    setContactPerson('');
    setUsername('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setAddress('');
    setCity('');
    setState('');
    setPincode('');
    setPassword('');
    setShowPassword(false);
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = async (v: any) => {
    setEditMode(true);
    setFormId(v.id);
    
    // Fetch full details if needed, but we might have enough in the list.
    // Let's fetch full details to be safe
    try {
      const fullVendor = await adminClient.getVendor(v.id);
      setBusinessName(fullVendor.business_name || fullVendor.name || '');
      setContactPerson(fullVendor.contact_person || '');
      setUsername(fullVendor.username || '');
      setEmail(fullVendor.email || '');
      setPhone(fullVendor.phone || '');
      setWhatsapp(fullVendor.whatsapp || '');
      setAddress(fullVendor.address || '');
      setCity(fullVendor.city || '');
      setState(fullVendor.state || '');
      setPincode(fullVendor.pincode || '');
      setIsActive(fullVendor.status === 'active');
      setPassword(''); // Don't prefill password
      setShowModal(true);
    } catch (err) {
      toast.error("Failed to fetch vendor details.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editMode) {
      if (
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
      ) {
        toast.error("Please ensure the temporary password meets all security requirements.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const data = {
        business_name: businessName,
        contact_person: contactPerson,
        username,
        email,
        phone,
        whatsapp,
        address,
        city,
        state,
        pincode,
        ...(editMode ? {} : { password })
      };

      if (editMode) {
        await adminClient.updateVendor(formId, data);
        const newStatus = isActive ? 'active' : 'inactive';
        await adminClient.updateVendorStatus(formId, newStatus);
      } else {
        await adminClient.createVendor(data);
      }

      setShowModal(false);
      loadData();
      toast.success(`Vendor ${editMode ? 'updated' : 'added'} successfully`);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, vendorName: string) => {
    if (window.confirm(`Are you sure you want to deactivate ${vendorName}? They will no longer be able to log in or process orders.`)) {
      try {
        await adminClient.updateVendorStatus(id, 'inactive');
        loadData();
        toast.success(`${vendorName} has been deactivated`);
      } catch (err: any) {
        toast.error(err.message || 'Failed to deactivate vendor');
      }
    }
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
            <Link href={`/admin/vendors/${v.id}`} className="font-semibold text-gray-900 hover:text-[#FF6B00] transition-colors">{v.business_name || v.name}</Link>
            <div className="text-xs text-gray-500">{v.contact_person || v.username}</div>
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
            {v.phone || 'N/A'}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (v) => <StatusBadge status={v.status === 'active' ? 'Active' : 'Inactive'} variant={v.status === 'active' ? 'success' : 'neutral'} />
    },
    {
      header: 'Actions',
      cell: (v) => (
        <div className="flex justify-end space-x-2">
          <Link
            href={`/admin/vendors/${v.id}`}
            className="p-1.5 text-gray-500 hover:text-[#FF6B00] hover:bg-orange-50 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => openEditModal(v)}
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
            title="Edit Vendor"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(v.id, v.business_name || v.name)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title={v.status === 'active' ? 'Deactivate' : 'Already Inactive'}
            disabled={v.status !== 'active'}
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
            <Link href={`/admin/vendors/${v.id}`} className="font-semibold text-gray-900 hover:text-[#FF6B00] transition-colors">{v.business_name || v.name}</Link>
            <div className="text-xs text-gray-500">{v.contact_person || v.username}</div>
          </div>
        </div>
        <StatusBadge status={v.status === 'active' ? 'Active' : 'Inactive'} variant={v.status === 'active' ? 'success' : 'neutral'} />
      </div>
      <div className="bg-gray-50 rounded p-3 space-y-2 mt-2">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
          {v.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
          {v.phone || 'N/A'}
        </div>
      </div>
      <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100 gap-4">
        <Link
          href={`/admin/vendors/${v.id}`}
          className="text-gray-500 hover:text-[#FF6B00] flex items-center gap-1 text-sm font-medium"
        >
          <Eye className="w-3 h-3" />
          View
        </Link>
        <button
          onClick={() => openEditModal(v)}
          className="text-gray-500 hover:text-black flex items-center gap-1 text-sm font-medium"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        {v.status === 'active' && (
          <button
            onClick={() => handleDelete(v.id, v.business_name || v.name)}
            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
          >
            <Trash2 className="w-3 h-3" />
            Deactivate
          </button>
        )}
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

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors by name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
          />
        </form>
        <button 
          onClick={handleSearch}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Search
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
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Vendor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input 
                    type="text" required
                    value={businessName} onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. QuickPrint Center"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input 
                    type="text" required
                    value={contactPerson} onChange={e => setContactPerson(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Login Username</label>
                  <input 
                    type="text" required disabled={editMode}
                    value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                {!editMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                    <div className="relative mb-2">
                      <input 
                        type={showPassword ? "text" : "password"} required
                        value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="space-y-1 mt-1.5">
                      <div className={`flex items-center text-xs ${password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                        {password.length >= 6 ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                        At least 6 characters
                      </div>
                      <div className={`flex items-center text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[A-Z]/.test(password) ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                        One uppercase letter
                      </div>
                      <div className={`flex items-center text-xs ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[a-z]/.test(password) ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                        One lowercase letter
                      </div>
                      <div className={`flex items-center text-xs ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[0-9]/.test(password) ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                        One number
                      </div>
                      <div className={`flex items-center text-xs ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                        {/[^A-Za-z0-9]/.test(password) ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                        One symbol
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    type="tel"
                    value={phone} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setPhone(val);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                <textarea 
                  rows={2}
                  value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              {editMode && (
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                  <input 
                    type="checkbox" id="vendorActive"
                    checked={isActive} onChange={e => setIsActive(e.target.checked)}
                    className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] h-4 w-4"
                  />
                  <label htmlFor="vendorActive" className="text-sm font-medium text-gray-700">Account Active (Vendor can log in and process orders)</label>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
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
