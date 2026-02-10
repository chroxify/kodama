'use client';

import { useState } from 'react';
import {
  AnimationsSection,
  ColorsSection,
  CombinationsSection,
  CustomGradientsSection,
  DepthEffectsSection,
  DetailLevelsSection,
  DeterministicSection,
  HeroSection,
  MoodsSection,
  NextApiSection,
  PageFooter,
  PropsSection,
  QuickStartSection,
  VariantsSection,
} from '@/components/sections';

export default function Home() {
  const [tryName, setTryName] = useState('kodama');

  return (
    <>
      <article
        className='mx-auto flex max-w-152 flex-col px-6 pb-16 pt-14
        [&_p]:text-[0.875rem] [&_p]:font-[450] [&_p]:leading-6 [&_p]:tracking-[-0.005em] [&_p]:text-black/65
        [&_p+p]:mt-3
        [&_p_strong]:font-semibold [&_p_strong]:text-black/85
        [&_code]:rounded [&_code]:bg-[#f5f4f1] [&_code]:px-[0.35rem] [&_code]:py-[0.1rem]
        [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:text-black/75
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:text-xs'
      >
        <HeroSection />
        <QuickStartSection tryName={tryName} setTryName={setTryName} />
        <DeterministicSection />
        <CombinationsSection />
        <ColorsSection />
        <VariantsSection />
        <MoodsSection />
        <AnimationsSection />
        <DepthEffectsSection />
        <DetailLevelsSection />
        <CustomGradientsSection />
        <NextApiSection />
        <PropsSection />
      </article>

      <PageFooter />
    </>
  );
}
