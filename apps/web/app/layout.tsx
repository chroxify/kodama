import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist_Mono, Instrument_Serif } from 'next/font/google';
import localFont from 'next/font/local';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const openRunde = localFont({
  src: [
    { path: '../public/OpenRunde-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/OpenRunde-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/OpenRunde-Semibold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-open-runde',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
});

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Kodama — Animated avatar system for developers',
  description:
    'Generate unique, fully animated avatars from any string. 145,152 combinations with blinking, floating, and glancing animations — all deterministic and open-source.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Kodama — Animated avatar system for developers',
    description:
      'Generate unique, fully animated avatars from any string. Deterministic, customizable, and open-source.',
    siteName: 'Kodama',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kodama — Animated avatar system for developers',
    description:
      'Generate unique, fully animated avatars from any string. Deterministic, customizable, and open-source.',
    images: ['/api/og'],
  },
  keywords: ['avatar', 'generative', 'animated', 'deterministic', 'open-source', 'react', 'svg'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${openRunde.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}>
        <Analytics />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
