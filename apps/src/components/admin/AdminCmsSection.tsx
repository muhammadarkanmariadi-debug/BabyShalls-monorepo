'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Globe, GripVertical, Palette, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useAdminCms, useUpdateAdminCms } from '../../hooks/useAdminDashboard';
import { DEFAULT_HERO_SLIDES, HeroSlideCms, parseHeroSlides } from '../../hooks/useCms';
import { CmsData, CmsFaqItem, initialCmsData } from '../../context/CmsContext';
import { extractApiError } from '../../lib/axios';
import { AdminDrawer } from './ui/AdminDrawer';
import { MultiImageUploader } from './MultiImageUploader';

type CmsPageId =
  | 'home'
  | 'about'
  | 'faq'
  | 'preloved'
  | 'web_info';

type HomeSectionId = 'hero' | 'age_banner' | 'hampers_banner' | 'request_visit';

const PAGE_LIST: Array<{ id: CmsPageId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'faq', label: 'FAQ' },
  { id: 'preloved', label: 'Preloved' },
];

const HOME_SECTIONS: Array<{ id: HomeSectionId; title: string; subtitle: string }> = [
  { id: 'hero', title: 'Hero Carousel', subtitle: 'Tag, main title, description, photos & background colors' },
  { id: 'age_banner', title: 'Campaign / Age Banner', subtitle: 'Title, description, image & background color' },
  { id: 'hampers_banner', title: 'Gift Hampers Banner', subtitle: 'Title, description, banner image & background color' },
  { id: 'request_visit', title: 'Book Request & Store Visit', subtitle: 'Book procurement card & Malang boutique location info' },
];

const BG_SWATCHES = ['#FFF6EA', '#FFFDF9', '#FFFBF5', '#FBE6D8', '#B05A26', '#DCE6C6'];

export function AdminCmsSection({ enabled }: { enabled: boolean }) {
  const { data: cmsData } = useAdminCms(enabled);
  const updateCmsMutation = useUpdateAdminCms();

  const [activePage, setActivePage] = useState<CmsPageId>('home');
  const [draft, setDraft] = useState<CmsData>(initialCmsData);
  const [heroSlides, setHeroSlides] = useState<HeroSlideCms[]>(DEFAULT_HERO_SLIDES);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const [drawerSection, setDrawerSection] = useState<HomeSectionId | null>(null);

  useEffect(() => {
    if (!cmsData) return;
    if (cmsData.cms_data_json) {
      try {
        const parsed = JSON.parse(cmsData.cms_data_json) as Partial<CmsData>;
        setDraft({
          ...initialCmsData,
          ...parsed,
          home: { ...initialCmsData.home, ...(parsed.home || {}) },
          about: { ...initialCmsData.about, ...(parsed.about || {}) },
          preloved: { ...initialCmsData.preloved, ...(parsed.preloved || {}) },
          store: { ...initialCmsData.store, ...(parsed.store || {}) },
          faq: Array.isArray(parsed.faq) ? parsed.faq : initialCmsData.faq,
        });
      } catch {
        // fallback
      }
    }
    if (cmsData.hero_slides_json) {
      setHeroSlides(parseHeroSlides(cmsData.hero_slides_json));
    }
  }, [cmsData]);

  const handleSaveAll = async () => {
    try {
      await updateCmsMutation.mutateAsync({
        cms_data_json: JSON.stringify({
          ...draft,
          home: { ...draft.home, heroSlides },
        }),
        hero_slides_json: JSON.stringify(heroSlides),
        announcement_wa_url: `https://wa.me/${draft.store.whatsappNumber || '6281234567890'}`,
        hampers_title: draft.home.hampersBannerTitle,
        hampers_description: draft.home.hampersBannerSubtitle,
        about_banner_title: draft.about.title,
        about_intro_1: draft.about.storyParagraph1,
        about_intro_2: draft.about.description || '',
        about_visit_address: draft.store.address,
        about_hours_weekday: draft.store.operatingHours,
        about_block_3_email: draft.store.email || 'halo@babyshalls.com',
      });
      toast.success('Website content successfully saved & published!');
      setDrawerSection(null);
    } catch (err) {
      toast.error(extractApiError(err, 'Failed to save CMS content.'));
    }
  };

  const handleReset = () => {
    if (!window.confirm('Reset all CMS content to latest defaults?')) return;
    setDraft(initialCmsData);
    toast('Content reset to default (click Save to publish).');
  };

  const addFaq = () => {
    const newItem: CmsFaqItem = {
      id: `faq-${Date.now()}`,
      category: 'shopping',
      question: 'New question',
      answer: 'Detailed answer...',
      isActive: true,
    };
    setDraft((prev) => ({ ...prev, faq: [...prev.faq, newItem] }));
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Top Action Bar */}
      <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#4A2A1C]">Website Content (Direct Semi-CMS)</h2>
          <p className="text-[#7A5644]">
            Click directly on any section to edit text, banner/hero images, and background colors live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="h-9 px-3.5 rounded-[4px] border border-[#E6D2C0] bg-white hover:bg-[#FFF6EA] font-semibold text-[#4A2A1C] inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="h-9 px-3.5 rounded-[4px] border border-[#E6D2C0] font-semibold text-[#7A5644] hover:bg-[#FFF6EA] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            type="button"
            disabled={updateCmsMutation.isPending}
            onClick={handleSaveAll}
            className="h-9 px-5 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{updateCmsMutation.isPending ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3 bg-white border border-[#E6D2C0] rounded-[6px] p-3 space-y-1">
          {PAGE_LIST.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePage(p.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-[4px] font-medium transition-colors cursor-pointer ${
                activePage === p.id
                  ? 'bg-[#FBE6D8] text-[#B05A26] font-semibold'
                  : 'text-[#4A2A1C] hover:bg-[#FFF6EA]'
              }`}
            >
              {p.label}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-[#F2E4D6]">
            <button
              type="button"
              onClick={() => setActivePage('web_info')}
              className={`w-full text-left px-3.5 py-2.5 rounded-[4px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                activePage === 'web_info'
                  ? 'bg-[#B05A26] text-white'
                  : 'bg-[#FFF6EA] text-[#B05A26] border border-[#E6D2C0] hover:bg-[#FBE6D8]'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>Web Info</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-4">
          {activePage === 'home' && (
            <>
              {/* Interactive Direct-Preview Strip for Home */}
              <div
                onClick={() => setDrawerSection('hero')}
                className="rounded-[6px] border border-[#E6D2C0] p-5 cursor-pointer hover:ring-2 hover:ring-[#B05A26]/40 transition-all flex items-center justify-between gap-4"
                style={{ backgroundColor: draft.home.heroBgColor || '#FFF6EA' }}
              >
                <div className="space-y-1.5 max-w-lg">
                  <h3 className="text-lg font-semibold text-[#4A2A1C] whitespace-pre-line">
                    {draft.home.heroTitle}
                  </h3>
                  <p className="text-[11px] text-[#7A5644] line-clamp-2">{draft.home.heroSubtitle}</p>
                </div>
                <img
                  src={draft.home.heroImage || '/images/hero/slide-1.jpg'}
                  alt="Hero Preview"
                  className="w-20 h-20 object-contain shrink-0"
                />
              </div>

              {HOME_SECTIONS.map((sec) => (
                <div
                  key={sec.id}
                  className="bg-white border border-[#E6D2C0] rounded-[6px] p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-4 h-4 text-[#C9B3A5] shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#4A2A1C]">{sec.title}</h3>
                      <p className="text-[#7A5644] truncate">{sec.subtitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerSection(sec.id)}
                    className="h-9 px-4 rounded-[4px] border border-[#E6D2C0] bg-white hover:bg-[#FFF6EA] font-semibold text-[#4A2A1C] cursor-pointer shrink-0"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </>
          )}

          {activePage === 'about' && (
            <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-5">
              <h3 className="text-base font-semibold text-[#4A2A1C]">Direct Edit: About Us (`/about`)</h3>
              <BgColorPicker
                label="About Hero Background Color"
                value={draft.about.heroBgColor || '#FFF6EA'}
                onChange={(v) => setDraft((p) => ({ ...p, about: { ...p.about, heroBgColor: v } }))}
              />
              <MultiImageUploader
                images={draft.about.heroImage ? [draft.about.heroImage] : ['/images/mascot/maskot-peluk-hati.png']}
                onChange={(imgs) =>
                  setDraft((p) => ({ ...p, about: { ...p.about, heroImage: imgs[0] || '' } }))
                }
                folder="babyshalls/cms"
                maxImages={1}
                label="About Hero / Mascot Image"
              />
              <InputField
                label="Top Badge"
                value={draft.about.badge}
                onChange={(v) => setDraft((p) => ({ ...p, about: { ...p.about, badge: v } }))}
              />
              <InputField
                label="Main Title"
                value={draft.about.title}
                onChange={(v) => setDraft((p) => ({ ...p, about: { ...p.about, title: v } }))}
              />
              <TextareaField
                label="Short Description"
                value={draft.about.description || ''}
                onChange={(v) => setDraft((p) => ({ ...p, about: { ...p.about, description: v } }))}
              />
              <TextareaField
                label="Story Paragraph 1"
                value={draft.about.storyParagraph1}
                onChange={(v) => setDraft((p) => ({ ...p, about: { ...p.about, storyParagraph1: v } }))}
              />
              <TextareaField
                label="Story Paragraph 2"
                value={draft.about.storyParagraph2}
                onChange={(v) => setDraft((p) => ({ ...p, about: { ...p.about, storyParagraph2: v } }))}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextareaField
                  label="Vision"
                  value={draft.about.vision}
                  onChange={(v) => setDraft((p) => ({ ...p, about: { ...p.about, vision: v } }))}
                />
                <TextareaField
                  label="Mission"
                  value={draft.about.mission}
                  onChange={(v) => setDraft((p) => ({ ...p, about: { ...p.about, mission: v } }))}
                />
              </div>
            </div>
          )}

          {activePage === 'faq' && (
            <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#4A2A1C]">FAQ List (`/faq`)</h3>
                <button
                  type="button"
                  onClick={addFaq}
                  className="h-9 px-3.5 rounded-[4px] bg-[#B05A26] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {draft.faq.map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-[4px] border border-[#E6D2C0] space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={item.category}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            faq: p.faq.map((f, i) => (i === idx ? { ...f, category: e.target.value } : f)),
                          }))
                        }
                        className="h-8 px-2.5 rounded-[4px] border border-[#E6D2C0]"
                      >
                        <option value="belanja">Shopping</option>
                        <option value="pengiriman">Shipping</option>
                        <option value="pengembalian">Returns</option>
                        <option value="event">Events</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((p) => ({ ...p, faq: p.faq.filter((_, i) => i !== idx) }))
                        }
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-[4px] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          faq: p.faq.map((f, i) => (i === idx ? { ...f, question: e.target.value } : f)),
                        }))
                      }
                      className="w-full h-9 px-3 rounded-[4px] border border-[#E6D2C0] font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          faq: p.faq.map((f, i) => (i === idx ? { ...f, answer: e.target.value } : f)),
                        }))
                      }
                      className="w-full p-2.5 rounded-[4px] border border-[#E6D2C0]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePage === 'preloved' && (
            <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
              <h3 className="text-base font-semibold text-[#4A2A1C]">Preloved Page (`/preloved`)</h3>
              <InputField
                label="Preloved Page Title"
                value={draft.preloved.title || ''}
                onChange={(v) => setDraft((p) => ({ ...p, preloved: { ...p.preloved, title: v } }))}
              />
              <TextareaField
                label="Preloved Curation Description"
                value={draft.preloved.description || ''}
                onChange={(v) => setDraft((p) => ({ ...p, preloved: { ...p.preloved, description: v } }))}
              />
              <InputField
                label="UV-C Sterilization Notice"
                value={draft.preloved.sterilizationNotice}
                onChange={(v) =>
                  setDraft((p) => ({ ...p, preloved: { ...p.preloved, sterilizationNotice: v } }))
                }
              />
            </div>
          )}

          {activePage === 'web_info' && (
            <div className="bg-white border border-[#E6D2C0] rounded-[6px] p-6 space-y-4">
              <h3 className="text-base font-semibold text-[#4A2A1C]">
                Web Info, Social Media &amp; Contacts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="WhatsApp Number (628...)"
                  value={draft.store.whatsappNumber}
                  onChange={(v) =>
                    setDraft((p) => ({ ...p, store: { ...p.store, whatsappNumber: v } }))
                  }
                />
                <InputField
                  label="WhatsApp Community Group Link"
                  value={draft.store.whatsappCommunityUrl}
                  onChange={(v) =>
                    setDraft((p) => ({ ...p, store: { ...p.store, whatsappCommunityUrl: v } }))
                  }
                />
                <InputField
                  label="Instagram Link"
                  value={draft.store.instagramUrl}
                  onChange={(v) =>
                    setDraft((p) => ({ ...p, store: { ...p.store, instagramUrl: v } }))
                  }
                />
                <InputField
                  label="Instagram Handle (@...)"
                  value={draft.store.instagramHandle}
                  onChange={(v) =>
                    setDraft((p) => ({ ...p, store: { ...p.store, instagramHandle: v } }))
                  }
                />
                <InputField
                  label="YouTube Link"
                  value={draft.store.youtubeUrl || ''}
                  onChange={(v) =>
                    setDraft((p) => ({ ...p, store: { ...p.store, youtubeUrl: v } }))
                  }
                />
                <InputField
                  label="TikTok Link"
                  value={draft.store.tiktokUrl || ''}
                  onChange={(v) =>
                    setDraft((p) => ({ ...p, store: { ...p.store, tiktokUrl: v } }))
                  }
                />
                <InputField
                  label="Contact Email"
                  value={draft.store.email || ''}
                  onChange={(v) => setDraft((p) => ({ ...p, store: { ...p.store, email: v } }))}
                />
                <InputField
                  label="Google Maps Link"
                  value={draft.store.googleMapsUrl}
                  onChange={(v) =>
                    setDraft((p) => ({ ...p, store: { ...p.store, googleMapsUrl: v } }))
                  }
                />
              </div>
              <InputField
                label="Boutique Address"
                value={draft.store.address}
                onChange={(v) => setDraft((p) => ({ ...p, store: { ...p.store, address: v } }))}
              />
              <InputField
                label="Operating Hours"
                value={draft.store.operatingHours}
                onChange={(v) =>
                  setDraft((p) => ({
                    ...p,
                    store: { ...p.store, operatingHours: v, openingHours: v },
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Slide-Over Drawer for Home Sections (640px) */}
      <AdminDrawer
        isOpen={Boolean(drawerSection)}
        onClose={() => setDrawerSection(null)}
        title={HOME_SECTIONS.find((s) => s.id === drawerSection)?.title || 'Edit Section'}
        width="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDrawerSection(null)}
              className="h-9 px-4 rounded-[4px] border border-[#E6D2C0] font-semibold text-[#7A5644] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={updateCmsMutation.isPending}
              onClick={handleSaveAll}
              className="h-9 px-5 rounded-[4px] bg-[#B05A26] hover:bg-[#8E431A] text-white font-semibold cursor-pointer"
            >
              {updateCmsMutation.isPending ? 'Saving...' : 'Save & Publish'}
            </button>
          </>
        }
      >
        {drawerSection === 'hero' && (
          <div className="space-y-4">
            <BgColorPicker
              label="Hero Background Color"
              value={draft.home.heroBgColor || '#FFF6EA'}
              onChange={(v) => setDraft((p) => ({ ...p, home: { ...p.home, heroBgColor: v } }))}
            />

            {/* Slide Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E6D2C0]">
              {heroSlides.map((s, idx) => (
                <button
                  key={s.id ?? idx}
                  type="button"
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`px-3 py-1.5 rounded-[4px] font-semibold cursor-pointer ${
                    activeSlideIdx === idx
                      ? 'bg-[#B05A26] text-white'
                      : 'bg-[#FFF6EA] text-[#4A2A1C] border border-[#E6D2C0]'
                  }`}
                >
                  Slide {idx + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const nextId = Date.now();
                  setHeroSlides((prev) => [
                    ...prev,
                    {
                      id: nextId,
                      label: `Slide ${prev.length + 1}`,
                      title: 'New Slide Title',
                      subtitle: 'Short description for this carousel slide.',
                      ctaLabel: 'Shop Now',
                      ctaHref: '/shop',
                      image: '/images/hero/slide-1.jpg',
                      imageAlt: 'BabyShalls Malang',
                    },
                  ]);
                  setActiveSlideIdx(heroSlides.length);
                }}
                className="px-2.5 py-1.5 rounded-[4px] border border-dashed border-[#B05A26] text-[#B05A26] font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Slide
              </button>
            </div>

            {(() => {
              const current = heroSlides[activeSlideIdx] || heroSlides[0];
              if (!current) return null;
              const updateSlide = (patch: Partial<HeroSlideCms>) => {
                setHeroSlides((prev) =>
                  prev.map((item, i) => (i === activeSlideIdx ? { ...item, ...patch } : item))
                );
              };
              return (
                <div className="space-y-3 p-4 rounded-[4px] bg-[#FFFDF9] border border-[#E6D2C0]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#4A2A1C]">
                      Slide {activeSlideIdx + 1} Content
                    </span>
                    {heroSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeroSlides((prev) => prev.filter((_, i) => i !== activeSlideIdx));
                          setActiveSlideIdx(0);
                        }}
                        className="text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Slide
                      </button>
                    )}
                  </div>

                  <MultiImageUploader
                    images={current.image ? [current.image] : []}
                    onChange={(imgs) => updateSlide({ image: imgs[0] || '' })}
                    folder="babyshalls/cms"
                    maxImages={1}
                    label={`Background Banner Slide ${activeSlideIdx + 1} (Empty = display mascot)`}
                  />
                  <TextareaField
                    label="Slide Title (H1)"
                    value={current.title}
                    onChange={(v) => updateSlide({ title: v })}
                  />
                  <TextareaField
                    label="Slide Subtitle"
                    value={current.subtitle}
                    onChange={(v) => updateSlide({ subtitle: v })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="CTA Button Text"
                      value={current.ctaLabel}
                      onChange={(v) => updateSlide({ ctaLabel: v })}
                    />
                    <InputField
                      label="CTA Button Link"
                      value={current.ctaHref}
                      onChange={(v) => updateSlide({ ctaHref: v })}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {drawerSection === 'age_banner' && (
          <div className="space-y-4">
            <BgColorPicker
              label="Campaign Banner Background Color"
              value={draft.home.ageBannerBgColor || '#B05A26'}
              onChange={(v) => setDraft((p) => ({ ...p, home: { ...p.home, ageBannerBgColor: v } }))}
            />
            <MultiImageUploader
              images={draft.home.ageBannerImage ? [draft.home.ageBannerImage] : []}
              onChange={(imgs) =>
                setDraft((p) => ({ ...p, home: { ...p.home, ageBannerImage: imgs[0] || '' } }))
              }
              folder="babyshalls/cms"
              maxImages={1}
              label="Banner Background Image (Optional)"
            />
            <InputField
              label="Campaign / Age Banner Title"
              value={draft.home.ageBannerTitle}
              onChange={(v) => setDraft((p) => ({ ...p, home: { ...p.home, ageBannerTitle: v } }))}
            />
            <TextareaField
              label="Description"
              value={draft.home.ageBannerSubtitle}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, ageBannerSubtitle: v } }))
              }
            />
            <InputField
              label="Button Text"
              value={draft.home.ageBannerButtonText}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, ageBannerButtonText: v } }))
              }
            />
          </div>
        )}

        {drawerSection === 'hampers_banner' && (
          <div className="space-y-4">
            <BgColorPicker
              label="Hampers Banner Background Color"
              value={draft.home.hampersBannerBgColor || '#FFFBF5'}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, hampersBannerBgColor: v } }))
              }
            />
            <MultiImageUploader
              images={
                draft.home.hampersBannerImage
                  ? [draft.home.hampersBannerImage]
                  : ['/images/products/banner-hampers.png']
              }
              onChange={(imgs) =>
                setDraft((p) => ({ ...p, home: { ...p.home, hampersBannerImage: imgs[0] || '' } }))
              }
              folder="babyshalls/cms"
              maxImages={1}
              label="Hampers Banner Image"
            />
            <InputField
              label="Hampers Banner Title"
              value={draft.home.hampersBannerTitle}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, hampersBannerTitle: v } }))
              }
            />
            <TextareaField
              label="Description"
              value={draft.home.hampersBannerSubtitle}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, hampersBannerSubtitle: v } }))
              }
            />
            <InputField
              label="Button Text"
              value={draft.home.hampersBannerButtonText}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, hampersBannerButtonText: v } }))
              }
            />
          </div>
        )}

        {drawerSection === 'request_visit' && (
          <div className="space-y-4">
            <InputField
              label="Book Request Title"
              value={draft.home.requestCardTitle}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, requestCardTitle: v } }))
              }
            />
            <TextareaField
              label="Book Request Subtitle"
              value={draft.home.requestCardSubtitle}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, requestCardSubtitle: v } }))
              }
            />
            <InputField
              label="Visit Boutique Title"
              value={draft.home.storeVisitTitle}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, storeVisitTitle: v } }))
              }
            />
            <TextareaField
              label="Visit Boutique Subtitle"
              value={draft.home.storeVisitSubtitle}
              onChange={(v) =>
                setDraft((p) => ({ ...p, home: { ...p.home, storeVisitSubtitle: v } }))
              }
            />
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}

function BgColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-semibold text-[#4A2A1C] flex items-center gap-1.5">
        <Palette className="w-3.5 h-3.5 text-[#B05A26]" />
        <span>{label}</span>
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {BG_SWATCHES.map((hex) => (
          <button
            key={hex}
            type="button"
            onClick={() => onChange(hex)}
            className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
              value.toUpperCase() === hex ? 'border-[#4A2A1C] scale-110' : 'border-[#E6D2C0]'
            }`}
            style={{ backgroundColor: hex }}
            title={hex}
          />
        ))}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-[4px] border border-[#E6D2C0] cursor-pointer"
        />
        <span className="font-mono text-[11px] text-[#7A5644]">{value}</span>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block font-semibold text-[#4A2A1C] mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-[4px] border border-[#E6D2C0] focus:outline-none focus:border-[#B05A26]"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block font-semibold text-[#4A2A1C] mb-1">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-[4px] border border-[#E6D2C0] focus:outline-none focus:border-[#B05A26]"
      />
    </div>
  );
}
