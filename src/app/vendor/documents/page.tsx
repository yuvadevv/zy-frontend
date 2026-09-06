'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { FileText, Download, Search, FileDown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function VendorDocumentsPage() {
  const [data, setData] = useState<any>({ documents: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await vendorClient.getDocuments({ search, page, limit: 25 });
      setData(res);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      toast.loading('Preparing download...', { id: 'download' });
      const url = await vendorClient.getDocumentAccessUrl(documentId);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Download started', { id: 'download' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to download file', { id: 'download' });
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Documents
          </h1>
          <p className="text-sm text-gray-500 mt-1">Access all printed documents and uploaded files for your orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/50 p-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search filename, order ID, or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File Details</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order & Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Specs</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && data.documents.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading documents...</td></tr>
              ) : data.documents.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center">
                  <FileDown className="w-12 h-12 text-gray-300 mb-3" />
                  <p>No documents found.</p>
                </td></tr>
              ) : data.documents.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="ml-4 max-w-xs">
                        <div className="text-sm font-bold text-gray-900 truncate" title={doc.original_filename}>{doc.original_filename}</div>
                        <div className="text-xs text-gray-500">{formatSize(doc.file_size)} • {doc.file_type || 'PDF'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/vendor/orders/${doc.order_public_id}`} className="text-sm font-semibold text-[#FF6B00] hover:underline">
                      {doc.order_public_id}
                    </Link>
                    <div className="text-xs text-gray-600 mt-1">{doc.student_name} ({doc.student_roll})</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium">
                      {doc.page_count} Pages
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{new Date(doc.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDownload(doc.id, doc.original_filename)}
                      className="inline-flex items-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page <span className="font-medium">{page}</span> of <span className="font-medium">{data.totalPages}</span></span>
            <button
              disabled={page === data.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
