import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

import { UserType } from "@/types/user";
import { isNil } from "ramda";

const userState = atom<UserType | null>({
  key: "User",
  default: null,
});

export const useUser = (initValue?: UserType) => {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    !isNil(initValue) && setUser(initValue);
  }, [initValue]);

  return {
    user,
    setUser,
  };
};
