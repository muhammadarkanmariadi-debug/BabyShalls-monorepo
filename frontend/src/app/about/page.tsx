'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  Sprout,
  Star,
  ArrowRight,
  Sparkles,
  Send,
  Check,
} from 'lucide-react';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    childAge: '',
    comment: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.contact) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', contact: '', childAge: '', comment: '' });
      }, 4000);
    }
  };

  return (
    <div className="bg-[#FFF8EF] min-h-screen text-[#4A2E1F] font-sans overflow-hidden">

      {/* 1. Grand Waving Ribbon Hero Section (Ciri Khas BabyShalls) */}
      <section
        className="relative w-full min-h-[500px] lg:min-h-[560px] xl:min-h-[600px] overflow-hidden flex items-center"
        style={{
          background: 'linear-gradient(135deg, #FFF9F0 0%, #FFEBDC 45%, #FBDDC9 100%)',
        }}
        id="about-hero"
        aria-label="About BabyShalls Hero"
      >
        {/* Asymmetrical Top Wave */}
        <div className="absolute top-0 left-0 w-full h-[65px] lg:h-[75px] leading-none overflow-hidden z-[4] pointer-events-none">
          <svg viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 L360,0 C270,36 170,68 70,74 C30,76 10,79 0,82 Z" fill="#FFE4D2" />
            <path
              d="M0,0 L1440,0 L1440,32 C1320,56 1200,52 1090,34 C970,14 850,56 710,50 C550,44 350,16 190,36 C95,48 35,34 0,22 Z"
              fill="#FFF8EF"
            />
          </svg>
        </div>

        {/* Botanical Sage Leaf Branch on Left Edge */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-14 sm:w-20 lg:w-24 h-32 lg:h-40 z-[3] pointer-events-none hidden sm:block animate-float-1"
          aria-hidden="true"
        >
          <svg viewBox="0 0 95 150" fill="none" className="w-full h-full">
            <path d="M8 145 C18 105 35 65 72 20" stroke="#7A9A60" strokeWidth="2.8" strokeLinecap="round" />
            <ellipse cx="26" cy="118" rx="15" ry="9" transform="rotate(-32 26 118)" fill="#91B077" />
            <ellipse cx="44" cy="90" rx="16" ry="9.5" transform="rotate(28 44 90)" fill="#91B077" />
            <ellipse cx="47" cy="54" rx="16" ry="9" transform="rotate(-34 47 54)" fill="#91B077" />
            <ellipse cx="70" cy="24" rx="14" ry="8" transform="rotate(22 70 24)" fill="#91B077" />
          </svg>
        </div>

        {/* Floating Storybook Doodles */}
        {/* Twinkle Sparkle */}
        <div className="absolute left-[38%] top-[14%] w-6 h-6 z-[3] pointer-events-none hidden md:block animate-twinkle-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" fill="#F6C95E" opacity="0.9" />
          </svg>
        </div>

        {/* Floating Open Book */}
        <div className="absolute left-[41%] top-[19%] w-10 h-8 lg:w-12 lg:h-9 z-[3] pointer-events-none hidden lg:block animate-float-2">
          <svg viewBox="0 0 54 40" fill="none" className="w-full h-full">
            <path
              d="M27 10 C21 6 10 7 4 11 L4 35 C10 31 21 30 27 34 C33 30 44 31 50 35 L50 11 C44 7 33 6 27 10 Z"
              fill="#FFF5EB"
              stroke="#DA7A5B"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M27 10 L27 34" stroke="#DA7A5B" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M9 19 Q16 16 22 18" stroke="#DA7A5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M32 18 Q38 16 45 19" stroke="#DA7A5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        {/* Floating Heart */}
        <div className="absolute left-[47%] top-[25%] w-8 h-7 lg:w-9 lg:h-8 z-[3] pointer-events-none hidden md:block animate-float-1">
          <svg viewBox="0 0 34 30" fill="none" className="w-full h-full">
            <path
              d="M17 26 C17 26 4 17.5 4 9.2 C4 4.8 7.4 1.8 11.4 1.8 C14.2 1.8 16 3.4 17 4.8 C18 3.4 19.8 1.8 22.6 1.8 C26.6 1.8 30 4.8 30 9.2 C30 17.5 17 26 17 26 Z"
              stroke="#DA7A5B"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Curvilinear Bee Flight Trail */}
        <div className="absolute left-[35%] top-[36%] w-48 lg:w-64 h-24 z-[3] pointer-events-none hidden lg:block">
          <svg viewBox="0 0 220 90" fill="none" className="w-full h-full">
            <path
              d="M10 65 Q60 20 110 55 T200 30"
              stroke="#D9A688"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              opacity="0.65"
            />
            <g transform="translate(196, 22) rotate(-15)">
              <ellipse cx="8" cy="8" rx="7" ry="4.5" fill="#F6C95E" />
              <path d="M5 4.5 L5 11.5" stroke="#502E1E" strokeWidth="1.2" />
              <path d="M8 3.5 L8 12.5" stroke="#502E1E" strokeWidth="1.2" />
              <ellipse cx="6" cy="3" rx="3.5" ry="2.2" fill="#FFFFFF" opacity="0.8" />
              <ellipse cx="10" cy="3" rx="3.5" ry="2.2" fill="#FFFFFF" opacity="0.8" />
            </g>
          </svg>
        </div>

        {/* Mini Rainbow Doodle */}
        <div className="absolute left-[43%] bottom-[23%] w-12 h-9 lg:w-14 lg:h-10 z-[3] pointer-events-none hidden lg:block animate-float-3">
          <svg viewBox="0 0 60 44" fill="none" className="w-full h-full">
            <path d="M6,40 A24,24 0 0,1 54,40" stroke="#DA7A5B" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <path d="M14,40 A16,16 0 0,1 46,40" stroke="#F6C95E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <path d="M22,40 A8,8 0 0,1 38,40" stroke="#8FA87E" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Hero Grid */}
        <div className="relative w-full min-h-[500px] lg:min-h-[560px] xl:min-h-[600px] grid grid-cols-1 lg:grid-cols-[48%_52%] items-center z-[2]">

          {/* Left Column: Heading & CTA */}
          <div className="relative z-[3] pt-20 pb-12 lg:py-24 px-6 sm:px-12 lg:pl-16 xl:pl-28 flex flex-col items-start text-left">
            {/* Mustard Doodle Sunburst */}
            <div className="inline-flex items-end gap-1.5 mb-3.5 h-7" aria-hidden="true">
              <span className="block w-1 h-4 bg-[#F6C95E] rounded-full transform -rotate-[32deg] origin-bottom"></span>
              <span className="block w-1 h-5.5 bg-[#F6C95E] rounded-full"></span>
              <span className="block w-1 h-4 bg-[#F6C95E] rounded-full transform rotate-[32deg] origin-bottom"></span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[48px] xl:text-[54px] font-bold text-[#502E1E] leading-[1.16] tracking-tight mb-4">
              About BabyShalls
            </h1>

            <p className="font-sans text-sm sm:text-base lg:text-lg text-[#6B3F2A]/90 max-w-md font-medium leading-relaxed mb-6">
              A little bookstore, a big world for curious minds. Temukan keajaiban buku cerita anak dan mainan kayu edukasi kurasi di Kota Malang.
            </p>

            {/* CTA with Flower Cluster */}
            <div className="relative flex items-center gap-4 lg:gap-5">
              <a
                href="#our-story"
                className="inline-flex items-center gap-3 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-extrabold text-sm sm:text-base shadow-card hover:shadow-hover hover:scale-103 active:scale-98 transition-all group tracking-wide"
              >
                <span>Our Story</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform text-lg">→</span>
              </a>

              {/* Flower Cluster */}
              <div className="w-16 h-14 sm:w-20 sm:h-16 flex-shrink-0" aria-hidden="true">
                <svg viewBox="0 0 90 70" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 46 C10 40 6 28 14 20 C24 24 28 36 22 44 Z" fill="#91B077" />
                  <path d="M60 54 C70 50 80 38 74 28 C64 32 58 42 60 54 Z" fill="#A7C48A" />
                  <g>
                    <circle cx="32" cy="38" r="8.5" fill="#F6C95E" />
                    <circle cx="45" cy="30" r="8.5" fill="#F6C95E" />
                    <circle cx="49" cy="44" r="8.5" fill="#F6C95E" />
                    <circle cx="39" cy="54" r="8.5" fill="#F6C95E" />
                    <circle cx="28" cy="50" r="8.5" fill="#F6C95E" />
                    <circle cx="38" cy="43" r="5.5" fill="#502E1E" />
                  </g>
                  <g>
                    <circle cx="56" cy="24" r="6.5" fill="#F6B79B" />
                    <circle cx="66" cy="20" r="6.5" fill="#F6B79B" />
                    <circle cx="61.5" cy="29" r="4.2" fill="#DA7A5B" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Seamlessly Blended Photograph */}
          <div className="relative w-full h-[380px] sm:h-[460px] lg:h-full lg:min-h-[560px] xl:min-h-[600px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"
              alt="Plush toy and wooden house on stack of curated children books"
              className="w-full h-[115%] -top-[5%] relative object-cover object-[center_30%]"
            />
            {/* Seamless Left Gradient Mask */}
            <div
              className="absolute inset-y-0 left-0 w-[35%] pointer-events-none z-[2]"
              style={{
                background:
                  'linear-gradient(to right, #FFEBDC 0%, rgba(255, 235, 220, 0.75) 45%, transparent 100%)',
              }}
              aria-hidden="true"
            />
          </div>

        </div>

        {/* 3-Layer Flowing Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full h-[75px] lg:h-[95px] leading-none overflow-hidden z-[4] pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,62 C180,22 360,18 540,66 C720,110 920,54 1100,84 C1240,106 1350,64 1440,52 L1440,120 L0,120 Z" fill="#FAD9C5" opacity="0.88" />
            <path d="M0,78 C160,38 340,42 510,76 C680,110 880,68 1060,90 C1220,108 1360,74 1440,66 L1440,120 L0,120 Z" fill="#FFE8D9" opacity="0.8" />
            <path d="M0,88 C200,58 380,50 560,82 C740,112 940,74 1140,92 C1280,104 1380,78 1440,72 L1440,120 L0,120 Z" fill="#FFF8EF" />
          </svg>
        </div>
      </section>

      {/* 2. Welcoming Subtitle Quote */}
      <section className="py-8 sm:py-12 bg-[#FFF8EF]">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-3">
          <p className="font-serif italic text-base sm:text-lg text-[#8A5237] leading-relaxed">
            "Looking for a gift for a child in your life? Adding to your own little home library? Want to indulge in gorgeous picture book art? Stop by and find a treasure to take home."
          </p>
          <div className="flex items-center justify-center gap-2 pt-1 text-[#DA7A5B]">
            <span className="w-8 h-[1px] bg-[#DA7A5B]/40" />
            <Sparkles className="w-4 h-4 text-[#F6C95E]" />
            <span className="w-8 h-[1px] bg-[#DA7A5B]/40" />
          </div>
        </div>
      </section>

      {/* 3. Section: Our Story & Philosophy */}
      <section id="our-story" className="py-8 sm:py-14 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">

            {/* Left: Little Girl Reading Book Frame with Leaf Doodles */}
            <div className="md:col-span-5 relative flex justify-center">

              {/* Decorative Leaves Left */}
              <div className="absolute -left-4 sm:-left-8 top-1/4 text-[#8FA87E] pointer-events-none opacity-80">
                <svg className="w-12 h-16" viewBox="0 0 50 70" fill="none">
                  <path d="M10 60 C 10 30, 30 20, 45 10 C 35 25, 20 45, 10 60 Z" fill="#8FA87E" />
                  <path d="M15 50 C 25 35, 35 30, 42 20" stroke="#709154" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="46" cy="10" r="3" fill="#D9744A" />
                </svg>
              </div>

              {/* Organic Arch Frame */}
              <div className="relative w-64 sm:w-72 aspect-[4/5] rounded-[36px] rounded-t-[130px] overflow-hidden border-4 border-white shadow-subtle bg-[#F8EFE4]">
                <img
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80"
                  alt="Little girl holding book above head smiling"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Hearts & Sparkles Top */}
              <div className="absolute -top-3 right-6 text-[#DA7A5B] flex gap-1 pointer-events-none">
                <Heart className="w-5 h-5 fill-[#F6C95E] text-[#F6C95E] rotate-12" />
                <Sparkles className="w-4 h-4 text-[#DA7A5B]" />
              </div>
            </div>

            {/* Right: Narrative Story & Paper Airplane */}
            <div className="md:col-span-7 space-y-4 text-center md:text-left relative">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#DA7A5B]">
                <span className="text-xl"></span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A2E1F]">
                  Our Story
                </h2>
                <span className="text-xl"></span>
              </div>

              <div className="space-y-3.5 text-sm sm:text-base text-[#6B3F2A] leading-relaxed">
                <p>
                  BabyShalls was born from a simple belief: <strong className="text-[#4A2E1F] font-bold">that every child deserves access to inspiring books, beautiful toys, and joyful learning experiences.</strong>
                </p>
                <p>
                  Based in Kota Malang, we curate high-quality imported books and educational toys to support your child's growth, one story at a time. Kami percaya bahwa masa keemasan balita bukanlah tentang stimulasi gawai yang berlebihan, melainkan tentang aroma kayu alami, tekstur kertas papan yang tebal, dan momen membaca nyaring bersama orang tua tercinta.
                </p>
              </div>

              {/* Paper Airplane Doodle */}
              <div className="hidden sm:block absolute right-4 -bottom-6 pointer-events-none">
                <svg className="w-24 h-16 text-[#F6C95E]" viewBox="0 0 100 60" fill="none">
                  <path
                    d="M10 50 C 30 55, 45 40, 35 25 C 25 10, 45 15, 70 30"
                    stroke="#E2BE93"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  <path d="M70 30 L95 20 L80 42 L73 34 Z" fill="#F6C95E" stroke="#DA7A5B" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. The 3 Paper Moon Story Blocks (The Shop, The Books, The Community) */}
      <section className="py-12 sm:py-18 bg-[#FCF8F2] border-y border-[#EEDBC9]/70 relative">
        <div className="max-w-5xl mx-auto px-6 space-y-16 sm:space-y-24">

          {/* Block A: The Shop (Photo Left, Text Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 relative">
              <div className="relative aspect-[4/5] rounded-[30px] overflow-hidden border-4 border-white shadow-subtle bg-[#F8EFE4]">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=85"
                  alt="BabyShalls storefront window display with warm lights and books"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-6 space-y-3.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DA7A5B]">
                <Sparkles className="w-3.5 h-3.5 text-[#F6C95E]" />
                <span>Ruang Hangat di Kota Malang</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2E1F]">
                The Shop:
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#6B3F2A] leading-relaxed">
                <p>
                  Nestled on <strong>Jl. Cempaka No. 12, Klojen</strong> in the historic heritage area of Kota Malang, our boutique has an authentic, warm feel whilst also being bright and playful.
                </p>
                <p>
                  While parents browse books, children can draw, play, and read in our kids' corner. Families can also read together in one of our comfy chairs with natural light streaming through our wooden windows.
                </p>
              </div>
            </div>
          </div>

          {/* Block B: The Books & Toys (Text Left, Photo Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 space-y-3.5 text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#709154]">
                <BookOpen className="w-3.5 h-3.5 text-[#709154]" />
                <span>Kurasi Bermutu Tinggi</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2E1F]">
                The Books:
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#6B3F2A] leading-relaxed">
                <p>
                  Our team works to bring you a variety of vintage and modern titles. We offer timeless classics, rare books, special editions, preloved gems, and newly published books by award-winning authors and illustrators.
                </p>
                <p>
                  Our boutique and website offer books and tactile sensory toys in every category — such as wellbeing, sciences, animals, toddler board books, and Montessori wooden blocks.
                </p>
                <p className="font-medium text-[#4A2E1F]">
                  Our shop in Malang has an even larger physical collection than what you'll find online. Searching for a specific book? Let us know through our <em>Request a Book</em> service!
                </p>
              </div>
            </div>

            <div className="md:col-span-6 relative order-1 md:order-2">
              <div className="relative aspect-[4/5] rounded-[30px] overflow-hidden border-4 border-white shadow-subtle bg-[#F8EFE4]">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85"
                  alt="Wooden bookshelves filled with picture books and educational toys"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Block C: The Community (Photo Left, Text Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 relative">
              <div className="relative aspect-[4/5] rounded-[30px] overflow-hidden border-4 border-white shadow-subtle bg-[#F8EFE4]">
                <img
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=85"
                  alt="Families and children gathered in a cozy reading and storytelling meetup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-6 space-y-3.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DA7A5B]">
                <Sparkles className="w-3.5 h-3.5 text-[#DA7A5B]" />
                <span>Ruang Tumbuh Bersama</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2E1F]">
                The Community:
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#6B3F2A] leading-relaxed">
                <p>
                  BabyShalls is more than just a bookstore. We are a part of the community and love to host events, such as weekend storytime, wooden toy craft workshops, exhibitions, and read-aloud parent coaching.
                </p>
                <p>
                  Want to collaborate or host a playdate? We'd love to hear from you! Email us at{' '}
                  <a
                    href="mailto:halo@babyshalls.id"
                    className="font-bold text-[#DA7A5B] hover:underline"
                  >
                    halo@babyshalls.id
                  </a>{' '}
                  or chat directly with our WhatsApp concierge.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Section: Our Values (Pill Container) */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#FAF2E6] border border-[#EEDBC9] rounded-[36px] p-8 sm:p-12 shadow-2xs">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2E1F] text-center mb-10">
              Our Values
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8EF] border border-[#EEDBC9] flex items-center justify-center text-[#DA7A5B] shadow-2xs group-hover:scale-105 group-hover:bg-[#FFF3E8] transition-all">
                  <BookOpen className="w-7 h-7 stroke-[1.8]" />
                </div>
                <span className="font-serif font-bold text-sm sm:text-base text-[#4A2E1F] leading-snug">
                  Inspiring<br />Learning
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8EF] border border-[#EEDBC9] flex items-center justify-center text-[#DA7A5B] shadow-2xs group-hover:scale-105 group-hover:bg-[#FFF3E8] transition-all">
                  <Heart className="w-7 h-7 stroke-[1.8]" />
                </div>
                <span className="font-serif font-bold text-sm sm:text-base text-[#4A2E1F] leading-snug">
                  Nurturing<br />Childhood
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8EF] border border-[#EEDBC9] flex items-center justify-center text-[#709154] shadow-2xs group-hover:scale-105 group-hover:bg-[#EBF2E5] transition-all">
                  <Sprout className="w-7 h-7 stroke-[1.8]" />
                </div>
                <span className="font-serif font-bold text-sm sm:text-base text-[#4A2E1F] leading-snug">
                  Thoughtful<br />Choices
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8EF] border border-[#EEDBC9] flex items-center justify-center text-[#F6C95E] shadow-2xs group-hover:scale-105 group-hover:bg-[#FDF6E2] transition-all">
                  <Star className="w-7 h-7 stroke-[1.8]" />
                </div>
                <span className="font-serif font-bold text-sm sm:text-base text-[#4A2E1F] leading-snug">
                  A Kinder<br />Tomorrow
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: Visit Us & Store Hours */}
      <section className="py-8 sm:py-14 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#FCECE0] border border-[#F5D8C3] rounded-[36px] p-6 sm:p-10 shadow-xs relative overflow-hidden">

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">

              <div className="md:col-span-7 space-y-3 text-center md:text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2E1F]">
                  Visit us at BabyShalls Books
                </h3>
                <p className="text-xs sm:text-sm text-[#6B3F2A]/90 leading-relaxed max-w-md">
                  Jl. Cempaka No. 12, Klojen, Kota Malang, Jawa Timur 65111
                </p>

                <div className="pt-1 pb-1 space-y-1 text-xs text-[#5C4A3E]">
                  <strong className="block text-[#DA7A5B] font-bold">Store Hours:</strong>
                  <p>Wednesday – Friday: 11.00 – 18.00 WIB</p>
                  <p>Saturday (Workshop & Event): 10.00 – 18.00 WIB</p>
                  <p>Sunday: 12.00 – 18.00 WIB</p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Jl.+Cempaka+No.+12,+Klojen,+Kota+Malang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#D9744A] hover:bg-[#C46749] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-xs hover:shadow-subtle transition-all duration-200"
                  >
                    <span>Petunjuk Arah Google Maps</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-subtle border-2 border-white/80 bg-[#FAF2E6]">
                  <img
                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
                    alt="BabyShalls Boutique Storefront in Malang"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. Personal Gift Recommendation Request Form */}
      <section className="py-10 sm:py-16 relative">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white border border-[#EEDBC9] rounded-[32px] p-6 sm:p-10 shadow-subtle space-y-6">

            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#709154] bg-[#EBF2E5] px-3 py-1 rounded-full border border-[#D5E4CA]">
                Konsultasi & Kurasi Khusus
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A2E1F]">
                Do you want a personal gift recommendation?
              </h3>
              <p className="text-xs sm:text-sm text-[#6B3F2A]">
                Send your request below and we will help you with the choice!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B3F2A] mb-1">
                    Nama Anda *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Amanda Rahma"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EEDBC9] bg-[#FFFDF9] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B3F2A] mb-1">
                    Nomor WhatsApp / Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="08123456789 atau email"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EEDBC9] bg-[#FFFDF9] focus:outline-none focus:border-[#DA7A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B3F2A] mb-1">
                  Usia & Minat Anak (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.childAge}
                  onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                  placeholder="Contoh: Balita 2 tahun, suka binatang dan dinosaurus"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EEDBC9] bg-[#FFFDF9] focus:outline-none focus:border-[#DA7A5B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B3F2A] mb-1">
                  Catatan Tambahan / Anggaran Kado
                </label>
                <textarea
                  rows={3}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Ceritakan preferensi Anda, misal: butuh bungkus kado untuk kado ulang tahun keponakan..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EEDBC9] bg-[#FFFDF9] focus:outline-none focus:border-[#DA7A5B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#DA7A5B] hover:bg-[#C46749] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-subtle transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Permintaan Terkirim!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Permintaan Rekomendasi</span>
                    </>
                  )}
                </button>
              </div>

              {isSubmitted && (
                <p className="text-xs text-[#709154] font-semibold text-center pt-2 animate-in fade-in-0">
                  Terima kasih! Tim kurator BabyShalls akan segera menghubungi Anda dengan pilihan rekomendasi terbaik.
                </p>
              )}
            </form>

          </div>
        </div>
      </section>

    </div>
  );
}
