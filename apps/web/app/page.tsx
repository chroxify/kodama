import type { Metadata } from 'next';
import { PageContent } from './page-content';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;

  const ogParams = new URLSearchParams();
  for (const key of ['name', 'shape', 'depth', 'detail', 'mood', 'bg']) {
    const val = params[key];
    if (typeof val === 'string' && val) ogParams.set(key, val);
  }
  const ogQuery = ogParams.size > 0 ? `?${ogParams.toString()}` : '';
  const ogUrl = `/api/og${ogQuery}`;

  const name = typeof params.name === 'string' && params.name ? params.name : undefined;

  return {
    ...(name && {
      title: `${name} — Kodama`,
      openGraph: {
        title: `${name} — Kodama`,
        images: [{ url: ogUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} — Kodama`,
        images: [ogUrl],
      },
    }),
    ...(!name && {
      openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image' as const, images: [ogUrl] },
    }),
  };
}

export default function Home() {
  return <PageContent />;
}
