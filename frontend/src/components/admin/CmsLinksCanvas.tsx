'use client';

import React from 'react';
import { Globe, Mail, MapPin, MessageCircle } from 'lucide-react';
import { extractGmapsEmbedUrl } from '../../hooks/useCms';

interface CmsLinksCanvasProps {
  fields: Record<string, string>;
  setField: (key: string, val: string) => void;
}

export function CmsLinksCanvas({ fields, setField }: CmsLinksCanvasProps) {
  const previewMapSrc = extractGmapsEmbedUrl(fields.footer_gmaps_embed_url);

  return (
    <div className="space-y-6">
      {/* 1. Social Media & Customer Support Links */}
      <div className="border-2 border-[#EBDCCB] rounded-3xl bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B3F2A] pb-3 border-b border-[#F3F4F6]">
          <Globe className="w-4 h-4 text-[#D9744A]" />
          <span>Link Sosial Media &amp; Kontak Resmi</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-[#502E1E] inline-flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp CS Utama (Floating Button &amp; Footer)</span>
            </label>
            <input
              type="url"
              value={fields.social_whatsapp_url || ''}
              onChange={(e) => setField('social_whatsapp_url', e.target.value)}
              placeholder="https://wa.me/6281234567890"
              className="w-full h-10 px-3.5 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#502E1E]">WhatsApp Announcement Bar</label>
            <input
              type="url"
              value={fields.announcement_wa_url || ''}
              onChange={(e) => setField('announcement_wa_url', e.target.value)}
              placeholder="https://wa.me/6281234567890"
              className="w-full h-10 px-3.5 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#502E1E]">Instagram URL</label>
            <input
              type="url"
              value={fields.social_instagram_url || ''}
              onChange={(e) => setField('social_instagram_url', e.target.value)}
              placeholder="https://instagram.com/babyshalls.id"
              className="w-full h-10 px-3.5 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#502E1E]">TikTok URL</label>
            <input
              type="url"
              value={fields.social_tiktok_url || ''}
              onChange={(e) => setField('social_tiktok_url', e.target.value)}
              placeholder="https://tiktok.com/@babyshalls.id"
              className="w-full h-10 px-3.5 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#502E1E]">WhatsApp Halaman FAQ</label>
            <input
              type="url"
              value={fields.faq_wa_url || ''}
              onChange={(e) => setField('faq_wa_url', e.target.value)}
              placeholder="https://wa.me/6281234567890"
              className="w-full h-10 px-3.5 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#502E1E] inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D9744A]" />
              <span>Email Kontak (Halaman About)</span>
            </label>
            <input
              type="email"
              value={fields.about_block_3_email || ''}
              onChange={(e) => setField('about_block_3_email', e.target.value)}
              placeholder="hello@babyshalls.id"
              className="w-full h-10 px-3.5 bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
            />
          </div>
        </div>
      </div>

      {/* 2. Custom Google Maps Embed Footer */}
      <div className="border-2 border-[#EBDCCB] rounded-3xl overflow-hidden bg-white shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B3F2A]">
            <MapPin className="w-4 h-4 text-[#D9744A]" />
            <span>Custom Embed Link Google Maps (Footer)</span>
          </div>
          <span className="text-[11px] text-[#6B7280]">
            Tempel URL embed Google Maps atau kode &lt;iframe&gt; langsung
          </span>
        </div>

        <input
          type="text"
          value={fields.footer_gmaps_embed_url || ''}
          onChange={(e) => setField('footer_gmaps_embed_url', e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=... atau tempel <iframe src='...'>"
          className="w-full h-11 px-4 text-xs font-mono bg-[#FCF6EC] border border-[#EBDCCB] rounded-xl focus:outline-none focus:border-[#D9744A]"
        />

        <div className="h-56 rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F1F5F9]">
          <iframe
            title="Preview Google Maps Footer"
            src={previewMapSrc}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

