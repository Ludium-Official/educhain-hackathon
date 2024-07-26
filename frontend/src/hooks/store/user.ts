import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

import { User } from "@/types/user";
import { isNil } from "ramda";

const userState = atom<User | null>({
  key: "User",
  default: null,
});

export const useUser = (initValue?: User) => {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    !isNil(initValue) && setUser(initValue);
  }, [initValue]);

  return {
    user,
    setUser,
  };
};
