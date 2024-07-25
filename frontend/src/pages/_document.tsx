import { AppProps, AppType } from 'next/app';
import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

import { CommonProps } from '@/types/next-server-side';
import { NextPage } from 'next';
import createEmotionCache from '@/styles/createEmotionCache';
import createEmotionServer from '@emotion/server/create-instance';

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

const MyDocument: NextPage<MyDocumentProps> = ({ emotionStyleTags }) => {
  return (
    <Html className="notranslate" translate="no">
      <Head>
        <meta charSet="utf-8" />

        <meta httpEquiv="Cache-Control" content="private, no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="-1" />

        <meta name="emotion-insertion-point" content="" />
        {emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (
        App: React.ComponentType<React.ComponentProps<AppType> & AppProps<CommonProps>>,
      ) =>
        function EnhanceApp(props) {
          const appProps = {
            ...props,
            emotionCache: cache,
          };
          return <App {...appProps} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  } as MyDocumentProps;
};

export default MyDocument;
