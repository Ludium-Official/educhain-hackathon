'use client';

import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { WagmiProvider } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'EDUCHAIN HACKATHON',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min')
      .then((module) => {
        console.log('Bootstrap JavaScript loaded');
      })
      .catch((error) => {
        console.error('Failed to load Bootstrap JavaScript', error);
      });
  }, []);

  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <RecoilRoot>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
            </QueryClientProvider>
          </RecoilRoot>
        </WagmiProvider>
      </body>
    </html>
  );
}
