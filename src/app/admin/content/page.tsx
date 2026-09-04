'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Plus, Image as ImageIcon, Bell, Trash2, Edit2, AlertCircle, Calendar, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'announcements'>('banners');
  
  const [banners, setBanners] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Forms
  const [formId, setFormId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [theme, setTheme] = useState('orange');
  const [icon, setIcon] = useState('clock');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(1);
  const [type, setType] = useState('info'); // for announcements
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminClient.getContent();
      setBanners(data.content?.filter((c: any) => c.type === 'banner') || []);
      setAnnouncements(data.content?.filter((c: any) => c.type === 'announcement') || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load content data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddBanner = () => {
    setEditMode(false);
    setFormId('');
    setTitle('');
    setDescription('');
    setLinkUrl('');
    setCtaLabel('');
    setTheme('orange');
    setIcon('clock');
    setStartTime('');
    setEndTime('');
    setIsActive(true);
    setPriority(1);
    setImageFile(null);
    setImagePreviewUrl(null);
    setShowBannerModal(true);
  };

  const openEditBanner = (b: any) => {
    setEditMode(true);
    setFormId(b.id);
    setTitle(b.title || '');
    setDescription(b.description || '');
    setLinkUrl(b.link_url || '');
    setCtaLabel(b.cta_label || '');
    setTheme(b.theme || 'orange');
    setIcon(b.icon || 'clock');
    
    const formatTime = (ts: number | null) => ts ? new Date(ts).toISOString().slice(0, 16) : '';
    setStartTime(formatTime(b.start_time));
    setEndTime(formatTime(b.end_time));
    
    setIsActive(b.is_active);
    setPriority(b.priority || 1);
    setImageFile(null);
    setImagePreviewUrl(b.image_url ? `${process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8500'}/api/public/${b.image_url}` : null);
    setShowBannerModal(true);
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    try {
      await adminClient.deleteContent(id);
      loadData();
      toast.success('Content deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const openAddAnnouncement = () => {
    setEditMode(false);
    setFormId('');
    setTitle('');
    setDescription('');
    setType('info');
    setIsActive(true);
    setPriority(1);
    setShowAnnouncementModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not found'));
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Blob conversion failed'));
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: "image/webp",
            });
            resolve(webpFile);
          }, 'image/webp', 0.85);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = '';
      
      // Upload image first if present
      if (imageFile) {
        const webpFile = await convertToWebP(imageFile);
        const formData = new FormData();
        formData.append('file', webpFile);
        formData.append('type', 'banner_image');
        
        const uploadRes = await adminClient.uploadContentMedia(formData);
        imageUrl = uploadRes.key || uploadRes.url;
      }
      
      // Save banner metadata
      const bannerData = {
        title,
        type: 'banner',
        description,
        link_url: linkUrl,
        cta_label: ctaLabel,
        theme,
        icon,
        image_url: imageUrl,
        is_active: isActive,
        priority,
        start_time: startTime ? new Date(startTime).getTime() : null,
        end_time: endTime ? new Date(endTime).getTime() : null,
      };
      
      if (editMode && formId) {
        await adminClient.updateContent(formId, bannerData);
      } else {
        if (!imageUrl) throw new Error('Banner image is required');
        await adminClient.createContent(bannerData);
      }

      setShowBannerModal(false);
      loadData();
      toast.success('Banner saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const announcementData = {
        title,
        type: 'announcement',
        description,
        is_active: isActive,
        priority,
        metadata: { announcement_type: type, theme: type }
      };

      if (editMode && formId) {
        await adminClient.updateContent(formId, announcementData);
      } else {
        await adminClient.createContent(announcementData);
      }
      
      setShowAnnouncementModal(false);
      loadData();
      toast.success('Announcement saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bannerColumns: Column<any>[] = [
    {
      header: 'Preview',
      cell: (b) => (
        <div className="w-24 h-12 rounded bg-gray-100 overflow-hidden relative border border-gray-200">
          {b.image_url ? (
            <img 
              src={`${process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8500'}/api/public/${b.image_url}`} 
              alt={b.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Title & Link',
      cell: (b) => (
        <div>
          <div className="font-medium text-gray-900">{b.title}</div>
          <div className="text-xs text-blue-500 hover:underline">{b.link_url || 'No link'}</div>
        </div>
      )
    },
    {
      header: 'Priority',
      cell: (b) => <span className="text-gray-600 font-medium">{b.priority}</span>
    },
    {
      header: 'Status',
      cell: (b) => <StatusBadge status={b.is_active ? 'Active' : 'Inactive'} variant={b.is_active ? 'success' : 'neutral'} />
    },
    {
      header: 'Action',
      cell: (b) => (
        <div className="flex justify-end space-x-2">
          <button onClick={() => openEditBanner(b)} className="text-gray-500 hover:text-black transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteContent(b.id)} className="text-red-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const announcementColumns: Column<any>[] = [
    {
      header: 'Announcement',
      cell: (a) => (
        <div className="flex items-start space-x-3">
          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
            a.type === 'warning' ? 'bg-yellow-500' : 
            a.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
          }`} />
          <div>
            <div className="font-medium text-gray-900">{a.title}</div>
            <div className="text-xs text-gray-500 line-clamp-1 max-w-sm">{a.description}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      cell: (a) => <span className="text-gray-600 capitalize text-sm">{a.type}</span>
    },
    {
      header: 'Priority',
      cell: (a) => <span className="text-gray-600 font-medium">{a.priority}</span>
    },
    {
      header: 'Status',
      cell: (a) => <StatusBadge status={a.is_active ? 'Active' : 'Inactive'} variant={a.is_active ? 'success' : 'neutral'} />
    },
    {
      header: 'Action',
      cell: (a) => (
        <div className="flex justify-end space-x-2">
          <button className="text-gray-500 hover:text-black transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="text-red-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Content Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage app banners, announcements, and dynamic content.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={openAddBanner}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Add Banner</span>
          </button>
          <button 
            onClick={openAddAnnouncement}
            className="flex items-center space-x-2 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'banners' ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Banners
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'announcements' ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bell className="w-4 h-4 mr-2" />
          Announcements
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'banners' && (
          <DataTable
            data={banners}
            columns={bannerColumns}
            keyExtractor={(b) => b.id}
            isLoading={loading}
            emptyMessage="No banners configured."
          />
        )}

        {activeTab === 'announcements' && (
          <DataTable
            data={announcements}
            columns={announcementColumns}
            keyExtractor={(a) => a.id}
            isLoading={loading}
            emptyMessage="No announcements configured."
          />
        )}
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl my-8">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Banner</h2>
            <form onSubmit={handleBannerSubmit} className="space-y-5">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden relative bg-gray-50 flex items-center justify-center h-40">
                  {imagePreviewUrl ? (
                    <>
                      <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <label className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium cursor-pointer">
                          Change Image
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Upload className="w-8 h-8 mb-2" />
                      <label className="text-sm font-medium text-[#FF6B00] hover:text-[#e66000] cursor-pointer">
                        <span>Click to upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} required={!editMode} />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Recommended: 1200x400 PNG or JPG</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Internal Reference)</label>
                <input 
                  type="text" required
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                <input 
                  type="text"
                  value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                  placeholder="e.g. /app/services/manuals"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input 
                    type="text"
                    value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Get tomorrow delivery."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Label</label>
                  <input 
                    type="text"
                    value={ctaLabel} onChange={e => setCtaLabel(e.target.value)}
                    placeholder="e.g. Print Now"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme / Background</label>
                  <select 
                    value={theme} onChange={e => setTheme(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  >
                    <option value="orange">Orange Gradient</option>
                    <option value="purple">Purple Gradient</option>
                    <option value="blue">Blue Gradient</option>
                    <option value="green">Green Gradient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon / Illustration</label>
                  <select 
                    value={icon} onChange={e => setIcon(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  >
                    <option value="clock">Clock (Urgent/Time)</option>
                    <option value="ticket">Ticket (Hall Tickets)</option>
                    <option value="document">Document (Assignments)</option>
                    <option value="book">Book (Manuals)</option>
                    <option value="image">Image / Graphic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
                  <input 
                    type="datetime-local"
                    value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                  <input 
                    type="datetime-local"
                    value={endTime} onChange={e => setEndTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (1 = Highest)</label>
                  <input 
                    type="number" min="1" required
                    value={Number.isNaN(priority) ? '' : priority} onChange={e => setPriority(parseInt(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" id="bannerActive"
                      checked={isActive} onChange={e => setIsActive(e.target.checked)}
                      className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] h-4 w-4"
                    />
                    <label htmlFor="bannerActive" className="text-sm font-medium text-gray-700">Active (Visible)</label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowBannerModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] disabled:opacity-50 flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl my-8">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'New'} Announcement</h2>
            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" required
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  required rows={4}
                  value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    value={type} onChange={e => setType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input 
                    type="number" min="1" required
                    value={Number.isNaN(priority) ? '' : priority} onChange={e => setPriority(parseInt(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" id="announceActive"
                  checked={isActive} onChange={e => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] h-4 w-4"
                />
                <label htmlFor="announceActive" className="text-sm font-medium text-gray-700">Publish immediately</label>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAnnouncementModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] disabled:opacity-50 flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
