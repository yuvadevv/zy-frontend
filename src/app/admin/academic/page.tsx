'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Plus, BookOpen, Layers, GraduationCap, AlertCircle, Edit2 } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';

export default function AcademicManagementPage() {
  const [activeTab, setActiveTab] = useState<'branches' | 'subjects'>('branches');
  
  const [branches, setBranches] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms — only fields that exist in D1: branches(id,code,name) subjects(id,branch_id,semester_id,code,name)
  const [branchForm, setBranchForm] = useState({ id: '', code: '', name: '' });
  const [subjectForm, setSubjectForm] = useState({ branch_id: '', semester: '', code: '', name: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [branchesData, subjectsData] = await Promise.all([
        adminClient.getBranches(),
        adminClient.getSubjects()
      ]);
      setBranches(branchesData.branches || branchesData || []);
      setSubjects(subjectsData.subjects || subjectsData || []);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setError("Access Denied. You need the 'academic.manage' permission.");
      } else {
        setError(err.message || 'Failed to load academic data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (branchForm.id) {
        await adminClient.updateBranch(branchForm.id, branchForm);
      } else {
        await adminClient.createBranch(branchForm);
      }
      setShowBranchModal(false);
      setBranchForm({ id: '', code: '', name: '' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminClient.createSubject(subjectForm);
      setShowSubjectModal(false);
      setSubjectForm({ branch_id: '', semester: '', code: '', name: '' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const branchColumns: Column<any>[] = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (b) => <span className="font-semibold text-gray-900">{b.code}</span>
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Action',
      cell: (b) => (
        <div className="flex justify-end">
          <button
            onClick={() => { setBranchForm({ id: b.id, code: b.code, name: b.name }); setShowBranchModal(true); }}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const subjectColumns: Column<any>[] = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (s) => <span className="font-semibold text-gray-900">{s.code}</span>
    },
    {
      header: 'Name',
      cell: (s) => (
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span>{s.name}</span>
        </div>
      )
    },
    {
      header: 'Branch',
      accessorKey: 'branch_name',
      cell: (s) => <span className="text-gray-600">{s.branch_name}</span>
    },
    {
      header: 'Semester',
      cell: (s) => (
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">Sem {s.semester_id}</span>
      )
    }
  ];

  const renderMobileBranchCard = (b: any) => (
    <div className="flex justify-between items-center">
      <div>
        <div className="font-semibold text-gray-900">{b.code}</div>
        <div className="text-sm text-gray-500">{b.name}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => { setBranchForm({ id: b.id, code: b.code, name: b.name }); setShowBranchModal(true); }}
          className="text-[#FF6B00] text-sm hover:underline flex items-center gap-1"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
      </div>
    </div>
  );

  const renderMobileSubjectCard = (s: any) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-gray-900">{s.code}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> {s.name}
          </div>
        </div>
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">Sem {s.semester_id}</span>
      </div>
      <div className="flex justify-between items-center text-sm mt-1">
        <span className="text-gray-600">{s.branch_name}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Academic Mapping</h1>
          <p className="text-sm text-gray-500 mt-1">Configure branches, semesters, and subject syllabus structures.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => { setBranchForm({ id: '', code: '', name: '' }); setShowBranchModal(true); }}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Branch</span>
          </button>
          <button 
            onClick={() => { setSubjectForm({ ...subjectForm, branch_id: branches[0]?.id || '' }); setShowSubjectModal(true); }}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
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
          onClick={() => setActiveTab('branches')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'branches' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers className="w-4 h-4 mr-2" />
          Branches
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'subjects' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Subjects
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'branches' && (
          <DataTable
            data={branches}
            columns={branchColumns}
            keyExtractor={(b) => b.id}
            isLoading={loading}
            emptyMessage="No branches configured."
            renderMobileCard={renderMobileBranchCard}
          />
        )}

        {activeTab === 'subjects' && (
          <DataTable
            data={subjects}
            columns={subjectColumns}
            keyExtractor={(s) => s.id}
            isLoading={loading}
            emptyMessage="No subjects configured."
            renderMobileCard={renderMobileSubjectCard}
          />
        )}
      </div>

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{branchForm.id ? 'Edit' : 'Add'} Branch</h2>
            <form onSubmit={handleBranchSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code (e.g. CSE)</label>
                <input 
                  type="text" required disabled={!!branchForm.id}
                  value={branchForm.code} onChange={e => setBranchForm({...branchForm, code: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={branchForm.name} onChange={e => setBranchForm({...branchForm, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowBranchModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] disabled:opacity-50 flex justify-center items-center transition-colors">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Subject</h2>
            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <select 
                  required value={subjectForm.branch_id} onChange={e => setSubjectForm({...subjectForm, branch_id: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                >
                  <option value="">Select Branch...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester ID (e.g. s_1)</label>
                <input 
                  type="text" required
                  placeholder="e.g. s_1, s_2"
                  value={subjectForm.semester} onChange={e => setSubjectForm({...subjectForm, semester: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code (e.g. CS101)</label>
                <input 
                  type="text" required
                  value={subjectForm.code} onChange={e => setSubjectForm({...subjectForm, code: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input 
                  type="text" required
                  value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] disabled:opacity-50 flex justify-center items-center transition-colors">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
