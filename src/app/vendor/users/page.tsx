'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorClient } from '@/lib/api/vendorClient';
import { Users, Search, BookOpen, AlertCircle, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function VendorUsersPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vendorClient.getOrders({ limit: 200 });
      
      const studentMap = new Map();
      data.orders.forEach((o: any) => {
        if (!o.student || !o.student.name) return;
        
        const rollNumber = o.student.rollNumber;
        if (!studentMap.has(rollNumber)) {
          studentMap.set(rollNumber, {
            ...o.student,
            academic: o.academic,
            orderCount: 1,
            latestOrder: o.publicId,
            latestOrderStatus: o.status,
            latestOrderDate: o.createdAt
          });
        } else {
          const s = studentMap.get(rollNumber);
          s.orderCount += 1;
          if (new Date(o.createdAt) > new Date(s.latestOrderDate)) {
            s.latestOrder = o.publicId;
            s.latestOrderStatus = o.status;
            s.latestOrderDate = o.createdAt;
          }
        }
      });
      
      setStudents(Array.from(studentMap.values()));
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredStudents = students.filter(s => 
    search === '' || 
    s.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-[#FF6B00]" />
            Student Customers
          </h1>
          <p className="text-sm text-gray-500 mt-1">All students from the global BLINTZY order pool.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/50 p-4">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Name, Roll, Mobile, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#FF6B00] focus:border-[#FF6B00]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading student directory...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">{error}</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium flex flex-col items-center">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <p>No students found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Academic</th>
                  <th className="px-5 py-4">Orders</th>
                  <th className="px-5 py-4">Latest Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((s, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 text-base">{s.name}</div>
                      <div className="text-sm font-semibold text-[#FF6B00]">{s.rollNumber}</div>
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                         <div className="flex items-center gap-1"><Phone className="w-3 h-3"/> {s.phone}</div>
                         <div className="flex items-center gap-1"><Mail className="w-3 h-3"/> {s.email}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 p-2 rounded-lg inline-block">
                        {s.academic?.branchCode || '-'} • {s.academic?.yearLabel || '-'} • {s.academic?.semesterLabel || '-'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-xl text-gray-900">{s.orderCount}</div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Orders</div>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/vendor/orders/${s.latestOrder}`} className="font-mono text-sm font-bold text-blue-600 hover:underline">
                        {s.latestOrder}
                      </Link>
                      <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Status: {s.latestOrderStatus}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
