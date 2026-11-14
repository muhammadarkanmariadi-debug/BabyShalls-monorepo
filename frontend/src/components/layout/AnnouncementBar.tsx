'use client';

import React from 'react';
import { DEFAULT_CMS_VALUES, usePublicCms } from '../../hooks/useCms';

export const AnnouncementBar: React.FC = () => {
  const { data: cms } = usePublicCms();
  const text1 = cms?.announcement_text_1 || DEFAULT_CMS_VALUES.announcement_text_1;
  const text2 = cms?.announcement_text_2 || DEFAULT_CMS_VALUES.announcement_text_2;
  const waUrl = cms?.announcement_wa_url || DEFAULT_CMS_VALUES.announcement_wa_url;
  const waLabel = cms?.announcement_wa_label || DEFAULT_CMS_VALUES.announcement_wa_label;

  return (
    <div className="w-full bg-[#FDF0B8] border-b border-[#F3DF90] text-[#1A1A1A] py-2 px-4 text-center text-xs font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>{text1}</span>
        <span aria-hidden="true" className="text-[#1A1A1A]/40">•</span>
        <span>{text2}</span>
        <span aria-hidden="true" className="hidden sm:inline text-[#1A1A1A]/40">•</span>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline font-semibold underline underline-offset-2 hover:text-[#1E543B]"
        >
          {waLabel}
        </a>
      </div>
    </div>
  );
};
