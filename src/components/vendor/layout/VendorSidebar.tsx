'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Printer, 
  PackageCheck, 
  FileText, 
  Activity, 
  User,
  Users,
  UploadCloud,
  BookOpen,
  Ticket,
  X
} from 'lucide-react';

interface VendorSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

const navSections = [
  {
    label: null,
    items: [
      { href: '/vendor', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { href: '/vendor/orders', icon: ShoppingCart, label: 'All Orders' },
      { href: '/vendor/printing', icon: Printer, label: 'Printing Queue' },
      { href: '/vendor/manuals', icon: BookOpen, label: 'Manual Orders' },
      { href: '/vendor/custom-uploads', icon: UploadCloud, label: 'Custom Uploads' },
      { href: '/vendor/hall-tickets', icon: Ticket, label: 'Hall Tickets' },
      { href: '/vendor/ready', icon: PackageCheck, label: 'Ready Orders' },
    ]
  },
  {
    label: 'DOCUMENTS',
    items: [
      { href: '/vendor/documents', icon: FileText, label: 'Documents' },
    ]
  },
  {
    label: 'CUSTOMERS',
    items: [
      { href: '/vendor/users', icon: Users, label: 'Students' },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/vendor/activity', icon: Activity, label: 'Activity' },
      { href: '/vendor/profile', icon: User, label: 'Profile' },
    ]
  }
];

export default function VendorSidebar({ isOpen, isCollapsed, onClose }: VendorSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#1c1c1c] text-gray-300 border-r border-gray-800">
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B00] rounded-md flex items-center justify-center text-white font-bold">
            B
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight text-white">
              Blintzy <span className="font-normal text-gray-400 text-sm">Vendor</span>
            </span>
          )}
        </div>
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="md:hidden p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700">
        <nav className="px-3 space-y-4">
          {navSections.map((section, si) => (
            <div key={si}>
              {section.label && !isCollapsed && (
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-1">{section.label}</p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
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
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                          isActive
                            ? 'bg-[#FF6B00] text-white font-medium shadow-sm'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
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
        </nav>
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex-shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        } transform bg-[#1c1c1c] md:relative md:translate-x-0 overflow-hidden`}
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
