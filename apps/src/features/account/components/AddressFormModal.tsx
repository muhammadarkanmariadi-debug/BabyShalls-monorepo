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
      setErrorMsg('Recipient name is required.');
      return;
    }
    if (!receiverPhone.trim() || receiverPhone.trim().length < 8) {
      setErrorMsg('Recipient phone number must be at least 8 digits.');
      return;
    }
    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      setErrorMsg('Complete street address must be at least 5 characters.');
      return;
    }
    if (!city.trim() || !subdistrict.trim()) {
      setErrorMsg('City and district are required.');
      return;
    }

    try {
      if (addressToEdit) {
        await updateMutation.mutateAsync({
          id: addressToEdit.id,
          label: label.trim() || 'Home',
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
          label: label.trim() || 'Home',
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
        onSuccess?.('Shipping address updated successfully!');
      } else {
        onSuccess?.('New shipping address added successfully!');
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to save address.';
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
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-[#B05A26]" />
          <h3 className="text-base font-semibold text-[#4A2A1C]">
            {addressToEdit ? 'Edit Shipping Address' : 'Add New Shipping Address'}
          </h3>
        </div>
        <p className="text-xs text-[#7A5644] mb-4">
          Please provide complete address details and an active phone number to ensure smooth book delivery.
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
                Address Label
              </label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] bg-white focus:outline-none focus:border-[#B05A26]"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Apartment">Apartment</option>
                <option value="Grandparents">Grandparents</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#7A5644] font-medium mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="e.g. Dina Permata"
                required
                className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] placeholder:text-[#A89080] focus:outline-none focus:border-[#B05A26]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#7A5644] font-medium mb-1">
              Recipient WhatsApp / Phone
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
              Complete Street Address (Street, House No., Building, Landmark)
            </label>
            <textarea
              rows={3}
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Jl. Cempaka No. 12, RT 02 / RW 04, near security post..."
              required
              className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] placeholder:text-[#A89080] focus:outline-none focus:border-[#B05A26]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#7A5644] font-medium mb-1">
                City / Regency
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
                District
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
                Postal Code
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
              Set as primary shipping address
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F2E4D6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E6D2C0] text-[#7A5644] hover:bg-[#FFF6EA] font-medium rounded-[2px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#B05A26] hover:bg-[#964B1F] text-white font-medium rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{addressToEdit ? 'Save Changes' : 'Add Address'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
