'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Store, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ShoppingBag, 
  ArrowRight,
  Filter,
  Loader2,
  Calendar,
  CreditCard,
  Banknote,
  Sparkles,
  QrCode
} from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';
import { APP_ROUTES } from '@/constants/routes';

type TabType = 'all' | 'active' | 'ready_for_pickup' | 'completed' | 'cancelled';

export default function FoodOrdersListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load orders from backend
  const fetchOrders = async (status: TabType) => {
    try {
      setLoading(true);
      setError(null);
      const res = await workerClient.getFoodOrders();
      const resData = res.data || res;
      let orderList = Array.isArray(resData.orders) ? resData.orders : [];

      // Filter locally or by backend query
      if (status === 'active') {
        orderList = orderList.filter((o: any) => ['confirmed', 'accepted', 'preparing', 'PLACED', 'PREPARING'].includes(o.order_status || o.orderStatus || o.status));
      } else if (status === 'ready_for_pickup') {
        orderList = orderList.filter((o: any) => ['ready_for_pickup', 'ready', 'READY_FOR_PICKUP'].includes(o.order_status || o.orderStatus || o.status));
      } else if (status === 'completed') {
        orderList = orderList.filter((o: any) => ['completed', 'collected', 'picked_up', 'COMPLETED'].includes(o.order_status || o.orderStatus || o.status));
      } else if (status === 'cancelled') {
        orderList = orderList.filter((o: any) => ['cancelled', 'rejected', 'CANCELLED'].includes(o.order_status || o.orderStatus || o.status));
      }

      setOrders(orderList);
    } catch (err: any) {
      console.error('Failed to fetch food orders:', err);
      setError('Could not load your food orders. Please pull to refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'all', label: 'All Orders' },
    { id: 'active', label: 'Active' },
    { id: 'ready_for_pickup', label: 'Ready for Pickup' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusBadge = (statusStr?: string) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'ready_for_pickup' || s === 'ready') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
          Ready for Pickup
        </span>
      );
    }
    if (s === 'preparing') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
          Preparing
        </span>
      );
    }
    if (s === 'confirmed' || s === 'placed' || s === 'accepted') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
          Confirmed
        </span>
      );
    }
    if (s === 'completed' || s === 'collected' || s === 'picked_up') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-300">
          Picked Up
        </span>
      );
    }
    if (s === 'cancelled' || s === 'rejected') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
          Cancelled
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700">
        {statusStr || 'Placed'}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col pb-32 select-none min-h-screen bg-white">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 -mx-3.5 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#151515] active:scale-95 transition flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Back to Campus Food"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-base font-black text-[#151515] tracking-tight">
              Food Order History
            </h1>
            <span className="text-[10.5px] font-bold text-gray-400">
              Campus Canteen & Mess Pickups
            </span>
          </div>
        </div>

        {/* Link to Printing orders for clear separation */}
        <button
          onClick={() => router.push('/app/orders')}
          className="text-[11px] font-bold text-gray-500 hover:text-[#151515] active:scale-95 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200/80 transition"
        >
          Print Orders →
        </button>
      </header>

      {/* 2. TAB NAVIGATION (Part 2) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 -mx-3.5 px-4 scrollbar-none border-b border-gray-150">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#151515] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. ORDER LIST CONTENT */}
      <div className="flex flex-col gap-3.5 pt-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
            <span className="text-xs font-semibold">Loading food orders...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchOrders(activeTab)}
              className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00] flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 stroke-[2]" />
            </div>
            <h2 className="text-base font-black text-[#151515]">
              No {activeTab === 'all' ? '' : activeTab.replace('_', ' ')} food orders found
            </h2>
            <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
              When you order meals or snacks from the canteen or mess, they will appear right here.
            </p>
            <button
              onClick={() => router.push(APP_ROUTES.CAMPUS_FOOD)}
              className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF6B00] text-white text-xs font-black shadow-sm"
            >
              <span>Order Food Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const orderId = order.id || order.order_id || order.orderNumber || order.order_number;
            const orderNumber = order.order_number || order.orderNumber || order.orderId || orderId;
            const tokenNumber = order.token_number || order.tokenNumber || 'Token Pending';
            const vendorName = order.vendor_name || order.vendorName || 'Campus Counter';
            const counterLocation = order.counter_location || order.counterLocation || 'Ground Floor';
            const items = order.items || [];
            const grandTotal = order.grand_total ?? order.grandTotal ?? 0;
            const paymentMethod = order.payment_method || order.paymentMethod || 'ONLINE_UPI';
            const paymentStatus = order.payment_status || order.paymentStatus || 'pending';
            const fulfilmentStatus = order.order_status || order.orderStatus || order.status || 'placed';
            const createdAt = order.created_at || order.createdAt ? new Date(order.created_at || order.createdAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short'
            }) : 'Today';

            return (
              <div
                key={order.id}
                onClick={() => router.push(`/app/campus-food/orders/${order.id}`)}
                className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-orange-300 shadow-2xs transition-all flex flex-col gap-3 cursor-pointer group active:scale-[0.99]"
              >
                {/* Header: Token + Order Number + Status Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2.5 py-1 rounded-xl bg-[#151515] text-white font-black text-xs shrink-0 tracking-wide">
                      {tokenNumber}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black text-[#151515] truncate">
                        {orderNumber}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {createdAt}
                      </span>
                    </div>
                  </div>

                  {getStatusBadge(fulfilmentStatus)}
                </div>

                {/* Counter & Items */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                    <Store className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <span>{vendorName}</span>
                    <span className="text-gray-400 font-normal">• {counterLocation}</span>
                  </div>

                  {/* Items summary */}
                  <div className="text-[11px] text-gray-500 font-medium line-clamp-2">
                    {items.length > 0 ? (
                      items.map((it: any) => `${it.quantity}x ${it.product_name || it.name || it.product?.name || 'Dish'}`).join(', ')
                    ) : (
                      <span>Ordered items details available in view</span>
                    )}
                  </div>
                </div>

                {/* Footer: Payment + Total + Action */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#151515] text-sm">
                      ₹{grandTotal}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      paymentStatus === 'paid' || paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {paymentMethod === 'ONLINE_UPI' ? 'UPI' : 'Cash'} • {paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-[#FF6B00] font-black text-xs group-hover:translate-x-0.5 transition-transform">
                    <span>View Token & QR</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

