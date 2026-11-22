'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { AccountAddress, useCreateAccountAddress, useUpdateAccountAddress } from '@/hooks/useAccount';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit: AccountAddress | null;
  defaultReceiverName?: string;
  defaultPhone?: string;
  onSuccess?: (message: string) => void;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  addressToEdit,
  defaultReceiverName = '',
  defaultPhone = '',
  onSuccess,
}) => {
  const [label, setLabel] = useState('Rumah');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Kota Malang');
  const [subdistrict, setSubdistrict] = useState('Klojen');
  const [postalCode, setPostalCode] = useState('65111');
  const [isDefault, setIsDefault] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const createMutation = useCreateAccountAddress();
  const updateMutation = useUpdateAccountAddress();

  useEffect(() => {
    if (addressToEdit) {
      setLabel(addressToEdit.label || 'Rumah');
      setReceiverName(addressToEdit.receiverName || '');
      setReceiverPhone(addressToEdit.receiverPhone || '');
      setStreetAddress(addressToEdit.streetAddress || '');
      setCity(addressToEdit.city || 'Kota Malang');
      setSubdistrict(addressToEdit.subdistrict || 'Klojen');
      setPostalCode(addressToEdit.postalCode || '65111');
      setIsDefault(Boolean(addressToEdit.isDefault));
    } else {
      setLabel('Rumah');
      setReceiverName(defaultReceiverName);
      setReceiverPhone(defaultPhone);
      setStreetAddress('');
      setCity('Kota Malang');
      setSubdistrict('Klojen');
      setPostalCode('65111');
      setIsDefault(false);
    }
    setErrorMsg('');
  }, [addressToEdit, defaultReceiverName, defaultPhone, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!receiverName.trim()) {
      setErrorMsg('Nama penerima wajib diisi.');
      return;
    }
    if (!receiverPhone.trim() || receiverPhone.trim().length < 8) {
      setErrorMsg('Nomor telepon penerima minimal 8 digit.');
      return;
    }
    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      setErrorMsg('Alamat lengkap jalan/nomor rumah minimal 5 karakter.');
      return;
    }
    if (!city.trim() || !subdistrict.trim()) {
      setErrorMsg('Kota dan kecamatan wajib diisi.');
      return;
    }

    try {
      if (addressToEdit) {
        await updateMutation.mutateAsync({
          id: addressToEdit.id,
          label: label.trim() || 'Rumah',
          receiverName: receiverName.trim(),
          receiverPhone: receiverPhone.trim(),
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          subdistrict: subdistrict.trim(),
          postalCode: postalCode.trim(),
          isDefault,
        });
      } else {
        await createMutation.mutateAsync({
          label: label.trim() || 'Rumah',
          receiverName: receiverName.trim(),
          receiverPhone: receiverPhone.trim(),
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          subdistrict: subdistrict.trim(),
          postalCode: postalCode.trim(),
          isDefault,
        });
      }
      if (addressToEdit) {
        onSuccess?.('Alamat pengiriman berhasil diperbarui!');
      } else {
        onSuccess?.('Alamat baru berhasil ditambahkan!');
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Gagal menyimpan alamat.';
      setErrorMsg(msg);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E6D2C0] rounded-[2px] p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A5644] hover:text-[#4A2A1C] p-1 cursor-pointer transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-[#B05A26]" />
          <h3 className="text-base font-semibold text-[#4A2A1C]">
            {addressToEdit ? 'Ubah Alamat Pengiriman' : 'Tambah Alamat Pengiriman Baru'}
          </h3>
        </div>
        <p className="text-xs text-[#7A5644] mb-4">
          Pastikan rincian alamat lengkap dan nomor telepon aktif untuk memudahkan kurir mengantarkan buku.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#FDF0ED] border border-[#F5C2B8] text-[#C0392B] text-xs rounded-[2px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#7A5644] font-medium mb-1">
                Label Alamat
              </label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] bg-white focus:outline-none focus:border-[#B05A26]"
              >
                <option value="Rumah">Rumah</option>
                <option value="Kantor">Kantor</option>
                <option value="Apartemen">Apartemen</option>
                <option value="Rumah Nenek">Rumah Nenek</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#7A5644] font-medium mb-1">
                Nama Penerima
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="cth: Dina Permata"
                required
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] placeholder:text-[#A89080] focus:outline-none focus:border-[#B05A26]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#7A5644] font-medium mb-1">
              Nomor WhatsApp / HP Penerima
            </label>
            <input
              type="text"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              placeholder="0812-xxxx-xxxx"
              required
              className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] placeholder:text-[#A89080] focus:outline-none focus:border-[#B05A26]"
            />
          </div>

          <div>
            <label className="block text-[#7A5644] font-medium mb-1">
              Alamat Lengkap (Jalan, RT/RW, No. Rumah, Patokan)
            </label>
            <textarea
              rows={3}
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Jl. Cempaka No. 12, RT 02 / RW 04, dekat pos satpam..."
              required
              className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] placeholder:text-[#A89080] focus:outline-none focus:border-[#B05A26]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#7A5644] font-medium mb-1">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kota Malang"
                required
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
              />
            </div>

            <div>
              <label className="block text-[#7A5644] font-medium mb-1">
                Kecamatan
              </label>
              <input
                type="text"
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                placeholder="Klojen"
                required
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
              />
            </div>

            <div>
              <label className="block text-[#7A5644] font-medium mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="65111"
                required
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefaultCheckbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded-[2px] text-[#B05A26] accent-[#B05A26] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isDefaultCheckbox" className="text-xs text-[#4A2A1C] cursor-pointer">
              Jadikan sebagai alamat utama pengiriman
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F2E4D6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E6D2C0] text-[#7A5644] hover:bg-[#FFF6EA] font-medium rounded-[2px] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{addressToEdit ? 'Simpan Perubahan' : 'Tambah Alamat'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
