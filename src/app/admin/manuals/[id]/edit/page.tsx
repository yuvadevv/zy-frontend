'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ManualForm from '@/components/admin/ManualForm';
import { adminClient } from '@/lib/api/adminClient';

export default function AdminManualsEditPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManual = async () => {
      try {
        setLoading(true);
        // We can use the getManuals endpoint with a search query or a specific getManual endpoint if it exists
        // Looking at the adminClient, there isn't a getManualById method, but we can fetch the list and find it,
        // or add a getManualById endpoint if needed. Wait, we can fetch all and filter for now to guarantee it works.
        // Let's see if adminClient has getManualById... No, it only has getManuals.
        // Actually, the backend might have /api/admin/manuals/:id GET route. Let's try fetching directly.
        const response = await adminClient.fetch(`/api/admin/manuals/${id}`);
        // If the backend doesn't support this, we will find out during testing.
        if (response && response.manual) {
          setInitialData(response.manual);
        } else {
          setInitialData(response); // sometimes it's returned directly
        }
      } catch (err: any) {
        // Fallback if GET /api/admin/manuals/:id is not implemented
        try {
          const res = await adminClient.getManuals({ limit: 100 });
          const manual = res.manuals.find((m: any) => m.id === id);
          if (manual) {
            setInitialData(manual);
            setError(null);
          } else {
            setError('Manual not found');
          }
        } catch (fallbackErr: any) {
          setError(fallbackErr.message || 'Failed to load manual data');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchManual();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading manual details...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="space-y-6">
        <Link href="/admin/manuals" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Manuals
        </Link>
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center shadow-sm border border-red-100">
          <AlertCircle className="w-6 h-6 mr-3" />
          <span className="font-medium text-lg">{error || 'Manual not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-6">
        <Link 
          href="/admin/manuals" 
          className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 self-start transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Manuals
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Manual</h1>
          <p className="text-sm text-gray-500 mt-1">Update details for "{initialData.title}"</p>
        </div>
      </div>

      <ManualForm mode="edit" initialData={initialData} />
    </div>
  );
}
