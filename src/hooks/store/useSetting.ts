import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { recoilPersist } from 'recoil-persist';
import { v1 } from 'uuid';

const { persistAtom } = recoilPersist();

export enum Themes {
  'DARK' = 'DARK',
  'LIGHT' = 'LIGHT',
}

export enum Langs {
  'EN' = 'EN',
  'KO' = 'KO',
}

const themeState = atom<Themes>({
  key: `ThemeState/${v1()}`,
  default: Themes.DARK,
  effects_UNSTABLE: [persistAtom],
});

const langState = atom<Langs>({
  key: `LangState/${v1()}`,
  default: Langs.EN,
  effects_UNSTABLE: [persistAtom],
});

export const useSetting = () => {
  const theme = useRecoilValue(themeState);
  const setTheme = useSetRecoilState(themeState);

  const lang = useRecoilValue(langState);
  const setLang = useSetRecoilState(langState);

  return {
    theme,
    lang,
    setTheme,
    setLang,
  };
};
