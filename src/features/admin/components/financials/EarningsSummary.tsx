'use client';

import React, { useState, useEffect } from 'react';
import { workerClient } from '@/lib/api/workerClient';
import { TrendingUp, IndianRupee, ShoppingBag, CreditCard, RefreshCw } from 'lucide-react';

interface SummaryData {
  total_orders: number;
  customer_revenue: number;
  vendor_cost: number;
  blintzy_gross: number;
  gateway_fees: number;
  refunds: number;
  blintzy_net: number;
}

interface OrderData {
  internal_id: string;
  public_id: string;
  created_at: number;
  grand_total: number;
  vendor_payable_total: number;
  blintzy_gross_earning: number;
  payment_gateway_fee: number;
  refunds_total: number;
  blintzy_net_earning: number;
  status: string;
  payment_status: string;
  revenue_status: string;
}

export default function EarningsSummary() {
  const [range, setRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sumRes = await workerClient.fetch(`/api/admin/earnings/summary?range=${range}`);
      const ordRes = await workerClient.fetch('/api/admin/earnings/orders');
      setSummary(sumRes.summary);
      setOrders(ordRes.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const StatCard = ({ title, value, icon: Icon, colorClass, prefix = '₹' }: any) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-2 ${colorClass}`}>
            {prefix}{typeof value === 'number' ? value.toFixed(2) : value}
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-gray-50`}>
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
        <div className="flex items-center gap-4">
          <select 
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="border-gray-300 rounded-lg text-sm focus:ring-[#FF6B00] focus:border-[#FF6B00]"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={fetchData} className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading && !summary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Revenue (Customer Paid)" 
            value={summary?.customer_revenue || 0} 
            icon={IndianRupee} 
            colorClass="text-gray-900" 
          />
          <StatCard 
            title="Vendor Payable Cost" 
            value={summary?.vendor_cost || 0} 
            icon={ShoppingBag} 
            colorClass="text-red-600" 
          />
          <StatCard 
            title="BLINTZY Gross Earnings" 
            value={summary?.blintzy_gross || 0} 
            icon={TrendingUp} 
            colorClass="text-green-600" 
          />
          <StatCard 
            title="Paid Orders" 
            value={summary?.total_orders || 0} 
            icon={CreditCard} 
            colorClass="text-blue-600" 
            prefix=""
          />
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Paid Orders Revenue</h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Customer Paid</th>
                  <th className="px-6 py-4 font-medium text-right text-red-600">Vendor Cost</th>
                  <th className="px-6 py-4 font-medium text-right text-green-600">Blintzy Gross</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 50).map(order => (
                  <tr key={order.public_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-blue-600">{order.public_id}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">₹{order.grand_total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-red-600">₹{order.vendor_payable_total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-medium">₹{order.blintzy_gross_earning.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No paid orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
