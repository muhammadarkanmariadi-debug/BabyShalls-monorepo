'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Globe, HelpCircle, Home, Info, MousePointerClick, RotateCcw, Save } from 'lucide-react';
import { useAdminCms, useUpdateAdminCms } from '../../hooks/useAdminDashboard';
import {
  AboutSectionId,
  DEFAULT_ABOUT_SECTION_ORDER,
  DEFAULT_CMS_VALUES,
  DEFAULT_FAQ_ITEMS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HOME_SECTION_ORDER,
  FaqItemCms,
  HeroSlideCms,
  HomeSectionId,
  parseFaqItems,
  parseHeroSlides,
  parseSectionOrder,
} from '../../hooks/useCms';
import { extractApiError } from '../../lib/axios';
import { CmsHomeCanvas } from './CmsHomeCanvas';
import { CmsAboutCanvas } from './CmsAboutCanvas';
import { CmsFaqCanvas } from './CmsFaqCanvas';
import { CmsLinksCanvas } from './CmsLinksCanvas';

type CmsTab = 'home' | 'about' | 'faq' | 'links';

export function AdminCmsSection({ enabled }: { enabled: boolean }) {
  const { data: cmsData } = useAdminCms(enabled);
  const updateCmsMutation = useUpdateAdminCms();

  const [activePage, setActivePage] = useState<CmsTab>('home');
  const [fields, setFields] = useState<Record<string, string>>(DEFAULT_CMS_VALUES);
  const [heroSlides, setHeroSlides] = useState<HeroSlideCms[]>(DEFAULT_HERO_SLIDES);
  const [homeOrder, setHomeOrder] = useState<HomeSectionId[]>(DEFAULT_HOME_SECTION_ORDER);
  const [aboutOrder, setAboutOrder] = useState<AboutSectionId[]>(DEFAULT_ABOUT_SECTION_ORDER);
  const [faqItems, setFaqItems] = useState<FaqItemCms[]>(DEFAULT_FAQ_ITEMS);

  useEffect(() => {
    if (!cmsData) return;
    setFields({ ...DEFAULT_CMS_VALUES, ...cmsData });
    setHeroSlides(parseHeroSlides(cmsData.hero_slides_json));
    setHomeOrder(parseSectionOrder(cmsData.home_section_order, DEFAULT_HOME_SECTION_ORDER));
    setAboutOrder(parseSectionOrder(cmsData.about_section_order, DEFAULT_ABOUT_SECTION_ORDER));
    setFaqItems(parseFaqItems(cmsData.faq_items_json));
  }, [cmsData]);

  const setField = (key: string, val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    try {
      await updateCmsMutation.mutateAsync({
        ...fields,
        hero_slides_json: JSON.stringify(heroSlides),
        home_section_order: JSON.stringify(homeOrder),
        about_section_order: JSON.stringify(aboutOrder),
        faq_items_json: JSON.stringify(faqItems),
      });
      toast.success('Perubahan halaman Storefront berhasil dipublikasikan!');
    } catch (err) {
      toast.error(extractApiError(err, 'Gagal menyimpan konten CMS.'));
    }
  };

  const handleReset = () => {
    if (!window.confirm('Kembalikan konten ke pengaturan default bawaan?')) return;
    setFields(DEFAULT_CMS_VALUES);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setHomeOrder(DEFAULT_HOME_SECTION_ORDER);
    setAboutOrder(DEFAULT_ABOUT_SECTION_ORDER);
    setFaqItems(DEFAULT_FAQ_ITEMS);
    toast('Konten dikembalikan ke default (klik Publikasikan untuk menyimpan).');
  };

  return (
    <div className="space-y-4">
      {/* WordPress-style Visual Editor Top Bar */}
      <div className="bg-white border border-[#EBDCCB] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex flex-wrap rounded-xl bg-[#FCF6EC] border border-[#EBDCCB] p-1 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className={`px-3.5 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                activePage === 'home' ? 'bg-[#D9744A] text-white' : 'text-[#502E1E]'
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Beranda
            </button>
            <button
              type="button"
              onClick={() => setActivePage('about')}
              className={`px-3.5 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                activePage === 'about' ? 'bg-[#D9744A] text-white' : 'text-[#502E1E]'
              }`}
            >
              <Info className="w-3.5 h-3.5" /> Halaman About
            </button>
            <button
              type="button"
              onClick={() => setActivePage('faq')}
              className={`px-3.5 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                activePage === 'faq' ? 'bg-[#D9744A] text-white' : 'text-[#502E1E]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Halaman FAQ
            </button>
            <button
              type="button"
              onClick={() => setActivePage('links')}
              className={`px-3.5 py-1.5 rounded-lg font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                activePage === 'links' ? 'bg-[#D9744A] text-white' : 'text-[#502E1E]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Link &amp; Sosial Media
            </button>
          </div>

          <span className="text-[11px] font-semibold text-[#6B3F2A] inline-flex items-center gap-1.5 bg-[#FCF6EC] px-3 py-1.5 rounded-full border border-[#EBDCCB]">
            <MousePointerClick className="w-3.5 h-3.5 text-[#D9744A]" />
            Direct Edit &amp; Drag-and-Drop urutan section
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="h-9 px-3.5 rounded-xl border border-[#EBDCCB] font-bold text-[#6B3F2A] hover:bg-[#FCF6EC] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            type="button"
            disabled={updateCmsMutation.isPending}
            onClick={handleSave}
            className="h-9 px-5 rounded-xl bg-[#1E543B] hover:bg-[#163F2C] disabled:opacity-60 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{updateCmsMutation.isPending ? 'Menyimpan...' : 'Simpan & Publikasikan'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Page Canvas */}
      {activePage === 'home' ? (
        <CmsHomeCanvas
          fields={fields}
          setField={setField}
          heroSlides={heroSlides}
          setHeroSlides={setHeroSlides}
          homeOrder={homeOrder}
          setHomeOrder={setHomeOrder}
        />
      ) : activePage === 'about' ? (
        <CmsAboutCanvas
          fields={fields}
          setField={setField}
          aboutOrder={aboutOrder}
          setAboutOrder={setAboutOrder}
        />
      ) : activePage === 'faq' ? (
        <CmsFaqCanvas
          fields={fields}
          setField={setField}
          faqItems={faqItems}
          setFaqItems={setFaqItems}
        />
      ) : (
        <CmsLinksCanvas fields={fields} setField={setField} />
      )}
    </div>
  );
}
