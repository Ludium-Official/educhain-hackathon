'use client';

import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { WagmiProvider } from 'wagmi';
import { opencampus } from '@/constant/educhain-rpc';

const config = getDefaultConfig({
  appName: 'EDUCHAIN HACKATHON',
  /// Wallet Connect 쓰려면 필요한데, 일단 내가 하나 팠음.
  /// https://cloud.walletconnect.com/
  projectId: 'c6e5adf89ebc72153b3f7f277aa41db9',
  chains: [opencampus],
  ssr: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

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
