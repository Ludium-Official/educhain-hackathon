import { Breakpoints } from '@mui/material';

export interface ThemeStyle {
  mode: 'light' | 'dark';
  colors: Colors;
  accentColors: AccentColors;
  graphColors: GraphColors;
  gradientColors: GradientColors;
  breakpoints?: Breakpoints;
  typography: TextTypos & {
    htmlFontSize?: number;
  };
}

export interface TextTypos {
  display: {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
    display3: React.CSSProperties;
    display4: React.CSSProperties;
    display5: React.CSSProperties;
    display6: React.CSSProperties;
    display7: React.CSSProperties;
    display8: React.CSSProperties;
    display9: React.CSSProperties;
    display10: React.CSSProperties;
    display11: React.CSSProperties;
  };
  body: {
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;
    h4: React.CSSProperties;
    h5: React.CSSProperties;
    h6: React.CSSProperties;
    h7: React.CSSProperties;
    h8: React.CSSProperties;
    h9: React.CSSProperties;
    h10: React.CSSProperties;
    h11: React.CSSProperties;
  };
}

export interface Colors {
  base2500: string;
  base2300: string;
  base2200: string;
  base2000: string;
  base1900: string;
  base1400: string;
  base0800: string;
  base0500: string;
  base0400: string;
  base0300: string;
  base0200: string;
  base0100: string;
}

export interface AccentColors {
  purple01: string;
  purpleSub: string;
  purple02: string;
  yellow: string;
  green: string;
  red: string;
  black: string;
  white: string;
}

export interface GraphColors {
  green: string;
  yellow: string;
  orange: string;
  blue: string;
  powderBlue: string;
}

export interface GradientColors {
  purple: string;
  green: string;
}
