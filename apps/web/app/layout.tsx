import type { Metadata } from 'next';
import { Geist_Mono, Instrument_Serif } from 'next/font/google';
import localFont from 'next/font/local';
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

export const metadata: Metadata = {
  title: 'Kodama Monorepo Demo',
  description: 'Demo app for kodama-id and kodama-id/react',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${openRunde.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
