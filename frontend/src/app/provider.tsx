'use client';
import { NextUIProvider } from '@nextui-org/react';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { opencampus } from '@/constant/educhain-rpc';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { Toaster } from 'react-hot-toast';

const config = getDefaultConfig({
  appName: 'EDUCHAIN HACKATHON',
  /// Wallet Connect 쓰려면 필요한데, 일단 내가 하나 팠음.
  /// https://cloud.walletconnect.com/
  projectId: 'c6e5adf89ebc72153b3f7f277aa41db9',
  chains: [opencampus],
  ssr: true,
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
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
    <WagmiProvider config={config}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize="compact">
            <NextUIProvider>{children}</NextUIProvider>
            <Toaster />
          </RainbowKitProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </WagmiProvider>
  );
};
