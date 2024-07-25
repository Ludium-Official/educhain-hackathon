import { Colors, GradientColors, ThemeStyle } from './theme';

import { commonTheme } from './commonTheme';

const themeColors: Colors = {
  base2500: '#FFFFFF',
  base2300: '#E8EAED',
  base2200: '#DDE0E4',
  base2000: '#C6CBD2',
  base1900: '#BAC1C9',
  base1400: '#818D9C',
  base0800: '#48515B',
  base0500: '#2D3239',
  base0400: '#21252C',
  base0300: '#1B1E25',
  base0200: '#111317',
  base0100: '#0B0D0E',
};

const gradientColors: GradientColors = {
  purple: 'linear-gradient(135deg, #8336FF 0%, #B98EFF 100%)',
  green: 'linear-gradient(90deg, #2BC0E4 0%, #EAECC6 100%)',
};

export const lightTheme: ThemeStyle = {
  mode: 'light' as const,
  colors: themeColors,
  gradientColors,
  ...commonTheme,
};
