'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Utensils, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Plus, 
  Search, 
  RefreshCw, 
  ChefHat, 
  Layers, 
  Package, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Check,
  X,
  Edit2,
  Trash2,
  Eye,
  Bell
} from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';

type TabType = 'orders' | 'verify' | 'menu' | 'inventory';
type OrderStatusFilter = 'all' | 'confirmed' | 'preparing' | 'ready' | 'collected';

export default function VendorFoodDashboardPage() {
  // Vendor Switcher: Isolated Vendor Context
  const [selectedVendorId, setSelectedVendorId] = useState<'vendor_canteen_stall' | 'vendor_college_mess'>('vendor_canteen_stall');
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Meal Type Filter for College Mess
  const [messMealFilter, setMessMealFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');

  // Pickup Verification Modal / Quick Form State
  const [pickupCode, setPickupCode] = useState('');
  const [verifyingPickup, setVerifyingPickup] = useState(false);
  const [pickupFeedback, setPickupFeedback] = useState<{
    success?: boolean;
    message?: string;
    details?: any;
    error?: string;
  } | null>(null);

  // Menu Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: 'fast-food',
    dietary: 'veg' as 'veg' | 'non-veg' | 'egg',
    stock: '50',
    mealType: 'all_day',
    image: '',
  });

  // Load Dashboard, Orders & Menu with strict vendor isolation
  const loadVendorData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const [dashRes, ordersRes, menuRes] = await Promise.all([
        workerClient.getVendorFoodDashboard(selectedVendorId),
        workerClient.getVendorFoodOrders(selectedVendorId, statusFilter),
        workerClient.getVendorFoodMenu(selectedVendorId, messMealFilter),
      ]);

      if (dashRes?.data) setDashboardData(dashRes.data);
      if (ordersRes?.data?.orders) setOrders(ordersRes.data.orders);
      if (menuRes?.data?.menu) setMenuItems(menuRes.data.menu);
    } catch (err: any) {
      console.error('Failed to load vendor food data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedVendorId, statusFilter, messMealFilter]);

  useEffect(() => {
    loadVendorData();

    // Live kitchen polling every 8 seconds for real-time order updates
    const timer = setInterval(() => {
      loadVendorData(true);
    }, 8000);

    return () => clearInterval(timer);
  }, [loadVendorData]);

  // Order Status Transition Handler
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await workerClient.updateVendorFoodOrderStatus(orderId, newStatus, selectedVendorId);
      loadVendorData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    }
  };

  // Pickup Verification Submission Handler
  const handleVerifyPickup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pickupCode.trim() || verifyingPickup) return;

    setVerifyingPickup(true);
    setPickupFeedback(null);

    try {
      const res = await workerClient.verifyVendorFoodPickup(pickupCode.trim(), selectedVendorId);
      const data = res.data || res;
      setPickupFeedback({
        success: true,
        message: data.message || `Token #${data.tokenNumber} verified! Meal handed over.`,
        details: data,
      });
      setPickupCode('');
      loadVendorData(true);
    } catch (err: any) {
      setPickupFeedback({
        success: false,
        error: err.message || 'Invalid verification credential or order belongs to another counter.',
      });
    } finally {
      setVerifyingPickup(false);
    }
  };

  // Toggle Item Availability (In Stock / Sold Out)
  const handleToggleAvailability = async (productId: string, currentAvailability: boolean) => {
    try {
      await workerClient.toggleVendorFoodItemAvailability(productId, !currentAvailability, selectedVendorId);
      setMenuItems((prev) =>
        prev.map((it) => (it.id === productId ? { ...it, is_available: currentAvailability ? 0 : 1 } : it))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to toggle product availability.');
    }
  };

  // Adjust Stock
  const handleStockChange = async (productId: string, newStock: number) => {
    try {
      await workerClient.updateVendorFoodStock(productId, newStock, selectedVendorId, 'kitchen_inventory_adjustment');
      setMenuItems((prev) =>
        prev.map((it) => (it.id === productId ? { ...it, stock: newStock, is_available: newStock > 0 ? 1 : 0 } : it))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update stock.');
    }
  };

  // Add / Edit Product Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await workerClient.updateVendorFoodMenuItem(editingProduct.id, {
          vendorId: selectedVendorId,
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          categoryId: productForm.categoryId,
          dietary: productForm.dietary,
          stock: Number(productForm.stock),
          mealType: productForm.mealType,
          image: productForm.image,
        });
      } else {
        await workerClient.createVendorFoodMenuItem({
          vendorId: selectedVendorId,
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          categoryId: productForm.categoryId,
          dietary: productForm.dietary,
          stock: Number(productForm.stock),
          mealType: productForm.mealType,
          image: productForm.image,
        });
      }

      setIsAddProductOpen(false);
      setEditingProduct(null);
      loadVendorData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to save product.');
    }
  };

  const isMess = selectedVendorId === 'vendor_college_mess';
  const vendorInfo = dashboardData?.vendor || {
    name: isMess ? 'College Mess Dining' : 'Campus Canteen Stall',
    counterLocation: isMess ? 'Dining Hall Counter (Mess Block)' : 'Counter 1 (Main Food Court)',
  };
  const stats = dashboardData?.stats || {
    todayOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    completedOrders: 0,
    todaySales: 0,
  };
  const paymentSummary = dashboardData?.paymentSummary || {
    onlinePaid: 0,
    cashCollected: 0,
    cashPending: 0,
    totalReconciled: 0,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#151515] select-none pb-20">
      {/* 1. TOP NAV & VENDOR SWITCHER */}
      <header className="sticky top-0 z-40 bg-[#151515] text-white border-b border-zinc-800 shadow-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Counter Context */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-black shadow-xs">
              <ChefHat className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  BLINTZY <span className="text-[#FF6B00]">Kitchen & Vendor Portal</span>
                </h1>
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                {vendorInfo.name} • {vendorInfo.counterLocation}
              </p>
            </div>
          </div>

          {/* TWO INDEPENDENT VENDOR TABS SWITCHER */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="p-1 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => {
                  setSelectedVendorId('vendor_canteen_stall');
                  setStatusFilter('all');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedVendorId === 'vendor_canteen_stall'
                    ? 'bg-[#FF6B00] text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Private Food Stall (Counter 1)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedVendorId('vendor_college_mess');
                  setStatusFilter('all');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedVendorId === 'vendor_college_mess'
                    ? 'bg-[#FF6B00] text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>College Mess Dining</span>
              </button>
            </div>

            <button
              onClick={() => loadVendorData()}
              disabled={refreshing}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white active:scale-95 transition cursor-pointer"
              title="Refresh live orders"
              aria-label="Refresh orders"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FF6B00]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 flex flex-col gap-5">
        {/* KPI DASHBOARD METRICS */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Today's Orders */}
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">Today's Orders</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-[#151515]">{stats.todayOrders}</span>
              <span className="text-[10px] text-gray-400 font-bold">Total</span>
            </div>
          </div>

          {/* Pending / New */}
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold text-amber-600 uppercase tracking-wider">New / Pending</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-600">{stats.pendingOrders}</span>
              <span className="text-[10px] text-amber-600 font-bold">Waiting</span>
            </div>
          </div>

          {/* Cooking */}
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold text-[#FF6B00] uppercase tracking-wider">In Kitchen</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-[#FF6B00]">{stats.preparingOrders}</span>
              <span className="text-[10px] text-orange-600 font-bold">Cooking</span>
            </div>
          </div>

          {/* Ready for Pickup */}
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider">Ready at Counter</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-purple-600">{stats.readyOrders}</span>
              <span className="text-[10px] text-purple-600 font-bold">To Collect</span>
            </div>
          </div>

          {/* Completed */}
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider">Completed</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-600">{stats.completedOrders}</span>
              <span className="text-[10px] text-emerald-600 font-bold">Picked up</span>
            </div>
          </div>

          {/* Today's Sales */}
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">Today's Sales</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-[#FF6B00]">₹{stats.todaySales}</span>
              <span className="text-[10px] text-gray-400 font-bold">Revenue</span>
            </div>
          </div>
        </section>

        {/* PAYMENT RECONCILIATION SUMMARY BAR */}
        <section className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
            <strong className="text-gray-900 font-black">Payment Reconciliation:</strong>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-gray-600">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Online UPI Settled:</span>
              <strong className="text-gray-900 font-black">₹{paymentSummary.onlinePaid}</strong>
            </div>

            <div className="flex items-center gap-1.5 text-gray-600">
              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cash Collected at Counter:</span>
              <strong className="text-gray-900 font-black">₹{paymentSummary.cashCollected}</strong>
            </div>

            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Cash Pending (In Queue):</span>
              <strong className="text-amber-700 font-black">₹{paymentSummary.cashPending}</strong>
            </div>

            <div className="pl-3 border-l border-gray-200 text-gray-900">
              <span>Total Reconciled: </span>
              <strong className="text-[#FF6B00] font-black text-sm">₹{paymentSummary.totalReconciled}</strong>
            </div>
          </div>
        </section>

        {/* 3. NAVIGATION TABS */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#151515] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-black border border-gray-200'
              }`}
            >
              <ChefHat className="w-4 h-4 text-[#FF6B00]" />
              <span>Live Kitchen Queue</span>
              {stats.pendingOrders > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center">
                  {stats.pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'verify'
                  ? 'bg-[#151515] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-black border border-gray-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Pickup Verifier</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-[#151515] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-black border border-gray-200'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Menu Management</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#151515] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-black border border-gray-200'
              }`}
            >
              <Package className="w-4 h-4 text-purple-600" />
              <span>Stock & Inventory</span>
            </button>
          </div>

          {activeTab === 'menu' && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  description: '',
                  price: '',
                  categoryId: isMess ? 'meals' : 'fast-food',
                  dietary: 'veg',
                  stock: '50',
                  mealType: isMess ? 'lunch' : 'all_day',
                  image: '',
                });
                setIsAddProductOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {/* 4. TAB CONTENT 1: LIVE KITCHEN QUEUE */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'confirmed', 'preparing', 'ready', 'collected'] as OrderStatusFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition cursor-pointer shrink-0 ${
                    statusFilter === f
                      ? 'bg-[#FF6B00] text-white shadow-2xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {f === 'confirmed' ? 'New / Pending' : f === 'preparing' ? 'In Cooking' : f}
                </button>
              ))}
            </div>

            {/* Orders Grid */}
            {orders.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center justify-center gap-3">
                <ChefHat className="w-10 h-10 text-gray-300 stroke-[1.5]" />
                <div>
                  <h3 className="text-sm font-bold text-gray-800">No orders in this queue</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Orders sent to {vendorInfo.counterLocation} will appear here in real time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {orders.map((ord) => {
                  const status = (ord.order_status || '').toLowerCase();
                  const isPaid = (ord.payment_status || '').toLowerCase() === 'paid';
                  const isCash = ord.payment_method === 'CASH_AT_COUNTER';

                  return (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
                    >
                      {/* Order Header */}
                      <div className="flex items-start justify-between border-b border-gray-150 pb-2.5">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-[#FF6B00] font-mono tracking-tight leading-none">
                            {ord.token_number}
                          </span>
                          <span className="text-[10.5px] font-bold text-gray-400 font-mono mt-1">
                            Ref: {ord.order_number}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              status === 'confirmed'
                                ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                                : status === 'preparing'
                                ? 'bg-orange-50 text-orange-800 border-orange-200'
                                : status === 'ready'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {status === 'confirmed' ? '1. New Order' : status === 'preparing' ? '2. Cooking' : status === 'ready' ? '3. Ready at Counter' : '4. Collected'}
                          </span>

                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {isPaid ? 'PAID ONLINE' : 'CASH DUE ON PICKUP'}
                          </span>
                        </div>
                      </div>

                      {/* Student Reference */}
                      <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50/70 p-2 rounded-xl border border-gray-150">
                        <span className="font-bold text-gray-900 truncate">
                          Student: {ord.student_name || 'Campus Student'}
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Item Checklist */}
                      <div className="flex flex-col divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                        {ord.items.map((it: any, i: number) => (
                          <div key={i} className="py-1.5 flex items-start justify-between text-xs gap-2">
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-gray-900">
                                {it.quantity}x {it.product_name}
                              </span>
                              {it.cooking_notes && (
                                <span className="text-[10px] text-amber-700 font-bold italic truncate">
                                  Note: "{it.cooking_notes}"
                                </span>
                              )}
                            </div>
                            <span className="font-black text-gray-700 shrink-0">
                              ₹{it.item_total}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Bill Total & Verification Status */}
                      <div className="pt-2 border-t border-gray-150 flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-bold">Total:</span>
                        <span className="text-base font-black text-gray-900">
                          ₹{ord.grand_total}
                        </span>
                      </div>

                      {/* Action Buttons based on Stage */}
                      <div className="pt-1 flex items-center gap-2">
                        {status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'preparing')}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs transition active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Start Cooking</span>
                          </button>
                        )}

                        {status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'ready')}
                            className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Ready for Pickup</span>
                          </button>
                        )}

                        {status === 'ready' && (
                          <button
                            onClick={() => {
                              setActiveTab('verify');
                              setPickupCode(ord.pickup_otp || '');
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verify Student Pickup</span>
                          </button>
                        )}

                        {status === 'collected' && (
                          <div className="w-full py-1.5 px-3 rounded-xl bg-gray-100 text-gray-600 text-center font-bold text-xs flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Meal Collected & Handed Over</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB CONTENT 2: PICKUP VERIFICATION TOOL */}
        {activeTab === 'verify' && (
          <div className="max-w-xl mx-auto w-full flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#151515]">
                    Counter Pickup Verification
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Enter the student's 4-digit Pickup OTP or scan their Pickup QR Code.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyPickup} className="flex flex-col gap-3 mt-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-600">
                  Student Verification Credential
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pickupCode}
                    onChange={(e) => setPickupCode(e.target.value)}
                    placeholder="Enter 4-digit code (e.g. 7788) or QR token"
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#FF6B00] outline-none text-base font-black text-[#151515] font-mono tracking-wider"
                    maxLength={40}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={verifyingPickup || !pickupCode.trim()}
                    className="py-3 px-6 rounded-2xl bg-[#FF6B00] hover:bg-orange-600 active:scale-95 transition text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {verifyingPickup ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <span>Verify & Release</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Feedback Alert */}
              {pickupFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                    pickupFeedback.success
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border-rose-200'
                  }`}
                >
                  {pickupFeedback.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 leading-relaxed">
                    <strong className="block text-sm font-black mb-0.5">
                      {pickupFeedback.success ? 'Verification Successful!' : 'Verification Blocked'}
                    </strong>
                    <p className="font-medium">
                      {pickupFeedback.success ? pickupFeedback.message : pickupFeedback.error}
                    </p>
                    {pickupFeedback.details && (
                      <div className="mt-2 pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px] font-bold">
                        <span>Token: #{pickupFeedback.details.tokenNumber}</span>
                        <span>Amount: ₹{pickupFeedback.details.grandTotal}</span>
                        <span>Status: {pickupFeedback.details.paymentStatus?.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Policy Reminder */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-150 text-[11px] text-gray-500 leading-relaxed font-medium">
                🔒 <strong>Anti-Replay Policy:</strong> Verified tokens are immediately marked as collected in the backend database. Any attempt to reuse the same OTP or QR will be permanently rejected.
              </div>
            </div>
          </div>
        )}

        {/* 6. TAB CONTENT 3: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="flex flex-col gap-4">
            {/* For College Mess: Meal Type Filter Tabs */}
            {isMess && (
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-gray-200 w-fit text-xs font-bold">
                <span className="text-gray-400 px-2">Meal Session:</span>
                {(['all', 'breakfast', 'lunch', 'dinner'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMessMealFilter(m)}
                    className={`px-3 py-1 rounded-xl capitalize transition cursor-pointer ${
                      messMealFilter === m
                        ? 'bg-[#151515] text-white'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {/* Menu Items Table / Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {menuItems.map((item) => {
                const isAvailable = item.is_available === 1 && item.stock > 0;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between gap-3 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.dietary === 'veg'
                                ? 'bg-emerald-500'
                                : item.dietary === 'egg'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 truncate">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                          {item.category_id} {item.meal_type ? `• ${item.meal_type}` : ''}
                        </span>
                      </div>

                      <span className="text-sm font-black text-gray-900 shrink-0">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Stock Status Bar */}
                    <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-xl border border-gray-150">
                      <span className="text-gray-500 font-bold">Stock Remaining:</span>
                      <span className={`font-black ${item.stock < 10 ? 'text-rose-600' : 'text-gray-900'}`}>
                        {item.stock} units
                      </span>
                    </div>

                    {/* Availability Switch & Edit Action */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <button
                        onClick={() => handleToggleAvailability(item.id, item.is_available === 1)}
                        className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingProduct(item);
                          setProductForm({
                            name: item.name,
                            description: item.description || '',
                            price: String(item.price),
                            categoryId: item.category_id,
                            dietary: item.dietary,
                            stock: String(item.stock),
                            mealType: item.meal_type || 'all_day',
                            image: item.image || '',
                          });
                          setIsAddProductOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. TAB CONTENT 4: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
              <h3 className="text-sm font-black text-gray-900 mb-1">
                Real-Time Stock & Inventory Controls
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Adjust stock levels. When stock reaches 0, the product is automatically marked sold out in the student app.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">{item.name}</h4>
                      <span className="text-[10.5px] font-bold text-[#FF6B00]">₹{item.price}</span>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        item.stock > 0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.stock > 0 ? `${item.stock} in stock` : 'Sold out'}
                    </span>
                  </div>

                  {/* Stock Stepper */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                    <span className="text-xs font-bold text-gray-600">Quick Adjust:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStockChange(item.id, Math.max(0, item.stock - 5))}
                        className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-xs text-gray-800 transition active:scale-95 cursor-pointer"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleStockChange(item.id, Math.max(0, item.stock - 1))}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-xs text-gray-800 transition active:scale-95 cursor-pointer"
                      >
                        -1
                      </button>
                      <span className="w-10 text-center font-mono font-black text-sm">
                        {item.stock}
                      </span>
                      <button
                        onClick={() => handleStockChange(item.id, item.stock + 1)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-xs text-gray-800 transition active:scale-95 cursor-pointer"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleStockChange(item.id, item.stock + 10)}
                        className="px-2 py-1 rounded-lg bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs transition active:scale-95 cursor-pointer shadow-xs"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 8. ADD / EDIT PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-gray-200 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3">
              <h3 className="text-base font-black text-gray-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Food Product'}
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Special Paneer Butter Masala"
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:border-[#FF6B00] outline-none text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="90"
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:border-[#FF6B00] outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:border-[#FF6B00] outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:border-[#FF6B00] outline-none text-xs font-semibold bg-white"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="meals">Meals & Thalis</option>
                    <option value="veg-curries">Veg Curries</option>
                    <option value="chicken-curries">Chicken Curries</option>
                    <option value="fried-rice">Fried Rice</option>
                    <option value="noodles">Noodles</option>
                    <option value="pizza">Pizza</option>
                    <option value="chicken-rolls">Chicken Rolls</option>
                    <option value="fast-food">Fast Food</option>
                    <option value="snacks">Snacks & Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Dietary Badge *</label>
                  <select
                    value={productForm.dietary}
                    onChange={(e) => setProductForm({ ...productForm, dietary: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:border-[#FF6B00] outline-none text-xs font-semibold bg-white"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="egg">Egg Item</option>
                  </select>
                </div>
              </div>

              {isMess && (
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Meal Session</label>
                  <select
                    value={productForm.mealType}
                    onChange={(e) => setProductForm({ ...productForm, mealType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:border-[#FF6B00] outline-none text-xs font-semibold bg-white"
                  >
                    <option value="breakfast">Breakfast Session</option>
                    <option value="lunch">Lunch Session</option>
                    <option value="dinner">Dinner Session</option>
                    <option value="all_day">All Day</option>
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-gray-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Freshly prepared at counter with special spices..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:border-[#FF6B00] outline-none text-xs font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs shadow-xs cursor-pointer active:scale-95 transition"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

