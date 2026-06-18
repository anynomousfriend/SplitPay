import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'SplitPay — Split Bills on Stellar',
  description: 'A premium split bill calculator built on the Stellar blockchain. Calculate splits, send XLM payments, and track transactions — all in one beautiful interface.',
  keywords: ['Stellar', 'XLM', 'split bill', 'payment', 'blockchain', 'cryptocurrency'],
};

import SmoothScroll from '@/components/SmoothScroll';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}