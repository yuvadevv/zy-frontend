'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Upload, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { AcademicSelector, AcademicSelection } from '@/components/ui/AcademicSelector';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export interface ManualFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
}

export default function ManualForm({ mode, initialData }: ManualFormProps) {
  const router = useRouter();

  // Form State
  const [formId, setFormId] = useState('');
  const [title, setTitle] = useState('');
  const [academic, setAcademic] = useState<AcademicSelection>({ branch_id: '', academic_year_id: '', semester_id: '', subject_id: '' });
  const [vendorId, setVendorId] = useState('');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [availability, setAvailability] = useState('available');
  
  // PDF Source
  const [pdfSource, setPdfSource] = useState<'r2' | 'public_url'>('r2');
  const [publicUrl, setPublicUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Pricing
  const [pricingMode, setPricingMode] = useState<'settings' | 'custom'>('settings');
  const [priceOverride, setPriceOverride] = useState<number | ''>('');

  // App State
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const vData = await (adminClient.getVendors ? adminClient.getVendors() : Promise.resolve({ vendors: [] })) as any;
        if (vData && vData.vendors) setVendors(vData.vendors);

        if (mode === 'edit' && initialData) {
          setFormId(initialData.id);
          setTitle(initialData.title || '');
          setAcademic({ 
            branch_id: initialData.branch_id || '', 
            academic_year_id: initialData.academic_year_id || '', 
            semester_id: initialData.semester_id || '', 
            subject_id: initialData.subject_id || '' 
          });
          setVendorId(initialData.vendor_id || '');
          setDescription(initialData.description || '');
          setPages(initialData.pages || 0);
          setStock(initialData.stock || 0);
          setAvailability(initialData.availability_status || 'available');
          setPdfSource(initialData.pdf_source || 'r2');
          setPublicUrl(initialData.public_url || '');
          setPricingMode(initialData.pricing_mode || 'settings');
          setPriceOverride(initialData.price_override ?? '');
        }

      } catch (err: any) {
        setError(err.message || 'Failed to load dependencies');
      } finally {
        setLoading(false);
      }
    };

    loadDependencies();
  }, [mode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!academic.subject_id) {
      setError('Please select a subject in the Academic Mapping section.');
      setIsSubmitting(false);
      return;
    }

    if (pdfSource === 'public_url' && !publicUrl.trim()) {
      setError('Please provide a valid Public PDF URL.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        title, 
        description, 
        pages, 
        stock,
        availability_status: availability,
        subject_id: academic.subject_id,
        branch_id: academic.branch_id,
        academic_year_id: academic.academic_year_id,
        semester_id: academic.semester_id,
        vendor_id: vendorId || null,
        pdf_source: pdfSource,
        public_url: pdfSource === 'public_url' ? publicUrl : null,
        pricing_mode: pricingMode,
        price_override: pricingMode === 'custom' && priceOverride !== '' ? priceOverride : null
      };

      if (mode === 'edit') {
        if (pdfSource === 'r2' && file) {
            // Need to upload the new file
            const formData = new FormData();
            Object.keys(payload).forEach(key => {
              if (payload[key] !== null) formData.append(key, String(payload[key]));
            });
            formData.append('file', file);
            await adminClient.fetch(`/api/admin/manuals/${formId}/file`, { method: 'POST', body: formData });
        } else {
            await adminClient.updateManual(formId, payload);
        }
      } else {
        if (pdfSource === 'r2' && !file) throw new Error('PDF file is required');
        
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
          if (payload[key] !== null) formData.append(key, String(payload[key]));
        });
        if (file) formData.append('file', file);
        
        await adminClient.createManual(formData);
      }
      
      toast.success(mode === 'create' ? 'Manual uploaded successfully!' : 'Manual updated successfully!');
      router.push('/admin/manuals');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save manual');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewManual = async () => {
    if (pdfSource === 'public_url' && publicUrl) {
      window.open(publicUrl, '_blank');
      return;
    }

    if (!formId) return;
    try {
      setPreviewLoading(true);
      const blob = await adminClient.getManualFileBlob(formId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000 * 60 * 5); 
    } catch (err: any) {
      toast.error(err.message || 'Failed to view manual');
    } finally {
      setPreviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
        <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto mb-10">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center mb-6">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* PDF Source & File */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">PDF File</h3>
          
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="pdfSource" value="r2" checked={pdfSource === 'r2'} onChange={() => setPdfSource('r2')} className="text-[#FF6B00] focus:ring-[#FF6B00]" />
              <span className="text-sm font-medium text-gray-700">R2 Storage (Secure)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="pdfSource" value="public_url" checked={pdfSource === 'public_url'} onChange={() => setPdfSource('public_url')} className="text-[#FF6B00] focus:ring-[#FF6B00]" />
              <span className="text-sm font-medium text-gray-700">Public PDF URL</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pdfSource === 'r2' ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <label className="text-sm font-medium text-[#FF6B00] hover:text-[#e66000] cursor-pointer">
                  <span>{mode === 'edit' ? 'Replace PDF (Optional)' : 'Select a PDF file *'}</span>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    required={mode === 'create'}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {file ? file.name : 'PDF up to 50MB'}
                </p>
                {mode === 'edit' && (
                  <div className="mt-4 flex gap-2">
                    <button 
                      type="button"
                      onClick={handlePreviewManual}
                      disabled={previewLoading}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors inline-block font-medium border border-gray-200 disabled:opacity-50"
                    >
                      {previewLoading ? 'Loading...' : 'View Full Manual'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  Public PDF URL *
                </label>
                <input 
                  type="url" required
                  value={publicUrl} onChange={e => setPublicUrl(e.target.value)}
                  placeholder="https://example.com/manual.pdf"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
                {mode === 'edit' && publicUrl && (
                  <div className="mt-4">
                    <button 
                      type="button"
                      onClick={handlePreviewManual}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors inline-block font-medium border border-gray-200"
                    >
                      View Configured URL
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Academic Mapping */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Mapping</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <AcademicSelector value={academic} onChange={setAcademic} />
          </div>
        </div>

        {/* Manual Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Manual Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input 
                type="text" required
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Data Structures Lab Manual"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor (Optional)</label>
                <select 
                  value={vendorId} onChange={e => setVendorId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                >
                  <option value="">No Vendor (Admin Owned)</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.business_name || v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  value={description} onChange={e => setDescription(e.target.value)}
                  rows={1}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count *</label>
                <input 
                  type="number" required min="0"
                  value={stock === undefined ? '' : stock} onChange={e => setStock(parseInt(e.target.value) || 0)}
                  placeholder="Number of physical copies currently available"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
                <p className="text-xs text-gray-500 mt-1">Number of physical copies currently available.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages Count *</label>
                <input 
                  type="number" required min="1"
                  value={pages || ''} onChange={e => setPages(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Print & Pricing Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing Strategy</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
            
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pricingMode" value="settings" checked={pricingMode === 'settings'} onChange={() => setPricingMode('settings')} className="text-[#FF6B00] focus:ring-[#FF6B00]" />
                <span className="text-sm font-medium text-gray-700">Use Admin Pricing Settings</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pricingMode" value="custom" checked={pricingMode === 'custom'} onChange={() => setPricingMode('custom')} className="text-[#FF6B00] focus:ring-[#FF6B00]" />
                <span className="text-sm font-medium text-gray-700">Custom Manual Pricing</span>
              </label>
            </div>

            {pricingMode === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Override (₹)</label>
                <input 
                  type="number" min="0" step="0.5" required
                  value={priceOverride} onChange={e => setPriceOverride(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="Enter fixed price per copy"
                  className="w-full md:w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
                <p className="text-xs text-gray-500 mt-1">This will override the dynamically calculated price for this manual.</p>
              </div>
            )}
            
            {pricingMode === 'settings' && (
              <p className="text-sm text-gray-500 bg-white p-3 rounded border border-gray-100">
                The price will be automatically calculated at checkout based on the student's selected print type, color mode, binding, and the global Admin Pricing Settings.
              </p>
            )}

          </div>
        </div>

        {/* Availability */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Status</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select 
              value={availability} onChange={e => setAvailability(e.target.value)}
              className="w-full md:w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            >
              <option value="available">Available for Students</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button 
            type="button" 
            onClick={() => router.push('/admin/manuals')} 
            className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-6 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] disabled:opacity-50 flex justify-center items-center transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              mode === 'edit' ? 'Save Changes' : 'Upload Manual'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
