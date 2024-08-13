'use client';

import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { opencampus } from '@/constant/educhain-rpc';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { WagmiProvider } from 'wagmi';

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
              <RainbowKitProvider modalSize="compact">
                <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </RecoilRoot>
        </WagmiProvider>
      </body>
    </html>
  );
}
