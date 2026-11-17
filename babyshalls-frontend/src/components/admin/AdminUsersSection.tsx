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
      toast.success(res.message || 'Peran pengguna diperbarui.');
      setEditingUser(null);
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, 'Gagal memperbarui peran pengguna.'));
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
    <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[#4A2A1C]">
          Pengguna ({filtered.length}/{users.length})
        </h2>
        <p className="text-xs text-[#7A5644]">
          Kelola daftar akun pelanggan dan hak akses administrator BabyShalls.
        </p>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nama, email, atau telepon..."
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterOptions={[
          { label: 'Admin', value: 'ADMIN' },
          { label: 'Pelanggan (USER)', value: 'USER' },
        ]}
        filterLabel="Semua Peran"
        rightAction={
          <CsvExportButton
            endpoint="/admin/import-export/users/export"
            filename="babyshalls-users.csv"
          />
        }
      />

      {isLoading ? (
        <p className="text-xs text-[#7A5644]">Memuat data pengguna...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-[#7A5644] py-6 text-center">Tidak ada pengguna yang cocok.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF6EA] text-[#4A2A1C] font-semibold border-b border-[#E6D2C0]">
              <tr>
                <th className="py-3 px-3">Nama</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Telepon</th>
                <th className="py-3 px-3">Pesanan</th>
                <th className="py-3 px-3">Peran</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E4D6]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#FFFDF9]">
                  <td className="py-3 px-3 font-semibold text-[#4A2A1C]">{u.name}</td>
                  <td className="py-3 px-3 text-[#7A5644]">{u.email}</td>
                  <td className="py-3 px-3 text-[#7A5644]">{u.phone || '-'}</td>
                  <td className="py-3 px-3 font-semibold">{u.ordersCount}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-[2px] text-[10px] font-bold ${u.role === 'ADMIN'
                          ? 'bg-[#FBE6D8] text-[#B05A26]'
                          : 'bg-[#E9F3E4] text-[#1E543B]'
                        }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(u);
                        setDraftRole(u.role);
                      }}
                      className="px-3 py-1 rounded-[4px] border border-[#E6D2C0] text-[#4A2A1C] font-semibold hover:bg-[#FFF6EA] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Shield className="w-3 h-3" /> Ubah Peran
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
        title={`Ubah peran ${editingUser?.name || ''}`}
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
                      {roleOption === 'ADMIN' ? 'Admin (Akses Penuh Dashboard)' : 'Pelanggan (USER)'}
                    </p>
                    <p className="text-[11px] text-[#7A5644] mt-0.5">
                      {roleOption === 'ADMIN'
                        ? 'Dapat mengelola katalog, pesanan, workshop, voucher, dan konten CMS.'
                        : 'Hanya dapat berbelanja, mendaftar event, dan melihat riwayat akun.'}
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
                Batal
              </button>
              <button
                type="button"
                disabled={updateRoleMutation.isPending}
                onClick={() => updateRoleMutation.mutate({ id: editingUser.id, role: draftRole })}
                className="h-9 px-4 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{updateRoleMutation.isPending ? 'Menyimpan...' : 'Simpan Peran'}</span>
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

