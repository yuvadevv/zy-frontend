'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Plus, Trash2, FileText, Edit2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

export default function AdminManualsPage() {
  const [manuals, setManuals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);
      const manualsData = await adminClient.getManuals({ page: currentPage, limit: 25 });
      setManuals(manualsData.manuals);
      setTotalPages(manualsData.totalPages || 1);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setError("Access Denied. You need the 'manuals.manage' permission.");
      } else {
        setError(err.message || 'Failed to load manuals');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleDelete = async (id: string, manualTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${manualTitle}"? This will also remove the PDF file from storage.`)) return;
    
    try {
      await adminClient.deleteManual(id);
      loadData(page);
      toast.success('Manual deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete manual');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Title',
      cell: (m) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{m.title}</div>
            <div className="text-xs text-gray-500 truncate max-w-[200px]">{m.description || 'No description'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Subject',
      cell: (m) => (
        <div>
          <div className="text-gray-900 font-medium">{m.subject_code}</div>
          <div className="text-xs text-gray-500">{m.subject_name}</div>
        </div>
      )
    },
    {
      header: 'Pages',
      accessorKey: 'pages',
      cell: (m) => <span className="text-gray-600 font-medium">{m.pages}</span>
    },
    {
      header: 'Base Price',
      cell: (m) => <span className="font-bold text-gray-900">₹{m.base_price.toFixed(2)}</span>
    },
    {
      header: 'Stock',
      cell: (m) => (
        <span className={`font-semibold ${m.stock > 10 ? 'text-green-600' : m.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
          {m.stock}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (m) => <StatusBadge status={m.availability_status} variant={m.availability_status === 'available' ? 'success' : 'neutral'} />
    },
    {
      header: 'Actions',
      cell: (m) => (
        <div className="flex justify-end space-x-2">
          <Link
            href={`/admin/manuals/${m.id}/edit`}
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(m.id, m.title)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const renderMobileCard = (m: any) => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 line-clamp-1">{m.title}</div>
            <div className="text-xs text-gray-500">{m.subject_code} - {m.subject_name}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="font-bold text-gray-900">₹{m.base_price.toFixed(2)}</span>
          <span className="text-gray-500 text-xs ml-2">({m.pages} pages)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${m.stock > 10 ? 'text-green-600' : m.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
            Stock: {m.stock}
          </span>
          <StatusBadge status={m.availability_status} variant={m.availability_status === 'available' ? 'success' : 'neutral'} />
        </div>
      </div>
      <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100 gap-4">
        <Link
          href={`/admin/manuals/${m.id}/edit`}
          className="text-gray-500 hover:text-black flex items-center gap-1 text-sm font-medium"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </Link>
        <button
          onClick={() => handleDelete(m.id, m.title)}
          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manuals CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage academic lab manuals.</p>
        </div>
        <Link 
          href="/admin/manuals/upload"
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#e66000] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Manual</span>
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            data={manuals}
            columns={columns}
            keyExtractor={(m) => m.id}
            isLoading={loading}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            renderMobileCard={renderMobileCard}
            emptyMessage="No manuals found. Upload a PDF manual to get started."
          />
        </div>
      )}
    </div>
  );
}
