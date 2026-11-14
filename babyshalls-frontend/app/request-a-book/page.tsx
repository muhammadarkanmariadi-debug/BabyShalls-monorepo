'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, ArrowLeft, BookOpen, Sparkles, Send } from 'lucide-react';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { OrderDrawer } from '../../src/components/OrderDrawer';

function RequestABookContent() {
  const searchParams = useSearchParams();

  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [notes, setNotes] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestRef, setRequestRef] = useState('');

  useEffect(() => {
    const titleParam = searchParams.get('title');
    const authorParam = searchParams.get('author');
    if (titleParam) setBookTitle(titleParam);
    if (authorParam) setAuthor(authorParam);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ref = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const existing = localStorage.getItem('babyshalls_book_requests');
      const list = existing ? JSON.parse(existing) : [];
      const newEntry = {
        id: ref,
        bookTitle,
        author,
        notes,
        contactEmail,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      localStorage.setItem('babyshalls_book_requests', JSON.stringify([newEntry, ...list]));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setRequestRef(ref);
    }, 600);
  };

  const handleReset = () => {
    setBookTitle('');
    setAuthor('');
    setNotes('');
    setContactEmail('');
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#221F1F] flex flex-col justify-between selection:bg-[#C86D51]/20 selection:text-[#C86D51]">
      <Header />

      <main className="flex-grow py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#5C5753] hover:text-[#221F1F] transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              <span>Back to bookstore</span>
            </Link>
          </div>

          {/* Intro Heading */}
          <div className="text-center mb-10 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C86D51]">
              Curator Concierge Service
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#221F1F]">
              Request a Book Title
            </h1>
            <p className="text-sm text-[#5C5753] max-w-md mx-auto leading-relaxed">
              Looking for a specific board book edition, rare international picture book, or bilingual story? Our curator will source it for you directly.
            </p>
          </div>

          {/* The Form: Centered inside a white card with delicate linen border */}
          <div className="bg-white border border-[#EAE6DF] rounded-lg p-8 sm:p-10 shadow-xs text-left">
            {isSuccess ? (
              <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-[#EBF2E8] text-[#3D5632] flex items-center justify-center mx-auto border border-[#8FA882]/40">
                  <Check size={26} strokeWidth={2} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-[#221F1F]">
                    Request Received
                  </h3>
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#C86D51]">
                    Reference: {requestRef}
                  </p>
                </div>

                <p className="text-sm text-[#5C5753] max-w-md mx-auto leading-relaxed">
                  Thank you! Our curator is checking our international and domestic publisher networks. We will reply to <strong className="text-[#221F1F] font-medium">{contactEmail}</strong> with pricing and delivery timeline within 24 hours.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-[#221F1F] border border-[#EAE6DF] hover:border-[#C86D51] rounded-md transition-colors cursor-pointer"
                  >
                    Submit Another Title
                  </button>
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#C86D51] hover:bg-[#b2583d] rounded-md transition-colors text-center shadow-xs"
                  >
                    Return to Store
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Field 1: Book Title */}
                <div>
                  <label htmlFor="bookTitle" className="block text-xs font-semibold text-[#221F1F] mb-1.5 uppercase tracking-wider">
                    Book Title *
                  </label>
                  <input
                    id="bookTitle"
                    type="text"
                    required
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="e.g. Blueberries for Sal"
                    className="w-full text-sm px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-md text-[#221F1F] placeholder-[#8C8782] focus:outline-none focus:border-[#C86D51] transition-colors"
                  />
                </div>

                {/* Field 2: Author */}
                <div>
                  <label htmlFor="author" className="block text-xs font-semibold text-[#221F1F] mb-1.5 uppercase tracking-wider">
                    Author / Illustrator
                  </label>
                  <input
                    id="author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Robert McCloskey"
                    className="w-full text-sm px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-md text-[#221F1F] placeholder-[#8C8782] focus:outline-none focus:border-[#C86D51] transition-colors"
                  />
                </div>

                {/* Field 3: Notes (Textarea) */}
                <div>
                  <label htmlFor="notes" className="block text-xs font-semibold text-[#221F1F] mb-1.5 uppercase tracking-wider">
                    Format &amp; Specific Edition Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Let us know if you prefer hardcover, board book, bilingual edition, or your child's age group..."
                    className="w-full text-sm px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-md text-[#221F1F] placeholder-[#8C8782] focus:outline-none focus:border-[#C86D51] transition-colors resize-y"
                  />
                </div>

                {/* Field 4: Contact/Email */}
                <div>
                  <label htmlFor="contactEmail" className="block text-xs font-semibold text-[#221F1F] mb-1.5 uppercase tracking-wider">
                    Contact Email or WhatsApp *
                  </label>
                  <input
                    id="contactEmail"
                    type="text"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@example.com or 08123456789"
                    className="w-full text-sm px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-md text-[#221F1F] placeholder-[#8C8782] focus:outline-none focus:border-[#C86D51] transition-colors"
                  />
                  <p className="mt-1.5 text-[11px] text-[#5C5753]">
                    We will notify you with availability, estimated pricing, and delivery timeline.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#C86D51] hover:bg-[#b2583d] disabled:opacity-70 text-white rounded-md text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Request to Curator...</span>
                    ) : (
                      <>
                        <Send size={15} strokeWidth={1.5} />
                        <span>Submit Book Request</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

          <div className="mt-8 text-center text-xs text-[#5C5753] space-y-1">
            <p>Directly curated by BabyShalls • Citraland Puncak Tidar, Malang</p>
            <p>No obligation to purchase. We gladly assist parents &amp; educators.</p>
          </div>

        </div>
      </main>

      <Footer />
      <OrderDrawer />
    </div>
  );
}

export default function RequestABookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-sm text-[#5C5753]">Loading book request form...</div>}>
      <RequestABookContent />
    </Suspense>
  );
}
