'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const path = usePathname();

  return (
    <main className='flex min-h-svh flex-col items-center justify-center px-6'>
      {/** biome-ignore lint/performance/noImgElement: not needed */}
      <img
        src={`https://api.kodama.sh/${encodeURIComponent(path.replace('/', ''))}?size=96&detailLevel=full&mood=surprised&animations=blink,float`}
        width={96}
        height={96}
        alt='Lost kodama'
      />
      <h1 className='[font-family:var(--font-serif),Georgia,serif] text-[2rem] leading-[1.2] font-normal tracking-[-0.02em] text-heading mt-6'>
        Page not found
      </h1>
      <p className='text-[0.9375rem] leading-[1.55] text-foreground-tertiary mt-1'>
        This spirit wandered off somewhere.
      </p>
      <Link
        href='/'
        className='mt-6 text-[0.8125rem] font-medium text-accent! transition-colors hover:text-foreground!'
      >
        Back to home
      </Link>
    </main>
  );
}
