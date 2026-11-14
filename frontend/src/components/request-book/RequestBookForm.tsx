'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateBookRequest } from '../../hooks/useBookRequests';
import { extractApiError } from '../../lib/axios';
import { formatPhoneInput } from '../../lib/utils';
import { AutoFillProfileButton } from '../account/AutoFillProfileButton';
import { CloudinaryUploadButton } from '../ui/CloudinaryUploadButton';

interface RequestBookFormProps {
  compact?: boolean;
}

export const RequestBookForm: React.FC<RequestBookFormProps> = ({ compact = false }) => {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createBookRequest = useCreateBookRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBookRequest.mutateAsync({
        title: bookTitle,
        authorPublisher: authorName || undefined,
        customerName: customerName || undefined,
        whatsappNumber: phone,
        notes: notes || undefined,
        referenceImageUrl: referenceImageUrl.trim() || undefined,
      });
      setIsSubmitted(true);
      toast.success('Permintaan buku berhasil dikirim.');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal mengirim permintaan buku.'));
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] space-y-4">
        <div className="flex items-center gap-2 text-[#1E543B] font-bold text-base">
          <CheckCircle2 className="w-5 h-5" />
          <span>Permintaan Buku Diterima</span>
        </div>
        <p className="text-sm text-[#4A4A4A] leading-relaxed">
          Terima kasih <strong>{customerName}</strong>. Tim kami sedang memeriksa ketersediaan{' '}
          <strong>&ldquo;{bookTitle}&rdquo;</strong> dan akan menghubungi Anda melalui WhatsApp ({phone}).
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setBookTitle('');
            setAuthorName('');
            setNotes('');
          }}
          className="min-h-[42px] px-5 rounded bg-white border border-[#CBD5E1] text-[#1A1A1A] font-bold text-xs hover:border-[#1A1A1A] cursor-pointer"
        >
          Request Buku Lainnya
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Judul Buku *
          </label>
          <input
            type="text"
            required
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="Contoh: The Very Hungry Caterpillar"
            className="w-full h-[44px] px-3.5 text-sm bg-white border border-[#CBD5E1] rounded text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Penulis / Penerbit / ISBN (Opsional)
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Contoh: Eric Carle / Usborne / DK"
            className="w-full h-[44px] px-3.5 text-sm bg-white border border-[#CBD5E1] rounded text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#6B7280]">Data Pemesan</span>
        <AutoFillProfileButton
          onAutoFill={(user) => {
            if (user.parentName || user.name) setCustomerName(user.parentName || user.name);
            if (user.phone) setPhone(user.phone);
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Nama Anda *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama lengkap"
            className="w-full h-[44px] px-3.5 text-sm bg-white border border-[#CBD5E1] rounded text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Nomor WhatsApp *
          </label>
          <input
            type="tel"
            inputMode="numeric"
            required
            value={phone}
            onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
            placeholder="0812-3456-7890"
            maxLength={18}
            className="w-full h-[44px] px-3.5 text-sm bg-white border border-[#CBD5E1] rounded text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
          Lampiran Gambar / File Referensi (Opsional)
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <CloudinaryUploadButton
            folder="babyshalls/book-requests"
            resourceType="auto"
            buttonLabel={referenceImageUrl ? 'Ganti Gambar/File Referensi' : 'Upload Gambar / File Referensi'}
            onUploaded={(url) => setReferenceImageUrl(url)}
          />
          {referenceImageUrl && (
            <span className="text-xs text-[#1E543B] font-semibold truncate max-w-xs">
              Terlampir: {referenceImageUrl}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
          Catatan Tambahan (Opsional)
        </label>
        <textarea
          rows={compact ? 3 : 4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Misal: edisi Board Book, usia anak, atau estimasi budget..."
          className="w-full p-3.5 text-sm bg-white border border-[#CBD5E1] rounded text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
        />
      </div>

      <button
        type="submit"
        className="min-h-[44px] px-7 rounded bg-[#1E543B] hover:bg-[#163F2C] text-white font-bold text-sm transition-colors cursor-pointer"
      >
        Kirim Permintaan
      </button>
    </form>
  );
};

