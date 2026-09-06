import React, { useEffect, useState } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { vendorClient } from '@/lib/api/vendorClient';
import { BookOpen, Users, Package, AlertCircle } from 'lucide-react';
import { formatMoney } from '@/utils/formatters';

export default function CommonManualBatches({ 
  onSelectBatch,
  clientType = 'admin'
}: { 
  onSelectBatch: (filters: { manual_id: string, branch: string, year: string, semester: string }) => void,
  clientType?: 'admin' | 'vendor'
}) {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const client = clientType === 'vendor' ? vendorClient : adminClient;
        const res = await client.getCommonManualBatches();
        setBatches(res.batches || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="h-24 bg-gray-50 rounded-xl animate-pulse"></div>;
  if (batches.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold text-gray-500 mb-3 tracking-wider uppercase">Common Manual Batches</h2>
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
        {batches.map((batch, idx) => (
          <div key={idx} className="min-w-[300px] max-w-[350px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm snap-start hover:border-[#FF6B00] hover:shadow-md transition-all">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">{batch.manualTitle}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {batch.branchCode} • {batch.yearLabel} • {batch.semesterLabel}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-[10px] font-bold text-gray-500">STUDENTS</div>
                  <div className="text-sm font-bold text-gray-900">{batch.studentCount}</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-[10px] font-bold text-gray-500">COPIES</div>
                  <div className="text-sm font-bold text-gray-900">{batch.copyCount}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <span className="text-green-600 font-bold">{batch.readyCount} Ready</span> • {batch.printingCount} Ptg
              </div>
              <button 
                onClick={() => onSelectBatch({
                  manual_id: batch.manualId,
                  branch: batch.branchId,
                  year: batch.yearId,
                  semester: batch.semesterId
                })}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#FF6B00] hover:text-white rounded-lg text-xs font-bold transition-colors"
              >
                View Orders
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
