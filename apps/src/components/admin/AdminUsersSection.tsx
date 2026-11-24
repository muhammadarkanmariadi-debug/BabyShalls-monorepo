'use client';

import React, { useMemo, useState } from 'react';
import { Shield, UserCheck } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient, extractApiError } from '../../lib/axios';
import { DataTableToolbar } from './DataTableToolbar';
import { AdminModal } from './AdminModal';
import { CsvExportButton } from './ui/CsvExportButton';

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'USER' | 'ADMIN';
  ordersCount: number;
  createdAt: string;
}

export function AdminUsersSection({ enabled }: { enabled: boolean }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [editingUser, setEditingUser] = useState<AdminUserRow | null>(null);
  const [draftRole, setDraftRole] = useState<'USER' | 'ADMIN'>('USER');

  const { data: users = [], isLoading } = useQuery<AdminUserRow[]>({
    queryKey: ['admin-users'],
    enabled,
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: AdminUserRow[] }>('/admin/users');
      return res.data.data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'USER' | 'ADMIN' }) => {
      const res = await apiClient.patch<{ success: boolean; message?: string }>(
        `/admin/users/${id}/role`,
        { role }
      );
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'User role updated.');
      setEditingUser(null);
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, 'Failed to update user role.'));
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (q) {
        const match =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="bg-white border border-[#E6D2C0] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
      <div>
        <h2 className="text-base font-bold text-[#4A2A1C]">
          Users &amp; Access Control ({filtered.length}/{users.length})
        </h2>
        <p className="text-xs text-[#7A5644]">
          Manage customer accounts and BabyShalls store administrator access rights.
        </p>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, email, or phone..."
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterOptions={[
          { label: 'Store Admin', value: 'ADMIN' },
          { label: 'Customer (USER)', value: 'USER' },
        ]}
        filterLabel="All Roles"
        rightAction={
          <CsvExportButton
            endpoint="/admin/import-export/users/export"
            filename="babyshalls-users.csv"
          />
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">Loading user records...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">No users match the filter.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#E6D2C0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8EF] text-[#4A2A1C] font-semibold border-b border-[#E6D2C0]">
              <tr>
                <th className="py-3 px-3.5">Name</th>
                <th className="py-3 px-3.5">Email</th>
                <th className="py-3 px-3.5">Phone</th>
                <th className="py-3 px-3.5">Total Orders</th>
                <th className="py-3 px-3.5">Role</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E4D6]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#FFF8EF]/50 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[#4A2A1C]">{u.name}</td>
                  <td className="py-3 px-3.5 text-[#7A5644]">{u.email}</td>
                  <td className="py-3 px-3.5 text-[#7A5644]">{u.phone || '-'}</td>
                  <td className="py-3 px-3.5 font-bold text-[#3F5FA0]">{u.ordersCount} orders</td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-[#FBE6D8] text-[#8E431A] border border-[#EFA27A]/60'
                          : 'bg-[#E4ECFB] text-[#3F5FA0] border border-[#92B2F3]/60'
                      }`}
                    >
                      {u.role === 'ADMIN' ? 'Store Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(u);
                        setDraftRole(u.role);
                      }}
                      className="px-3 py-1 rounded-[4px] border border-[#92B2F3]/60 text-[#3F5FA0] font-semibold hover:bg-[#E4ECFB] inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Shield className="w-3 h-3" /> Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title={`Change role for ${editingUser?.name || ''}`}
        subtitle={editingUser?.email || ''}
        size="md"
      >
        {editingUser && (
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              {(['USER', 'ADMIN'] as const).map((roleOption) => (
                <label
                  key={roleOption}
                  className={`flex items-start gap-3 p-3.5 rounded-[4px] border cursor-pointer ${draftRole === roleOption
                      ? 'border-[#B05A26] bg-[#FFF6EA]'
                      : 'border-[#E6D2C0] bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    name="user-role"
                    checked={draftRole === roleOption}
                    onChange={() => setDraftRole(roleOption)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-[#4A2A1C]">
                      {roleOption === 'ADMIN' ? 'Admin (Full Dashboard Access)' : 'Customer (USER)'}
                    </p>
                    <p className="text-[11px] text-[#7A5644] mt-0.5">
                      {roleOption === 'ADMIN'
                        ? 'Can manage catalog, orders, workshops, vouchers, and CMS content.'
                        : 'Can shop, register for events, and view order history.'}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E6D2C0]">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="h-9 px-4 rounded-[4px] border border-[#E6D2C0] font-semibold text-[#7A5644] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateRoleMutation.isPending}
                onClick={() => updateRoleMutation.mutate({ id: editingUser.id, role: draftRole })}
                className="h-9 px-4 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{updateRoleMutation.isPending ? 'Saving...' : 'Save Role'}</span>
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

