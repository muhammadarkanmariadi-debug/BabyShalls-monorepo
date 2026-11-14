'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Check, Send } from 'lucide-react';

export const BookRequestBanner: React.FC = () => {
  const [parentName, setParentName] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !email) return;

    // Save to localStorage submissions for demo
    try {
      const existing = JSON.parse(localStorage.getItem('babyshalls_book_requests') || '[]');
      existing.unshift({
        id: `req-${Date.now()}`,
        parentName,
        bookTitle,
        email,
        date: new Date().toISOString()
      });
      localStorage.setItem('babyshalls_book_requests', JSON.stringify(existing));
    } catch {
      // fallback
    }

    setIsSubmitted(true);
  };

  return (
    <section className="bg-[#FAFAFA] py-16 md:py-24 border-b border-[#E5E5E5]" id="book-request">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered White Card Form with Thin Border & Subtle Shadow */}
        <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm p-8 sm:p-12 text-left">
          
          <div className="max-w-xl mx-auto text-center space-y-2 mb-8">
            <span className="text-xs uppercase tracking-widest text-[#FF6B35] font-semibold">
              Curator Concierge
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Can’t Find a Specific Title?
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              We source hard-to-find international children’s books directly from overseas publishers for our families in Malang. Tell us what you are looking for.
            </p>
          </div>

          {isSubmitted ? (
            <div className="max-w-md mx-auto text-center py-8 space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full flex items-center justify-center mx-auto">
                <Check size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">
                Request Received!
              </h3>
              <p className="text-xs sm:text-sm text-[#666666]">
                Thank you, <strong>{parentName || 'Reader'}</strong>. Our curator team will check availability for <strong>&ldquo;{bookTitle}&rdquo;</strong> and notify you at <strong>{email}</strong> within 1–2 business days.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setBookTitle('');
                  setParentName('');
                  setEmail('');
                }}
                className="mt-4 text-xs font-semibold text-[#FF6B35] hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Parent&apos;s Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Kusuma"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E5E5E5] rounded-md bg-white text-[#1A1A1A] focus:outline-none focus:border-[#FF6B35] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E5E5E5] rounded-md bg-white text-[#1A1A1A] focus:outline-none focus:border-[#FF6B35] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Desired Book Title &amp; Author
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Gruffalo by Julia Donaldson"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E5E5E5] rounded-md bg-white text-[#1A1A1A] focus:outline-none focus:border-[#FF6B35] transition-colors"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/book-request"
                  className="text-xs text-[#666666] hover:text-[#FF6B35] underline underline-offset-4"
                >
                  Open full detailed request form →
                </Link>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6B35] hover:bg-[#E85D04] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  Submit Book Request
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
};

