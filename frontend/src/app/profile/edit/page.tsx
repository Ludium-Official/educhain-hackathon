"use client";

import Wrapper from "@/components/Wrapper";
import { useUser } from "@/hooks/store/user";
import fetchData from "@/libs/fetchData";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Profile() {
  const route = useRouter();

  const { user } = useUser();
  const [walletId, seWalletId] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [introduce, setIntroduce] = useState("");

  const editAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetchData("/editAccount", "POST", {
        walletId,
        name,
        number,
        introduce,
      });

      route.push("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      seWalletId(user.walletId);
      setName(user.name);
      setNumber(user.number || "");
      setIntroduce(user.introduce || "");
    }
  }, [user]);

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div className={styles.title}>프로필 수정</div>
            <form className={styles.editWrapper} onSubmit={editAccount}>
              <div className={styles.inputWrapper}>
                닉네임
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.inputWrapper}>
                연락처
                <input
                  className={styles.input}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
              <div className={styles.inputWrapper}>
                한 줄 소개
                <textarea
                  className={clsx(styles.input, styles.textarea)}
                  value={introduce}
                  onChange={(e) => setIntroduce(e.target.value)}
                />
              </div>
              <button className={styles.profileEditBtn}>프로필 적용</button>
            </form>
          </div>
        ),
      }}
    </Wrapper>
  );
}
