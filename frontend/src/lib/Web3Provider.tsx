'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { monadTestnet } from './wagmi';

const config = getDefaultConfig({
  appName: 'SCOURGE',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'scourge-dev',
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
