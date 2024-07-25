import "@/styles/global.css";

import { AppProps } from "next/app";
import { CommonProps } from "@/types/next-server-side";
import Error from "./_error";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import WrappedComponent from "./wrappedComponent";

export default function App({ Component, pageProps }: AppProps<CommonProps>) {
  return (
    <RecoilRoot>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, maximum-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <title>EDU CHAIN</title>
      </Head>
      <WrappedComponent {...pageProps}>
        {pageProps.statusCode && pageProps.statusCode >= 400 ? (
          <Error {...pageProps} />
        ) : (
          <Component {...pageProps} />
        )}
      </WrappedComponent>
    </RecoilRoot>
  );
}
