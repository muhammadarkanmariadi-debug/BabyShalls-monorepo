'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  Ticket,
  Tag,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  QrCode,
  X,
  Calendar,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  ADMIN_TOKEN_STORAGE_KEY,
  USER_TOKEN_STORAGE_KEY,
  extractApiError,
} from '../../lib/axios';
import { formatChildAge, formatIDR, formatPhoneInput, normalizePhoneDigits, parseChildAge } from '../../lib/utils';
import {
  useAccountAddresses,
  useAccountOrders,
  useAccountProfile,
  useAccountTickets,
  useCreateAccountAddress,
  useDeleteAccountAddress,
  usePayEventTicket,
  useUpdateAccountProfile,
} from '../../hooks/useAccount';
import { openMidtransSnap } from '../../lib/midtrans-snap';
import { useActiveCoupons, useClaimedVouchers } from '../../hooks/useCoupons';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';
import { AccountAuthGate } from '../../components/account/AccountAuthGate';
import { AccountOrdersTab } from '../../components/account/AccountOrdersTab';
import { AccountSecurityCards } from '../../components/account/AccountSecurityCards';
import { CloudinaryUploadButton } from '../../components/ui/CloudinaryUploadButton';

type SidebarMenu = 'orders' | 'profile' | 'addresses' | 'wishlist' | 'tickets' | 'vouchers';

export default function AccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(false);
  const [checkedToken, setCheckedToken] = useState(false);
  const [activeMenu, setActiveMenu] = useState<SidebarMenu>('orders');
  const [selectedQrTicket, setSelectedQrTicket] = useState<(typeof tickets)[number] | null>(null);

  useEffect(() => {
    const token =
      window.localStorage.getItem(USER_TOKEN_STORAGE_KEY) ||
      window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    setHasToken(Boolean(token));
    setCheckedToken(true);
  }, []);

  const { data: profile, isError: profileError } = useAccountProfile(hasToken);

  useEffect(() => {
    if (profile?.role === 'ADMIN') {
      router.replace('/admin');
    }
  }, [profile, router]);
  const { data: orders = [], isLoading: ordersLoading } = useAccountOrders(hasToken);
  const { data: addresses = [] } = useAccountAddresses(hasToken);
  const { data: tickets = [] } = useAccountTickets(hasToken);
  const { data: activeCoupons = [], isLoading: couponsLoading } = useActiveCoupons();
  const { claimVoucher, isClaimed: isVoucherClaimed } = useClaimedVouchers();
  const { wishlistProducts } = useWishlist();

  const updateProfileMutation = useUpdateAccountProfile();
  const createAddressMutation = useCreateAccountAddress();
  const deleteAddressMutation = useDeleteAccountAddress();
  const payEventTicketMutation = usePayEventTicket();

  const [editName, setEditName] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editChildName, setEditChildName] = useState('');
  const [editChildAgeValue, setEditChildAgeValue] = useState('');
  const [editChildAgeUnit, setEditChildAgeUnit] = useState<'Tahun' | 'Bulan'>('Tahun');
  const [editEmailOptIn, setEditEmailOptIn] = useState(true);
  const [addrLabel, setAddrLabel] = useState('Rumah');
  const [addrReceiver, setAddrReceiver] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Kota Malang');
  const [addrPostal, setAddrPostal] = useState('');

  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
      setEditAvatarUrl(profile.avatarUrl || '');
      setEditPhone(profile.phone ? formatPhoneInput(profile.phone) : '');
      setEditParentName(profile.parentName || '');
      setEditChildName(profile.childName || '');
      const parsedAge = parseChildAge(profile.childAge);
      setEditChildAgeValue(parsedAge.value);
      setEditChildAgeUnit(parsedAge.unit);
      setEditEmailOptIn(profile.emailOptIn ?? true);
    }
  }, [profile]);

  const handleLogout = () => {
    window.localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    window.dispatchEvent(new Event('babyshalls-auth-changed'));
    setHasToken(false);
    queryClient.clear();
    toast.success('Anda telah keluar dari akun.');
  };

  if (!checkedToken) {
    return <div className="min-h-[60vh] bg-[#F8FAFC]" />;
  }

  if (!hasToken || profileError) {
    return (
      <AccountAuthGate
        onAuthenticated={(user) => {
          if (user?.role === 'ADMIN') {
            router.replace('/admin');
            return;
          }
          setHasToken(true);
        }}
      />
    );
  }

  const initials = (profile?.name || 'BS')
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        name: editName,
        avatarUrl: editAvatarUrl.trim() || null,
        phone: normalizePhoneDigits(editPhone) || null,
        parentName: editParentName.trim() || null,
        childName: editChildName.trim() || null,
        childAge: formatChildAge(editChildAgeValue, editChildAgeUnit) || null,
        emailOptIn: editEmailOptIn,
      });
      toast.success('Profil berhasil diperbarui.');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal memperbarui profil.'));
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAddressMutation.mutateAsync({
        label: addrLabel,
        receiverName: addrReceiver,
        receiverPhone: addrPhone,
        streetAddress: addrStreet,
        city: addrCity,
        subdistrict: '-',
        postalCode: addrPostal,
        isDefault: addresses.length === 0,
      });
      setAddrReceiver('');
      setAddrPhone('');
      setAddrStreet('');
      setAddrPostal('');
      toast.success('Alamat baru tersimpan.');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal menambah alamat.'));
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-11 h-11 rounded-full object-cover border border-[#EBDCCB] shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#FDF0B8] text-[#1A1A1A] font-extrabold text-sm flex items-center justify-center shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-[#1A1A1A] truncate">{profile?.name}</div>
              <div className="text-[11px] text-[#6B7280] truncate">{profile?.email}</div>
            </div>
          </div>

          <nav className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 space-y-1">
            {[
              { id: 'orders', label: 'Pesanan Saya', icon: Package, badge: orders.length },
              { id: 'profile', label: 'Profil Saya', icon: User },
              { id: 'addresses', label: 'Alamat Pengiriman', icon: MapPin, badge: addresses.length },
              { id: 'wishlist', label: 'Wishlist Saya', icon: Heart, badge: wishlistProducts.length },
              { id: 'tickets', label: 'Tiket Workshop', icon: Ticket, badge: tickets.length },
              { id: 'vouchers', label: 'Voucher Saya', icon: Tag, badge: activeCoupons.length },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMenu(item.id as SidebarMenu)}
                  className={`w-full min-h-[42px] px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    active ? 'bg-[#FDF0B8] text-[#1A1A1A]' : 'text-[#4A4A4A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#1E543B]" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#F5B7A1] text-[#1A1A1A] text-[10px] font-extrabold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {profile?.role === 'ADMIN' && (
              <>
                <div className="my-2 border-t border-[#F3F4F6]" />
                <Link
                  href="/admin"
                  className="w-full min-h-[40px] px-3 rounded-xl text-xs font-bold text-[#1E543B] bg-[#E9F3E4] flex items-center justify-between"
                >
                  <span>Portal Admin Toko</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}

            <div className="my-2 border-t border-[#F3F4F6]" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full min-h-[40px] px-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-5">
          {activeMenu === 'orders' && <AccountOrdersTab orders={orders} isLoading={ordersLoading} />}

          {activeMenu === 'profile' && (
            <div className="space-y-5">
              <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 text-xs">
                <h2 className="text-base font-extrabold text-[#1A1A1A]">Profil Saya</h2>
                <div className="flex flex-wrap items-center gap-4 pb-2 border-b border-[#F3F4F6]">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt={editName || 'Avatar'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#EBDCCB] shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#FDF0B8] text-[#1A1A1A] font-extrabold text-lg flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="font-bold text-[#1A1A1A]">Foto Profil (Sinkron Google / Cloudinary)</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CloudinaryUploadButton
                        folder="babyshalls/avatars"
                        resourceType="image"
                        buttonLabel="Ganti Foto Profil"
                        onUploaded={(url) => setEditAvatarUrl(url)}
                      />
                      {editAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setEditAvatarUrl('')}
                          className="px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      Otomatis tersinkronisasi saat login Google, atau unggah foto baru lalu klik Simpan Perubahan.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={editPhone}
                    onChange={(e) => setEditPhone(formatPhoneInput(e.target.value))}
                    placeholder="0812-3456-7890"
                    maxLength={18}
                    className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nama Ayah / Ibu (Untuk Autofill)</label>
                  <input
                    type="text"
                    value={editParentName}
                    onChange={(e) => setEditParentName(e.target.value)}
                    placeholder="Contoh: Ibu Rania / Ayah Dimas"
                    className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nama Anak</label>
                  <input
                    type="text"
                    value={editChildName}
                    onChange={(e) => setEditChildName(e.target.value)}
                    placeholder="Contoh: Arka"
                    className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Umur Anak</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      max={editChildAgeUnit === 'Tahun' ? 18 : 36}
                      step="1"
                      inputMode="numeric"
                      value={editChildAgeValue}
                      onChange={(e) => setEditChildAgeValue(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder={editChildAgeUnit === 'Tahun' ? '2' : '18'}
                      className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl"
                    />
                    <select
                      value={editChildAgeUnit}
                      onChange={(e) => setEditChildAgeUnit(e.target.value as 'Tahun' | 'Bulan')}
                      className="h-[42px] px-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl font-bold"
                    >
                      <option value="Tahun">Tahun</option>
                      <option value="Bulan">Bulan</option>
                    </select>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 pt-1 cursor-pointer text-[#4A4A4A]">
                <input
                  type="checkbox"
                  checked={editEmailOptIn}
                  onChange={(e) => setEditEmailOptIn(e.target.checked)}
                  className="accent-[#1E543B]"
                />
                <span>Terima broadcast email promo terbaru &amp; jadwal event/workshop BabyShalls</span>
              </label>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="min-h-[42px] px-5 rounded-full bg-[#1A1A1A] text-white font-bold"
              >
                {updateProfileMutation.isPending ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </form>
            <AccountSecurityCards currentEmail={profile?.email || ''} />
          </div>
          )}

          {activeMenu === 'addresses' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5 text-xs">
              <h2 className="text-base font-extrabold text-[#1A1A1A]">Buku Alamat Pengiriman</h2>
              <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <input type="text" required value={addrLabel} onChange={(e) => setAddrLabel(e.target.value)} placeholder="Label (Rumah/Kantor)" className="h-10 px-3 bg-white border border-[#E5E7EB] rounded-lg" />
                <input type="text" required value={addrReceiver} onChange={(e) => setAddrReceiver(e.target.value)} placeholder="Nama Penerima *" className="h-10 px-3 bg-white border border-[#E5E7EB] rounded-lg" />
                <input type="tel" required value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} placeholder="No. HP *" className="h-10 px-3 bg-white border border-[#E5E7EB] rounded-lg" />
                <input type="text" required value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} placeholder="Alamat Lengkap *" className="sm:col-span-2 h-10 px-3 bg-white border border-[#E5E7EB] rounded-lg" />
                <div className="flex gap-2">
                  <input type="text" required value={addrPostal} onChange={(e) => setAddrPostal(e.target.value)} placeholder="Kode Pos *" className="w-28 h-10 px-3 bg-white border border-[#E5E7EB] rounded-lg" />
                  <button type="submit" className="flex-1 h-10 rounded-lg bg-[#1A1A1A] text-white font-bold inline-flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
              </form>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-xl border border-[#E5E7EB] flex items-start justify-between gap-4">
                    <div>
                      <span className="font-extrabold text-[#1A1A1A]">{addr.label}</span>
                      <span className="text-[#6B7280] ml-2">• {addr.receiverName} ({addr.receiverPhone})</span>
                      <p className="text-[#4A4A4A] mt-1">{addr.streetAddress}, {addr.city} {addr.postalCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        deleteAddressMutation.mutate(addr.id, {
                          onSuccess: () => toast.success('Alamat berhasil dihapus.'),
                          onError: (err) => toast.error(extractApiError(err, 'Gagal menghapus alamat.')),
                        })
                      }
                      className="p-1.5 text-[#6B7280] hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'wishlist' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-extrabold text-[#1A1A1A]">Wishlist Saya ({wishlistProducts.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlistProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'tickets' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-[#1A1A1A]">Tiket Workshop Saya</h2>
              {tickets.length === 0 ? (
                <p className="text-[#6B7280]">Belum ada tiket workshop terdaftar pada akun ini.</p>
              ) : (
                tickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-extrabold text-[#1A1A1A]">{t.event.title}</div>
                      <div className="text-[#6B7280]">
                        {t.childName} ({t.childAge}) • {t.ticketQuantity} Tiket
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.paymentStatus === 'PAID' || t.paymentStatus === 'FREE'
                              ? 'bg-[#E9F3E4] text-[#1E543B]'
                              : 'bg-[#FDF0B8] text-[#1A1A1A]'
                          }`}
                        >
                          {t.paymentStatus === 'FREE'
                            ? 'Gratis'
                            : t.paymentStatus === 'PAID'
                            ? 'Lunas'
                            : 'Menunggu Pembayaran'}
                        </span>
                        <span className="text-[11px] text-[#6B7280]">Status: {t.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {t.paymentStatus === 'PENDING' && (
                        <button
                          type="button"
                          disabled={payEventTicketMutation.isPending}
                          onClick={async () => {
                            try {
                              const res = await payEventTicketMutation.mutateAsync(t.id);
                              openMidtransSnap(res.snapToken, res.redirectUrl, {
                                onSuccess: () => {
                                  toast.success('Pembayaran tiket berhasil!');
                                  queryClient.invalidateQueries({ queryKey: ['account-tickets'] });
                                },
                                onPending: () => toast('Menunggu pembayaran tiket Anda.'),
                                onError: () => toast.error('Pembayaran gagal, silakan coba lagi.'),
                              });
                            } catch (err) {
                              toast.error(extractApiError(err, 'Gagal membuka pembayaran tiket.'));
                            }
                          }}
                          className="px-4 h-9 rounded-full bg-[#D9744A] text-white font-bold text-xs hover:bg-[#c5633b] transition-colors disabled:opacity-60"
                        >
                          {payEventTicketMutation.isPending ? 'Memuat...' : 'Bayar Tiket'}
                        </button>
                      )}
                      <div className="flex items-center gap-3">
                        {t.ticketCode && (
                          <button
                            type="button"
                            onClick={() => setSelectedQrTicket(t)}
                            className="inline-flex items-center gap-2.5 p-2 rounded-xl bg-[#FCF6EC] border border-[#EBDCCB] hover:border-[#1E543B] transition-colors text-left"
                            title="Klik untuk memperbesar QR E-Ticket"
                          >
                            <QRCodeCanvas value={t.ticketCode} size={48} />
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1E543B] flex items-center gap-1">
                                <QrCode className="w-3 h-3" /> Lihat QR
                              </div>
                              <div className="font-mono font-bold text-[#1A1A1A] text-[11px]">
                                {t.ticketCode}
                              </div>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeMenu === 'vouchers' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-[#1A1A1A]">Voucher Aktif BabyShalls</h2>
                <span className="text-[11px] text-[#6B7280]">
                  Tersinkronisasi dengan promo beranda &amp; checkout
                </span>
              </div>
              {couponsLoading ? (
                <p className="text-[#6B7280]">Memuat daftar voucher...</p>
              ) : activeCoupons.length === 0 ? (
                <p className="text-[#6B7280]">Belum ada voucher promo aktif saat ini.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCoupons.map((v) => {
                    const claimed = isVoucherClaimed(v.code);
                    const usedByAccount = orders.some(
                      (o) => o.couponCode?.toUpperCase() === v.code.toUpperCase() && o.status !== 'CANCELLED'
                    );
                    const discountLabel =
                      v.discountType === 'PERCENTAGE'
                        ? `Diskon ${v.discountValue}%${v.maxDiscount ? ` (Maks. ${formatIDR(v.maxDiscount)})` : ''}`
                        : v.discountType === 'SHIPPING_SUBSIDY'
                        ? `Subsidi Ongkir ${formatIDR(v.discountValue)}`
                        : `Potongan ${formatIDR(v.discountValue)}`;

                    return (
                      <div
                        key={v.id}
                        className={`p-4 rounded-xl border space-y-2.5 ${
                          claimed ? 'border-[#1E543B]/40 bg-[#E9F3E4]/35' : 'border-[#E5E7EB] bg-[#FAF4E8]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-mono font-extrabold text-sm text-[#1A1A1A]">{v.code}</div>
                            <div className="font-bold text-[#1E543B] mt-0.5">{discountLabel}</div>
                          </div>
                          {usedByAccount ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E5E7EB] text-[#4A4A4A] text-[10px] font-bold">
                              Sudah Dipakai
                            </span>
                          ) : claimed ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E9F3E4] text-[#1E543B] text-[10px] font-bold">
                              Sudah Diklaim
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[#4A4A4A]">{v.description || 'Berlaku untuk transaksi BabyShalls.'}</p>
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E5E7EB]/60 text-[11px] text-[#6B7280]">
                          <span>Min. belanja: {v.minOrder > 0 ? formatIDR(v.minOrder) : 'Tanpa minimal'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (!claimed) claimVoucher(v.code);
                              navigator.clipboard?.writeText(v.code).catch(() => {});
                              toast.success(
                                claimed
                                  ? `Kode ${v.code} disalin ke clipboard!`
                                  : `Voucher ${v.code} diklaim & disalin!`
                              );
                            }}
                            className={`px-3 h-7 rounded-full font-bold text-[11px] transition-colors ${
                              claimed
                                ? 'bg-white border border-[#1E543B] text-[#1E543B]'
                                : 'bg-[#1A1A1A] text-white hover:bg-[#333333]'
                            }`}
                          >
                            {claimed ? 'Salin Kode' : 'Klaim'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {selectedQrTicket && selectedQrTicket.ticketCode && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedQrTicket(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedQrTicket(null)}
              aria-label="Tutup modal QR"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E543B]">
                E-Ticket Check-in Workshop
              </span>
              <h3 className="text-base font-extrabold text-[#1A1A1A]">
                {selectedQrTicket.event.title}
              </h3>
            </div>
            <div className="inline-flex p-3 rounded-2xl bg-[#FCF6EC] border border-[#EBDCCB] mx-auto">
              <QRCodeCanvas value={selectedQrTicket.ticketCode} size={180} />
            </div>
            <div className="font-mono font-extrabold text-sm text-[#1A1A1A]">
              {selectedQrTicket.ticketCode}
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-3.5 text-left text-xs space-y-1.5 text-[#4A4A4A]">
              <div>
                <strong>Peserta:</strong> {selectedQrTicket.childName} ({selectedQrTicket.childAge}) •{' '}
                {selectedQrTicket.ticketQuantity} Tiket
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1E543B] shrink-0" />
                <span>
                  {selectedQrTicket.event.eventDate &&
                  !Number.isNaN(Date.parse(selectedQrTicket.event.eventDate))
                    ? new Date(selectedQrTicket.event.eventDate).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}{' '}
                  ({selectedQrTicket.event.timeString})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1E543B] shrink-0" />
                <span>{selectedQrTicket.event.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
