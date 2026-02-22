import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Web3Provider from '@/lib/Web3Provider';
import { DebugPanel } from '@/components/DebugPanel';
import { NetworkStatus } from '@/components/NetworkStatus';

export const metadata: Metadata = {
  title: 'SCOURGE — Private Data Marketplace',
  description: 'Monetize your behavioral data with zero-knowledge proofs. Companies get attributes, you keep privacy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bauhaus-white font-sans">
        <Web3Provider>
          <Navbar />
          <main>{children}</main>
          <DebugPanel />
          <NetworkStatus />
        </Web3Provider>
      </body>
    </html>
  );
}
