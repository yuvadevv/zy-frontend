'use client';

import { useState, useEffect } from 'react';
import { workerClient } from '@/lib/api/workerClient';
import { AlertTriangle, RefreshCw, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudentRefundsPage() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        const data = await workerClient.getRefundHistory();
        setRefunds(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch refunds');
      } finally {
        setLoading(false);
      }
    };
    fetchRefunds();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/app/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <RefreshCw className="w-6 h-6 mr-2 text-gray-700" />
            Refund History
          </h1>
          <p className="text-sm text-gray-500 mt-1">View the status of any refunds issued for your orders.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : refunds.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-gray-100">
          <RefreshCw className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No refunds</h3>
          <p className="text-gray-500 mt-2">You haven't received any refunds yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Refund ID</th>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{refund.public_refund_id}</td>
                    <td className="px-6 py-4 text-blue-600 hover:underline">
                      <Link href={`/app/orders/${refund.order_public_id}`}>
                        {refund.order_public_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600">₹{refund.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        refund.status === 'processed' ? 'bg-green-100 text-green-700' :
                        refund.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(refund.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
