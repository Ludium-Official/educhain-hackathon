import "@/styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";

import { CommonProps } from "@/types/next-server-side";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import { WagmiProvider } from "wagmi";
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains";
import Error from "./_error";
import WrappedComponent from "./wrappedComponent";

const config = getDefaultConfig({
  appName: "EDUCHAIN HACKATHON",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

export default function App({ Component, pageProps }: AppProps<CommonProps>) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <RecoilRoot>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1, maximum-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />
          <title>EDUCHAIN</title>
        </Head>
        <WrappedComponent {...pageProps}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider modalSize="compact">
              {pageProps.statusCode && pageProps.statusCode >= 400 ? (
                <Error {...pageProps} />
              ) : (
                <Component {...pageProps} />
              )}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WrappedComponent>
      </RecoilRoot>
    </WagmiProvider>
  );
}
