'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Home, Info, MousePointerClick, RotateCcw, Save } from 'lucide-react';
import { useAdminCms, useUpdateAdminCms } from '../../hooks/useAdminDashboard';
import {
  DEFAULT_CMS_VALUES,
  DEFAULT_HERO_SLIDES,
  HeroSlideCms,
  parseHeroSlides,
} from '../../hooks/useCms';
import { extractApiError } from '../../lib/axios';
import { CmsHomeCanvas } from './CmsHomeCanvas';
import { CmsAboutCanvas } from './CmsAboutCanvas';

export function AdminCmsSection({ enabled }: { enabled: boolean }) {
  const { data: cmsData } = useAdminCms(enabled);
  const updateCmsMutation = useUpdateAdminCms();

  const [activePage, setActivePage] = useState<'home' | 'about'>('home');
  const [fields, setFields] = useState<Record<string, string>>(DEFAULT_CMS_VALUES);
  const [heroSlides, setHeroSlides] = useState<HeroSlideCms[]>(DEFAULT_HERO_SLIDES);

  useEffect(() => {
    if (!cmsData) return;
    setFields({ ...DEFAULT_CMS_VALUES, ...cmsData });
    setHeroSlides(parseHeroSlides(cmsData.hero_slides_json));
  }, [cmsData]);

  const setField = (key: string, val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    try {
      await updateCmsMutation.mutateAsync({
        ...fields,
        hero_slides_json: JSON.stringify(heroSlides),
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
    toast('Konten dikembalikan ke default (klik Publikasikan untuk menyimpan).');
  };

  return (
    <div className="space-y-4">
      {/* WordPress-style Visual Editor Top Bar */}
      <div className="bg-white border border-[#EBDCCB] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl bg-[#FCF6EC] border border-[#EBDCCB] p-1 gap-1 text-xs">
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
          </div>

          <span className="text-[11px] font-semibold text-[#6B3F2A] inline-flex items-center gap-1.5 bg-[#FCF6EC] px-3 py-1.5 rounded-full border border-[#EBDCCB]">
            <MousePointerClick className="w-3.5 h-3.5 text-[#D9744A]" />
            Direct Edit: klik langsung teks atau gambar di kanvas untuk mengedit
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
        />
      ) : (
        <CmsAboutCanvas fields={fields} setField={setField} />
      )}
    </div>
  );
}
