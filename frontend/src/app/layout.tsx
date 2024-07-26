"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import { WagmiProvider } from "wagmi";
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains";
import "./globals.css";

const config = getDefaultConfig({
  appName: "EDUCHAIN HACKATHON",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base],
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
              <RainbowKitProvider modalSize="compact">
                {children}
              </RainbowKitProvider>
            </QueryClientProvider>
          </RecoilRoot>
        </WagmiProvider>
      </body>
    </html>
  );
}
