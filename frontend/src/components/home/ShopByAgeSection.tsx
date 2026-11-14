'use client';

import React from 'react';
import Link from 'next/link';

const AGE_GROUPS = [
  {
    id: 'Newborn+',
    meta: '0–1 TAHUN',
    title: 'Newborn+',
    desc: 'Board books & sensory play',
    bgClass: 'bg-[#FAF4E8] hover:bg-[#F4EAD5]',
    href: '/catalog?age=Newborn%2B',
  },
  {
    id: 'Ages 1-3',
    meta: '1–3 TAHUN',
    title: 'Ages 1–3',
    desc: 'Picture books & wooden stackers',
    bgClass: 'bg-[#FDECE6] hover:bg-[#FADCD1]',
    href: '/catalog?age=Ages+1-3',
  },
  {
    id: 'Ages 3+',
    meta: '3–5 TAHUN',
    title: 'Ages 3+',
    desc: 'Storybooks & pretend play',
    bgClass: 'bg-[#E9F3E4] hover:bg-[#DCEBD4]',
    href: '/catalog?age=Ages+3%2B',
  },
  {
    id: 'Ages 6+',
    meta: '6+ TAHUN',
    title: 'Ages 6+',
    desc: 'Early chapters & STEM puzzles',
    bgClass: 'bg-[#EBF1FA] hover:bg-[#DCE7F6]',
    href: '/catalog?age=Ages+6%2B',
  },
];

export const ShopByAgeSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-12 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Shop by Age</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {AGE_GROUPS.map((group) => (
            <Link
              key={group.id}
              href={group.href}
              className={`rounded-lg border border-[#E2E8F0] p-5 flex flex-col gap-1.5 transition-colors ${group.bgClass}`}
            >
              <span className="text-[11px] font-bold tracking-widest text-[#555555]">
                {group.meta}
              </span>
              <h3 className="text-lg font-bold text-[#1A1A1A]">{group.title}</h3>
              <p className="text-[13px] text-[#555555]">{group.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
