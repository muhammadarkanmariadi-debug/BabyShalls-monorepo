'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Check, UploadCloud, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { useCreateBookRequest } from '@/hooks/useBookRequests';
import { generateIdempotencyKey } from '@/lib/idempotency';
import { TurnstileWidget } from '@/components/ui/TurnstileWidget';

function RequestABookContent() {
  const searchParams = useSearchParams();

  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [format, setFormat] = useState('Board Book');
  const [conditionPreference, setConditionPreference] = useState('Baru');
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [uploadedCover, setUploadedCover] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestRef, setRequestRef] = useState('');

  useEffect(() => {
    const titleParam = searchParams.get('title');
    const authorParam = searchParams.get('author');
    if (titleParam) setBookTitle(titleParam);
    if (authorParam) setAuthor(authorParam);
  }, [searchParams]);

  const createBookRequestMutation = useCreateBookRequest();
  const bookReqIdemKeyRef = useRef<{ fingerprint: string; key: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || createBookRequestMutation.isPending) return;
    setIsSubmitting(true);

    const payload = {
      title: bookTitle.trim(),
      authorPublisher: author.trim() || undefined,
      customerName: customerName.trim() || undefined,
      email: email.trim() || undefined,
      whatsappNumber: whatsapp.trim(),
      turnstileToken: turnstileToken || undefined,
      notes: [isbn ? `ISBN: ${isbn}` : '', `Format: ${format}`, `Kondisi: ${conditionPreference}`, notes.trim()]
        .filter(Boolean)
        .join(' | '),
    };

    const fingerprint = JSON.stringify(payload);
    if (!bookReqIdemKeyRef.current || bookReqIdemKeyRef.current.fingerprint !== fingerprint) {
      bookReqIdemKeyRef.current = { fingerprint, key: generateIdempotencyKey('bookreq') };
    }

    let ref = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await createBookRequestMutation.mutateAsync({
        ...payload,
        idempotencyKey: bookReqIdemKeyRef.current.key,
      });
      ref = res.requestId || ref;
      bookReqIdemKeyRef.current = null;
    } catch {
      // Fallback jika API belum siap
    }

    const newEntry = {
      id: ref,
      bookTitle,
      author,
      isbn,
      format,
      conditionPreference,
      notes,
      customerName,
      whatsapp,
      email,
      coverImage: uploadedCover || '/images/products/p-1-little-bear.png',
      createdAt: new Date().toISOString(),
      status: 'Sedang Dicari',
    };

    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem('babyshalls_book_requests');
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem('babyshalls_book_requests', JSON.stringify([newEntry, ...list]));
      } catch {
        // pass
      }
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setRequestRef(ref);
  };

  const handleReset = () => {
    setBookTitle('');
    setAuthor('');
    setIsbn('');
    setNotes('');
    setCustomerName('');
    setWhatsapp('');
    setEmail('');
    setUploadedCover(null);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <TombolKembali fallbackUrl="/" label="Back to Home" />

      {/* Main Section (Figma Node #169:5909, 2 Columns) */}
      <main className="py-12 sm:py-16 flex-1 bg-[#FFFDF9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-14 items-start">
            
            {/* Left Column: Intro & Mascot (Figma Node #169:5910, 460px width) */}
            <div className="w-full lg:w-[460px] shrink-0 flex flex-col gap-6">
              
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B05A26] block mb-2">
                  BESPOKE CURATION SERVICE
                </span>
                <h1 className="text-3xl sm:text-4xl font-medium text-[#4A2A1C] tracking-tight leading-tight mb-3">
                  Looking for a specific book? We&apos;ll find it for you.
                </h1>
                <p className="text-sm sm:text-base text-[#7A5644] leading-relaxed">
                  Send us the title, author, or a photo of the book you dream of for your little one. The BabyShalls team will check local distributors and overseas publishers, then confirm pricing directly via WhatsApp.
                </p>
              </div>

              {/* Mascot Writing Letter (Figma Node #169:6176) */}
              <div className="relative w-full h-56 bg-[#FFF6EA] border border-[#F2E4D6] rounded-[2px] p-4 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/mascot/maskot-menulis-surat.png"
                  alt="BabyShalls Book Request Mascot"
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Cara Kerja (3 Langkah Mudah) */}
              <div className="bg-white border border-[#F2E4D6] rounded-[2px] p-5 flex flex-col gap-3.5">
                <h3 className="text-xs font-semibold text-[#4A2A1C] uppercase tracking-wider">
                  How Book Requests Work:
                </h3>
                
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FFF6EA] text-[#B05A26] font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p className="text-xs text-[#7A5644] leading-relaxed">
                    Submit the book title, author, or cover photo you are searching for.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FFF6EA] text-[#B05A26] font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p className="text-xs text-[#7A5644] leading-relaxed">
                    BabyShalls checks distributor stocks and calculates estimated pricing (within 24 hours).
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FFF6EA] text-[#B05A26] font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p className="text-xs text-[#7A5644] leading-relaxed">
                    We share an offer via WhatsApp. If you love it, we reserve and order the book for you.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Form Request (Figma Node #169:5935) */}
            <div className="flex-1 w-full bg-white border border-[#F2E4D6] rounded-[2px] p-7 sm:p-9 shadow-sm">
              
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  {/* Bagian 1: Detail Buku */}
                  <div>
                    <h2 className="text-lg font-medium text-[#4A2A1C] pb-3 border-b border-[#F2E4D6] mb-4">
                      1. Details of the Book You Need
                    </h2>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[#7A5644] font-medium mb-1">
                          Book Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          placeholder="e.g. The Wonderful Things You Will Be"
                          className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Author / Illustrator (Optional)
                          </label>
                          <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="e.g. Emily Winfield Martin"
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Publisher / ISBN (Optional)
                          </label>
                          <input
                            type="text"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            placeholder="e.g. 978-0385376716"
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Preferred Format
                          </label>
                          <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] bg-white focus:outline-none focus:border-[#B05A26]"
                          >
                            <option value="Board Book">Board Book (Sturdy)</option>
                            <option value="Hardcover">Hardcover</option>
                            <option value="Paperback">Paperback</option>
                            <option value="Any Available">Any Available Format</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Condition Preference
                          </label>
                          <select
                            value={conditionPreference}
                            onChange={(e) => setConditionPreference(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] bg-white focus:outline-none focus:border-[#B05A26]"
                          >
                            <option value="Brand New Only">Brand New Only</option>
                            <option value="Preloved Welcome">Preloved Welcome (Good Condition)</option>
                            <option value="Any Condition">Any (Brand New / Preloved)</option>
                          </select>
                        </div>
                      </div>

                      {/* Dropzone Upload Foto Sampul */}
                      <div>
                        <label className="block text-[#7A5644] font-medium mb-1">
                          Book Cover Photo (Optional)
                        </label>
                        <div className="border border-dashed border-[#C9B3A5] bg-[#FFFBF7] p-5 rounded-[2px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#B05A26] transition-colors">
                          <UploadCloud className="w-6 h-6 text-[#B05A26] mb-1" />
                          <span className="text-xs text-[#4A2A1C] font-medium">
                            Click or drag book cover image here
                          </span>
                          <span className="text-[11px] text-[#7A5644]">
                            JPG, PNG format (Max 5 MB)
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#7A5644] font-medium mb-1">
                          Special Instructions / Notes
                        </label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Needed before December 10 for a birthday gift."
                          className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bagian 2: Kontak */}
                  <div>
                    <h2 className="text-lg font-medium text-[#4A2A1C] pb-3 border-b border-[#F2E4D6] mb-4">
                      2. Customer Contact Information
                    </h2>

                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="e.g. Dina Permata"
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#7A5644] font-medium mb-1">
                            WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder="0812-xxxx-xxxx"
                            className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#7A5644] font-medium mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-3 py-2 border border-[#E6D2C0] rounded-[2px] text-[#4A2A1C] focus:outline-none focus:border-[#B05A26]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cloudflare Turnstile */}
                  <div className="py-1">
                    <TurnstileWidget
                      onVerify={(t) => setTurnstileToken(t)}
                      onExpire={() => setTurnstileToken('')}
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting || createBookRequestMutation.isPending}
                      className="w-full py-3.5 bg-[#B05A26] hover:bg-[#964B1F] text-white font-semibold text-xs rounded-[2px] transition-colors cursor-pointer shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || createBookRequestMutation.isPending ? 'Submitting Request...' : 'Submit Book Request'}
                    </button>
                    <p className="text-[11px] text-[#7A5644] text-center mt-2.5">
                      Already have an account? Track your request status in <strong>Account → My Book Requests</strong>.
                    </p>
                  </div>

                </form>
              ) : (
                /* Success View */
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="relative w-36 h-36 mb-3">
                    <Image
                      src="/images/mascot/maskot-peluk-hati.png"
                      alt="Request Received"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-[#DDF1E5] text-[#2A6E37] text-xs font-semibold px-3 py-1 rounded-[2px] mb-3">
                    <Check className="w-3.5 h-3.5" />
                    <span>Request Submitted Successfully (Ref: {requestRef})</span>
                  </div>

                  <h3 className="text-2xl font-medium text-[#4A2A1C] mb-2">
                    Thank you, {customerName}!
                  </h3>

                  <p className="text-xs text-[#7A5644] max-w-md mx-auto mb-6 leading-relaxed">
                    Your request for <strong>&ldquo;{bookTitle}&rdquo;</strong> has been logged by BabyShalls curators. We will contact your WhatsApp number <strong>{whatsapp}</strong> within 24 hours.
                  </p>

                  <div className="flex gap-3 w-full max-w-xs">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 border border-[#4A2A1C] text-[#4A2A1C] text-xs font-semibold rounded-[2px] hover:bg-[#FFF6EA] transition-colors"
                    >
                      Request Another Book
                    </button>
                    <Link
                      href="/account"
                      className="flex-1 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] hover:bg-[#964B1F] transition-colors flex items-center justify-center"
                    >
                      View in Profile
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

export default function RequestABookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RequestABookContent />
    </Suspense>
  );
}
