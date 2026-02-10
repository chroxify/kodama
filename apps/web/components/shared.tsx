import type { ReactNode } from 'react';

function cx(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx('mt-9', className)}>
      <div className='mb-2 flex items-center gap-3'>
        <h2 className='text-[0.8125rem] leading-none font-[560] tracking-[-0.005em] text-black/80'>
          {title}
        </h2>
        <span className='h-px flex-1 bg-black/8' />
      </div>
      {children}
    </section>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className='my-2 overflow-x-auto rounded-lg border border-black/8 bg-[#f5f4f1] px-4 py-3 font-mono text-xs leading-[1.6] text-[#444]'>
      <code>{children}</code>
    </pre>
  );
}

export function CopyIcon() {
  return (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
      <title>Copy</title>
      <path
        d='M4.75 11.25C4.75 10.42 5.42 9.75 6.25 9.75H12.75C13.58 9.75 14.25 10.42 14.25 11.25V17.75C14.25 18.58 13.58 19.25 12.75 19.25H6.25C5.42 19.25 4.75 18.58 4.75 17.75V11.25Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <path
        d='M17.25 14.25H17.75C18.58 14.25 19.25 13.58 19.25 12.75V6.25C19.25 5.42 18.58 4.75 17.75 4.75H11.25C10.42 4.75 9.75 5.42 9.75 6.25V6.75'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}
