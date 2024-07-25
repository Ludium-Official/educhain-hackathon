import { Theme, useMediaQuery } from '@mui/material';

export const useMedia = () => {
  const isPC = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return {
    isPC,
    isMobile,
  };
};
