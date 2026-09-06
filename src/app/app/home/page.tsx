"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { DASHBOARD_WIDGETS } from '@/features/home/constants';
import { CurrentOrderHero } from '@/features/home/components/CurrentOrderHero';
import { QuickServicesGrid } from '@/features/home/components/QuickServicesGrid';
import { TodaysHighlights } from '@/features/home/components/TodaysHighlights';
import { AnnouncementCarousel } from '@/features/home/components/AnnouncementCarousel';
import { RecentOrders } from '@/features/home/components/RecentOrders';
import { SupportCard } from '@/features/home/components/SupportCard';
import { WidgetSkeleton, CurrentOrderSkeleton } from '@/features/home/components/HomeSkeleton';
import { DashboardEntry } from '@/features/home/components/DashboardEntry';
import { PromoBanners } from '@/features/home/components/PromoBanners';
import { BusTrackingCard } from '@/features/home/components/BusTrackingCard';

import { workerClient } from '@/lib/api/workerClient';
import { mapCurrentOrder, mapQuickService, mapAnnouncement, mapSupportAction } from '@/features/home/mappers';
import { STATIC_QUICK_SERVICES, STATIC_SUPPORT_ACTIONS } from '@/features/home/config/staticServices';

const SectionHeader = ({ title, actionLabel, href }: { title: string, actionLabel?: string, href?: string }) => (
  <div className="flex justify-between items-end mb-3 px-1">
    <h2 className="text-[18px] font-bold text-gray-900 leading-none">{title}</h2>
    {actionLabel && (
      <a 
        href={href || '#'}
        className="text-orange-500 font-bold text-[13px] flex items-center group active:text-orange-600 transition-colors"
      >
        <span className="leading-none">{actionLabel}</span>
        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </a>
    )}
  </div>
);

const formatETA = (isoString: string | null | undefined) => {
  if (!isoString) return 'Updating soon';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Updating soon';

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const mins = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${mins} ${ampm}`;
  };

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const timeStr = formatTime(date);

  if (isSameDay(date, today)) {
    return `Today • ${timeStr}`;
  } else if (isSameDay(date, tomorrow)) {
    return `Tmrw • ${timeStr}`;
  } else if (isSameDay(date, yesterday)) {
    return `Yesterday • ${timeStr}`;
  } else {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month} • ${timeStr}`;
  }
};

export default function HomeDashboard() {
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [refreshingOrderId, setRefreshingOrderId] = useState<string | null>(null);

  const handleRefreshOrder = async (id: string) => {
    if (refreshingOrderId) return;
    setRefreshingOrderId(id);
    try {
      const res = await workerClient.getOrder(id);
      const updatedOrder = res.order || res;
      if (updatedOrder) {
        setActiveOrders(prev => prev.map(o => (o.public_id || o.id) === id ? { ...o, ...updatedOrder } : o));
      }
    } catch (err) {
      console.error('Failed to refresh order', err);
    } finally {
      setRefreshingOrderId(null);
    }
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [ordersRes, contentRes] = await Promise.all([
          workerClient.getOrders().catch(() => { setHasError(true); return []; }),
          workerClient.getContent('announcement').catch(() => ({ content: [] }))
        ]);
        
        const ordersList = ordersRes.orders || ordersRes;
        if (Array.isArray(ordersList)) {
          // Sort by updated_at descending so most relevant is first
          const sortedList = [...ordersList].sort((a: any, b: any) => {
            const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
            const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
            return timeB - timeA;
          });

          const active = sortedList.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'failed');
          const recent = sortedList; // Include all orders in Recent Orders
          
          setActiveOrders(active);
          setRecentOrders(recent);
        }

        const announcementsList = contentRes.content || contentRes;
        if (Array.isArray(announcementsList)) {
          setAnnouncements(announcementsList);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const activeWidgets = DASHBOARD_WIDGETS.filter(w => w.enabled).sort((a, b) => a.priority - b.priority);

  const renderWidget = (widgetId: string) => {
    if (widgetId === 'current_order' && !isLoading && activeOrders.length === 0) return null;
    if (widgetId === 'recent_orders' && !isLoading && recentOrders.length === 0) return null;
    switch (widgetId) {
      case 'promo_banners':
        return <section><PromoBanners hasActiveOrders={activeOrders.length > 0} /></section>;
      case 'bus_tracking':
        return <section><BusTrackingCard /></section>;
      case 'current_order':
        return (
          <Suspense fallback={<CurrentOrderSkeleton />}>
            <section>
              {isLoading ? <CurrentOrderSkeleton /> : <CurrentOrderHero 
                 orders={activeOrders.map(o => ({
                   id: o.public_id || o.id,
                   status: o.status,
                   documentName: o.items?.[0]?.document_filename || o.items?.[0]?.manual_title || `Order ${o.public_id || o.id}`,
                   progress: o.status === 'received' ? 10 : o.status === 'printing' ? 40 : o.status === 'ready_for_pickup' ? 90 : 50,
                   estimatedDeliveryTime: formatETA(o.estimated_delivery),
                   amount: o.grand_total || 0,
                   date: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString()
                 }))}
                 onRefresh={handleRefreshOrder}
                 refreshingOrderId={refreshingOrderId}
              />}
            </section>
          </Suspense>
        );
      case 'quick_services':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <section>
              <SectionHeader title="Quick Services" actionLabel="View All" href="/app/services" />
              <QuickServicesGrid services={STATIC_QUICK_SERVICES.data.map(mapQuickService)} />
            </section>
          </Suspense>
        );
      case 'todays_highlights':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <section>
              <SectionHeader title="Today's Highlights" />
              <TodaysHighlights />
            </section>
          </Suspense>
        );
      case 'announcements':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <section>
              <SectionHeader title="Announcements" actionLabel="See All" href="/app/notifications" />
              <AnnouncementCarousel announcements={announcements.length > 0 ? announcements.map(a => {
                let meta = a.metadata;
                if (typeof meta === 'string') {
                  try { meta = JSON.parse(meta); } catch(e) {}
                }
                return {
                  id: a.id,
                  tag: 'Alert',
                  title: a.title,
                  date: new Date(a.created_at || Date.now()).toLocaleDateString(),
                  pinned: a.type === 'banner',
                  priority: a.type === 'banner' ? 1 : 0,
                  category: meta?.announcement_type || a.theme || a.type || 'system',
                  description: a.description || meta?.subtitle || ''
                };
              }) : []} />
            </section>
          </Suspense>
        );
      case 'recent_orders':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <section>
              <SectionHeader title="Recent Orders" actionLabel="History" href="/app/orders" />
              <RecentOrders orders={recentOrders.map(o => ({
                 id: o.public_id || o.id,
                 status: o.status,
                 documentName: o.items?.[0]?.document_filename || o.items?.[0]?.manual_title || `Order ${o.public_id || o.id}`,
                 type: o.items?.[0]?.item_type || 'custom',
                 total: `₹${o.grand_total || 0}`,
                 date: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today',
                 eta: o.estimated_delivery ? new Date(o.estimated_delivery).toLocaleDateString() : 'TBD'
              }))} />
            </section>
          </Suspense>
        );
      case 'support':
        return (
          <Suspense fallback={<WidgetSkeleton />}>
            <section>
              <SupportCard />
            </section>
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardEntry>
      <div className="flex flex-col gap-5 w-full pb-24">
        {hasError && (
          <div className="mx-1 px-4 py-3 bg-red-50 text-red-600 rounded-xl flex items-center justify-between shadow-sm">
            <span className="text-sm font-semibold">Couldn't load your orders.</span>
            <button onClick={() => window.location.reload()} className="text-sm font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">Retry</button>
          </div>
        )}
        {activeWidgets.map(widget => {
          const widgetContent = renderWidget(widget.id);
          if (!widgetContent) return null;
          return (
            <React.Fragment key={widget.id}>
              {widgetContent}
            </React.Fragment>
          );
        })}
      </div>
    </DashboardEntry>
  );
}
