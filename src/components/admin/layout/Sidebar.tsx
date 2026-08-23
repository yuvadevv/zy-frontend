'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Image as ImageIcon, 
  BarChart3, 
  Download, 
  FileSignature, 
  Settings, 
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
      { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
      { href: '/admin/vendors', icon: Truck, label: 'Vendors' },
    ],
  },
  {
    label: 'CATALOG',
    items: [
      { href: '/admin/manuals', icon: BookOpen, label: 'Manuals' },
      { href: '/admin/academic', icon: GraduationCap, label: 'Academic Setup' },
    ],
  },
  {
    label: 'CUSTOMERS',
    items: [
      { href: '/admin/users', icon: Users, label: 'Users' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { href: '/admin/content', icon: ImageIcon, label: 'Banners & Announcements' },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
      { href: '/admin/exports', icon: Download, label: 'Exports' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/admin/audit', icon: FileSignature, label: 'Audit Logs' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar({ isOpen, isCollapsed, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B00] rounded-md flex items-center justify-center text-white font-bold">
            B
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight text-gray-900">
              Blintzy <span className="font-normal text-gray-500 text-sm">Admin</span>
            </span>
          )}
        </div>
        {/* Mobile close button */}
        <button 
          type="button"
          onClick={onClose}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer relative z-50 flex-shrink-0"
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 tracking-wider">
                {group.label}
              </h3>
            )}
            <ul className="space-y-1 px-2">
              {group.items.map((item) => {
                const isExact = 'exact' in item ? item.exact : false;
                const isActive = isExact 
                  ? pathname === item.href 
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          onClose();
                        }
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-[#FF6B00]/10 text-[#FF6B00] font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#FF6B00]' : 'text-gray-500'}`} />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex-shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        } transform bg-white md:relative md:translate-x-0 overflow-hidden`}
        initial={false}
        animate={{
          x: isOpen || (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : '-100%',
          width: isCollapsed ? 80 : 256
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
