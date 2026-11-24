'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Heart,
  Store,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Smile,
  Compass,
} from 'lucide-react';
import { TombolKembali } from '@/components/common/TombolKembali';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { useCms } from '@/context/CmsContext';

export default function AboutPage() {
  const { cms } = useCms();
  const about = cms.about;
  const store = cms.store;

  const waNumber = store.whatsappNumber || process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890';
  const waGroupUrl = store.whatsappCommunityUrl || `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Hello BabyShalls, I would like to inquire about visiting the boutique and browsing your book catalog.'
  )}`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">


      {/* Hero Section with Mascot & Story (Figma Pastel Terracotta & Cream) */}
      <section
        className="py-12 sm:py-16 border-b border-[#F2E4D6] relative overflow-hidden"
        style={{ backgroundColor: about.heroBgColor || '#FFF6EA' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">

            <div className="max-w-xl text-center md:text-left">


              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#4A2A1C] tracking-tight mb-4 leading-tight">
                {about.title || 'Opening a World of Wonder for Little Ones in Malang'}
              </h1>

              <p className="text-sm sm:text-base text-[#7A5644] leading-relaxed mb-6">
                {about.description ||
                  'BabyShalls began in 2020 out of a mother’s devotion in Malang to bring the finest picture books and educational wooden toys to families. Starting from a personally curated collection, it has grown into a child-friendly boutique with a cozy reading rug and sensory play area in Citraland Puncak Tidar.'}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs"
                >
                  Explore Book Catalog
                </Link>
                <a
                  href="#store-visit"
                  className="px-6 py-3 bg-white border border-[#E6D2C0] hover:border-[#B05A26] text-[#4A2A1C] text-xs font-semibold rounded-[2px] transition-colors"
                >
                  Visit Our Boutique &rarr;
                </a>
              </div>
            </div>

            {/* Mascot Illustration Hero */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 shrink-0">
              <Image
                src={about.heroImage || '/images/mascot/maskot-peluk-hati.png'}
                alt="BabyShalls Loving Mascot"
                fill
                priority
                className="object-contain"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Nilai Utama BabyShalls (Figma Design System Pastel Cards) */}
      <section className="py-14 sm:py-18 bg-[#FFFDF9] border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">

          <div className="text-center max-w-xl mx-auto mb-12">

            <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight">
              Three Values We Cherish
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Pilar 1: Kurasi Usia (Sunny Butter #FFF1C7) */}
            <div className="bg-[#FFFDF9] border border-[#F7C94B]/50 rounded-[4px] p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#FFF1C7] text-[#8A5A00] flex items-center justify-center mb-4">
                  <BookOpen size={22} />
                </div>
                <h3 className="font-semibold text-lg text-[#4A2A1C] mb-2">
                  {about.pillars?.[0]?.title || 'Curation by Age & Milestone'}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A5644] leading-relaxed">
                  {about.pillars?.[0]?.desc ||
                    'Every board book, picture book, and toy is carefully evaluated to match sensory stimulus and motor development from newborns to 6+ years.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F2E4D6] text-[11px] font-semibold text-[#8A5A00]">
                Sturdy board books &bull; Tear-resistant &bull; Child-safe rounded corners
              </div>
            </div>

            {/* Pilar 2: Steril & Aman (Mint Sage #DDF1E5) */}
            <div className="bg-[#FFFDF9] border border-[#82BC85]/50 rounded-[4px] p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#DDF1E5] text-[#2A6E37] flex items-center justify-center mb-4">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-semibold text-lg text-[#4A2A1C] mb-2">
                  {about.pillars?.[1]?.title || 'Clean Books & UV-Sterilized Preloved'}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A5644] leading-relaxed">
                  {about.pillars?.[1]?.desc ||
                    'Our preloved collection undergoes thorough deep cleaning and UV-C sterilization in our boutique, ensuring children read and play in complete safety.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F2E4D6] text-[11px] font-semibold text-[#2A6E37]">
                UV-C sanitization &bull; Germ &amp; dust free
              </div>
            </div>

            {/* Pilar 3: Komunitas & Workshop (Lilac Lavender #F3E6F2) */}
            <div className="bg-[#FFFDF9] border border-[#BA7EB8]/50 rounded-[4px] p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#F3E6F2] text-[#7E4A84] flex items-center justify-center mb-4">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-semibold text-lg text-[#4A2A1C] mb-2">
                  {about.pillars?.[2]?.title || 'Play Space & Warm Community'}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A5644] leading-relaxed">
                  {about.pillars?.[2]?.desc ||
                    'More than a bookstore, our boutique is a gathering haven: enjoy free sensory play, read together on our story rug, and join weekend creative workshops.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F2E4D6] text-[11px] font-semibold text-[#7E4A84]">
                Free reading rug &bull; Weekend kids workshops
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Physical Store & Play Area Photo Gallery */}
      <section id="gallery" className="py-14 sm:py-18 bg-white border-b border-[#F2E4D6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">

          <div className="text-center mb-10 max-w-xl mx-auto">

            <h2 className="text-2xl sm:text-3xl font-medium text-[#4A2A1C] tracking-tight mb-2">
              {about.galleryTitle || 'Boutique Atmosphere & Reading Nook'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A5644]">
              {about.gallerySubtitle || 'Come experience the warmth of selecting books with your little one at Citraland Puncak Tidar.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Tampak Depan */}
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-hidden flex flex-col shadow-2xs hover:border-[#B05A26] transition-colors">
              <div className="relative aspect-[4/3] w-full bg-[#F0F0F0]">
                <Image
                  src="/images/store/toko-tampak-depan.png"
                  alt="Citraland Malang Boutique Front View"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#4A2A1C] mb-1">
                  Citraland Puncak Tidar Boutique
                </h3>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Warm boutique facade in the serene Citraland Block HH-26, Malang. Spacious and convenient parking for families.
                </p>
              </div>
            </div>

            {/* Area Bermain */}
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-hidden flex flex-col shadow-2xs hover:border-[#B05A26] transition-colors">
              <div className="relative aspect-[4/3] w-full bg-[#F0F0F0]">
                <Image
                  src="/images/store/toko-area-bermain.png"
                  alt="Play Area & Story Time"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#4A2A1C] mb-1">
                  Reading Rug &amp; Sensory Corner
                </h3>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Children’s play corner featuring Montessori wooden toys, hygienic rugs, and toddler-friendly reading sofas.
                </p>
              </div>
            </div>

            {/* Rak Koleksi */}
            <div className="bg-white border border-[#E6D2C0] rounded-[4px] overflow-hidden flex flex-col shadow-2xs hover:border-[#B05A26] transition-colors">
              <div className="relative aspect-[4/3] w-full bg-[#F0F0F0]">
                <Image
                  src="/images/store/toko-interior-rak.png"
                  alt="Curated Imported & Local Bookshelf"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#4A2A1C] mb-1">
                  Bookshelves Arranged by Age
                </h3>
                <p className="text-xs text-[#7A5644] leading-relaxed">
                  Thousands of curated titles organized from newborn board books, 1–3 years, up to school-age encyclopedias.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Story Card with Mascot */}
          <div className="bg-gradient-to-r from-[#FFF6EA] via-[#FBE6D8]/50 to-[#E4ECFB]/40 border border-[#E6D2C0] rounded-[6px] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-lg">
              <span className="text-[11px] font-bold text-[#B05A26] uppercase tracking-wider">
                FOUNDER'S NOTE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#4A2A1C] leading-snug">
                &ldquo;Reading with your child for 15 minutes every day is the most timeless gift for their future.&rdquo;
              </h3>
              <p className="text-xs text-[#7A5644] leading-relaxed">
                We are devoted to helping parents find the right books for every growing milestone: first words, empathy, or discovering the wonders of the universe.
              </p>
              <div className="pt-2">
                <Link
                  href="/request-a-book"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B05A26] hover:underline"
                >
                  <span>Have a dream book title in mind? Request a book curation from our team &rarr;</span>
                </Link>
              </div>
            </div>

            <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0">
              <Image
                src="/images/mascot/maskot-balik-halaman.png"
                alt="Mascot Reading Book"
                fill
                className="object-contain"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Store Visit & Directions Card (Citraland Malang) */}
      <section id="store-visit" className="py-14 sm:py-16 bg-[#FFFDF9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A6E37]"></span>
                <span className="text-xs font-bold text-[#2A6E37] uppercase tracking-wider">
                  PHYSICAL BOUTIQUE OPEN DAILY
                </span>
              </div>

              <h3 className="text-2xl font-medium text-[#4A2A1C]">
                {store.storeName || "BabyShalls Citraland Malang Boutique"}
              </h3>

              <div className="space-y-1.5 text-xs text-[#7A5644] leading-relaxed">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#B05A26] shrink-0 mt-0.5" />
                  <span>{store.address}, {store.city}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-[#B05A26] shrink-0" />
                  <span>Hours: {store.operatingHours || "Daily 10:00 AM – 5:00 PM WIB"}</span>
                </p>
              </div>

              <p className="text-xs text-[#7A5644] pt-1">
                <strong>Store Pick-up (Free Pickup)</strong> option available for online orders picked up directly at the cashier.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <a
                href={store.googleMapsUrl || 'https://maps.google.com/?q=Citraland+Puncak+Tidar+Malang'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#B05A26] hover:bg-[#8E431A] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs text-center flex items-center justify-center gap-2"
              >
                <MapPin size={15} />
                <span>Google Maps Directions</span>
              </a>

              <a
                href={waGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-white border border-[#E6D2C0] hover:border-[#B05A26] text-[#4A2A1C] text-xs font-semibold rounded-[2px] transition-colors text-center flex items-center justify-center gap-2"
              >
                <Phone size={14} className="text-[#2A6E37]" />
                <span>Chat Boutique Admin</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      <CampaignBanner />
    </div>
  );
}
