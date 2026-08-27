'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Plus, AlertCircle, Edit2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';

const ENTITIES = [
  { id: 'colleges', label: 'Colleges', fields: ['name', 'status'] },
  { id: 'branches', label: 'Branches', fields: ['college_id', 'code', 'name', 'status'] },
  { id: 'academic_years', label: 'Academic Years', fields: ['label', 'value', 'status'] },
  { id: 'semesters', label: 'Semesters', fields: ['academic_year_id', 'label', 'value', 'status'] },
  { id: 'sections', label: 'Sections', fields: ['name', 'status'] },
  { id: 'blocks', label: 'Blocks', fields: ['college_id', 'name', 'status'] },
  { id: 'classrooms', label: 'Classrooms', fields: ['block_id', 'name', 'status'] },
  { id: 'subjects', label: 'Subjects', fields: ['branch_id', 'semester_id', 'code', 'name', 'status'] },
];

export default function AcademicManagementPage() {
  const [activeTab, setActiveTab] = useState(ENTITIES[0].id);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<any>({});
  
  // For relations
  const [relatedData, setRelatedData] = useState<Record<string, any[]>>({});

  const activeEntityConfig = ENTITIES.find(e => e.id === activeTab)!;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load main entity data
      const res = activeTab === 'subjects' 
        ? await adminClient.getSubjects() 
        : await adminClient.getAcademicEntity(activeTab);
        
      setData(res[activeTab] || []);
      
      // Load related data for dropdowns
      if (activeEntityConfig.fields.includes('college_id')) {
        const c = await adminClient.getAcademicEntity('colleges');
        setRelatedData(prev => ({ ...prev, colleges: c.colleges || [] }));
      }
      if (activeEntityConfig.fields.includes('branch_id')) {
        const b = await adminClient.getAcademicEntity('branches');
        setRelatedData(prev => ({ ...prev, branches: b.branches || [] }));
      }
      if (activeEntityConfig.fields.includes('semester_id')) {
        const s = await adminClient.getAcademicEntity('semesters');
        setRelatedData(prev => ({ ...prev, semesters: s.semesters || [] }));
      }
      if (activeEntityConfig.fields.includes('block_id')) {
        const b = await adminClient.getAcademicEntity('blocks');
        setRelatedData(prev => ({ ...prev, blocks: b.blocks || [] }));
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formState.id) {
        if (activeTab === 'subjects') {
          // Subject update not fully generic in backend yet, handled via generic patch if added, else skip
        } else {
          await adminClient.updateAcademicEntity(activeTab, formState.id, formState);
        }
      } else {
        if (activeTab === 'subjects') {
          await adminClient.createSubject(formState);
        } else {
          await adminClient.createAcademicEntity(activeTab, formState);
        }
      }
      setShowModal(false);
      setFormState({});
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    try {
      if (activeTab !== 'subjects') {
        await adminClient.updateAcademicEntity(activeTab, item.id, { status: newStatus });
        loadData();
      }
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete this ${activeEntityConfig.label.slice(0, -1).toLowerCase()}?`)) return;
    try {
      if (activeTab === 'subjects') {
        // Not implemented in generic backend yet, handled via separate route if needed
        alert('Subject deletion not implemented yet');
      } else {
        await adminClient.deleteAcademicEntity(activeTab, item.id);
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const openAddModal = () => {
    setFormState({ status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setFormState({ ...item });
    setShowModal(true);
  };

  const columns: Column<any>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (item) => <span className="font-semibold text-gray-900">{item.name || item.label || item.code}</span>
    },
    ...activeEntityConfig.fields.filter(f => !['name', 'label', 'status'].includes(f)).map(f => ({
      header: f.replace('_id', '').toUpperCase(),
      accessorKey: f
    })),
    {
      header: 'Status',
      cell: (item) => (
        <button 
          onClick={() => handleToggleStatus(item)}
          className={`px-3 py-1 text-xs font-medium rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {item.status === 'active' ? 'Active' : 'Inactive'}
        </button>
      )
    },
    {
      header: 'Action',
      cell: (item) => (
        <div className="flex items-center space-x-3">
          <button onClick={() => openEditModal(item)} className="text-gray-500 hover:text-black transition-colors" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Academic Setup</h1>
          <p className="text-sm text-gray-500 mt-1">Manage colleges, branches, classrooms, and more.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add {activeEntityConfig.label}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {ENTITIES.map(entity => (
          <button
            key={entity.id}
            onClick={() => setActiveTab(entity.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === entity.id ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {entity.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          data={data}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={loading}
          emptyMessage={`No ${activeEntityConfig.label.toLowerCase()} found.`}
          renderMobileCard={(item) => (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-900">{item.name || item.label || item.code}</div>
                <div className="text-sm text-gray-500">{item.status}</div>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => openEditModal(item)} className="text-[#FF6B00] text-sm hover:underline">Edit</button>
                <button onClick={() => handleDelete(item)} className="text-red-500 text-sm hover:underline">Delete</button>
              </div>
            </div>
          )}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{formState.id ? 'Edit' : 'Add'} {activeEntityConfig.label}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {activeEntityConfig.fields.filter(f => f !== 'status').map(field => {
                if (field.endsWith('_id')) {
                  let relationKey = field.replace('_id', 's'); // hacky pluralization
                  if (relationKey === 'branchs') relationKey = 'branches';
                  const options = relatedData[relationKey] || [];
                  return (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace('_id', '')}</label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                        value={formState[field] || ''}
                        onChange={(e) => setFormState({ ...formState, [field]: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {options.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.name || opt.label || opt.code}</option>
                        ))}
                      </select>
                    </div>
                  );
                }
                
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                      value={formState[field] || ''}
                      onChange={(e) => setFormState({ ...formState, [field]: e.target.value })}
                    />
                  </div>
                );
              })}
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#e66000] disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
