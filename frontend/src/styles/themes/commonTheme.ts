import { AccentColors, GraphColors } from './theme';
import { breakpointsUnit } from './breakpointsTheme';

import { createBreakpoints } from '@mui/system';

const accentColors: AccentColors = {
  green: '#00CC77',
  red: '#F42A3B',
  yellow: '#FFBA08',
  purple01: '#7022EC',
  purpleSub: '#22166F',
  purple02: '#9861F0',
  black: '#0B0D0E',
  white: '#FFFFFF',
};

const graphColors: GraphColors = {
  green: '#3ABB83',
  yellow: '#F5AF00',
  orange: '#E85D04',
  blue: '#255BD0',
  powderBlue: '#46ACAF',
};

export const commonTheme = {
  breakpoints: createBreakpoints({
    unit: breakpointsUnit,
  }),
  accentColors,
  graphColors,
};
