'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, ShieldBan, CheckCircle, Clock, AlertTriangle, UserCog } from 'lucide-react';
import Link from 'next/link';
import FilterBar, { FilterOption } from '@/components/ui/FilterBar';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    status: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [updating, setUpdating] = useState<string | null>(null);

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Blocked', value: 'blocked' },
      ],
    },
  ];

  const loadData = async (currentPage = page, currentSearch = search, filters = activeFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminClient.getUsers({
        page: currentPage,
        limit: 25,
        search: currentSearch,
        status: filters.status || 'all'
      });
      setUsers(data.users);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        setError("Access Denied. You need the 'users.manage' permission.");
      } else {
        setError(err.message || 'Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData(1, search, activeFilters);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, activeFilters]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'unblock'} this user?`)) return;
    
    try {
      setUpdating(userId);
      await adminClient.updateUserStatus(userId, newStatus);
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, account_status: newStatus } : u));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setActiveFilters({ status: '' });
  };

  const columns: Column<any>[] = [
    {
      header: 'Student',
      cell: (user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name || 'Anonymous'}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Roll Number',
      cell: (user) => <span className="font-medium text-gray-600">{user.roll_number || '-'}</span>
    },
    {
      header: 'Status',
      cell: (user) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          user.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {user.account_status === 'active' ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : (
            <ShieldBan className="w-3 h-3 mr-1" />
          )}
          {user.account_status || 'active'}
        </span>
      )
    },
    {
      header: 'Joined',
      cell: (user) => (
        <div className="flex items-center text-gray-500">
          <Clock className="w-3 h-3 mr-1.5" />
          {new Date(user.created_at).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (user) => (
        <div className="flex justify-end space-x-2">
          {user.account_status === 'active' ? (
            <button
              disabled={updating === user.id}
              onClick={() => handleStatusChange(user.id, 'blocked')}
              className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {updating === user.id ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <ShieldBan className="w-3 h-3 mr-1.5" />}
              Block
            </button>
          ) : (
            <button
              disabled={updating === user.id}
              onClick={() => handleStatusChange(user.id, 'active')}
              className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              {updating === user.id ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <CheckCircle className="w-3 h-3 mr-1.5" />}
              Unblock
            </button>
          )}
          <Link
            href={`/admin/users/${user.id}`}
            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors"
          >
            <UserCog className="w-3 h-3 mr-1.5" />
            View
          </Link>
        </div>
      )
    }
  ];

  const renderMobileCard = (user: any) => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <span className="font-bold text-gray-900 block">{user.name || 'Anonymous'}</span>
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-600">{user.roll_number || 'No Roll Number'}</span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          user.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {user.account_status || 'active'}
        </span>
      </div>
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          Joined {new Date(user.created_at).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          {user.account_status === 'active' ? (
            <button
              disabled={updating === user.id}
              onClick={() => handleStatusChange(user.id, 'blocked')}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Block
            </button>
          ) : (
            <button
              disabled={updating === user.id}
              onClick={() => handleStatusChange(user.id, 'active')}
              className="text-xs font-medium text-green-600 hover:underline"
            >
              Unblock
            </button>
          )}
          <Link
            href={`/admin/users/${user.id}`}
            className="text-[#FF6B00] text-xs font-medium hover:underline ml-2"
          >
            Manage →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Students & Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage student accounts, access, and history.</p>
      </div>

      <FilterBar
        searchPlaceholder="Search by name, email, roll number..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : (
        <DataTable
          data={users}
          columns={columns}
          keyExtractor={(user) => user.id}
          isLoading={loading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          renderMobileCard={renderMobileCard}
          emptyMessage="No users found. Try adjusting your search criteria."
        />
      )}
    </div>
  );
}
