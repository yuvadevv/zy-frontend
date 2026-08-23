'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  Search, 
  Bell, 
  LogOut, 
  User, 
  Settings, 
  ChevronDown 
} from 'lucide-react';
import { authService } from '@/features/auth/services/authService';

interface TopHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function TopHeader({ onMenuClick, title }: TopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    try {
      await authService.logout();
      router.replace('/admin/login');
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const pageTitle = title || pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Dashboard';
  const capitalizedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-30 relative">
      {/* Left section */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            {capitalizedTitle}
          </h1>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-md hidden lg:flex px-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm transition-colors"
            placeholder="Search users, orders, manuals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Global search results dropdown would go here */}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
        {/* Mobile search button */}
        <button className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>

        <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[#FF6B00] ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1 sm:mx-2" />

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700 leading-none mb-1">Admin User</p>
              <p className="text-xs text-gray-500 leading-none">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block ml-1" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => { setShowProfileMenu(false); router.push('/admin/settings'); }}
                >
                  <Settings className="w-4 h-4" /> Account Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
