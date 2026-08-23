'use client';

import { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Loader2, Plus, Shield, User, Mail, ShieldAlert } from 'lucide-react';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add member modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ id: '', email: '', name: '', role_id: '' });
  const [adding, setAdding] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [teamData, rolesData] = await Promise.all([
        adminClient.getTeam(),
        adminClient.getRoles()
      ]);
      setTeam(teamData);
      setRoles(rolesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load team data. Ensure you have the SUPER_ADMIN or admins.manage role.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await adminClient.addTeamMember(newMember);
      setShowAddModal(false);
      setNewMember({ id: '', email: '', name: '', role_id: '' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  if (loading && !team.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex flex-col items-start max-w-2xl">
        <div className="flex items-center space-x-2 mb-2">
          <ShieldAlert className="w-5 h-5" />
          <p className="font-semibold">Access Denied</p>
        </div>
        <p className="mb-4">{error}</p>
        <button onClick={loadData} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Team</h1>
          <p className="text-sm text-gray-500 mt-1">Manage portal administrators and their roles.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {team.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No administrators found.</td>
                </tr>
              ) : (
                team.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900">{member.name || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{member.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        <Shield className="w-3 h-3 mr-1.5" />
                        {member.role || 'No Role'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Administrator</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supabase User ID (UUID)</label>
                <input 
                  type="text" 
                  required
                  value={newMember.id}
                  onChange={e => setNewMember({...newMember, id: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={newMember.email}
                  onChange={e => setNewMember({...newMember, email: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="admin@blintzy.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={newMember.name}
                  onChange={e => setNewMember({...newMember, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  required
                  value={newMember.role_id}
                  onChange={e => setNewMember({...newMember, role_id: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="">Select a role...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={adding}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
