import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PWARegister from '@/components/pwa/PWARegister';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tselaco - Ride Hailing',
  description: 'Book rides with Tselaco - South Africa\'s most affordable ride-hailing platform',
  manifest: '/manifest.json',
  themeColor: '#3B82F6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tselaco',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tselaco" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={inter.className}>
        {children}
        <PWARegister />
      </body>
    </html>
  );
} 
