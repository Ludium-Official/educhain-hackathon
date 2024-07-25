import { NoSsr, StyledEngineProvider, ThemeProvider } from '@mui/material';
import React, { Suspense, useEffect, useState } from 'react';
import { Themes, useSetting } from '@/hooks/store/useSetting';

import { CacheProvider } from '@emotion/react';
import { CommonProps } from '@/types/next-server-side';
import createEmotionCache from '@/styles/createEmotionCache';
import { darkTheme } from '@/styles/themes/darkTheme';
import { lightTheme } from '@/styles/themes/lightTheme';

const cache = createEmotionCache();

interface WrappedComponentProps extends CommonProps {
  children: JSX.Element;
}

const WrappedComponent: React.FC<WrappedComponentProps> = ({ user, isLoggedIn, children }) => {
  const { theme } = useSetting();

  const [currentTheme, setCurrentTheme] = useState(darkTheme);

  useEffect(() => {
    if (theme === Themes.LIGHT) {
      setCurrentTheme(lightTheme);
    } else {
      setCurrentTheme(darkTheme);
    }
  }, [theme]);

  return (
    <NoSsr>
      <Suspense>
        <StyledEngineProvider injectFirst>
          <CacheProvider value={cache}>
            <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
          </CacheProvider>
        </StyledEngineProvider>
      </Suspense>
    </NoSsr>
  );
};

export default WrappedComponent;
