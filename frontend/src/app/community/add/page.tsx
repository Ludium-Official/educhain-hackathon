"use client";

import BackLink from "@/components/BackLink";
import Wrapper from "@/components/Wrapper";
import { PATH } from "@/constant/route";
import { useUser } from "@/hooks/store/user";
import fetchData from "@/libs/fetchData";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.scss";

export default function AddCommunity() {
  const route = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addCommunity = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetchData("/communities/add", "POST", {
        auth: user?.auth,
        owner: user?.walletId,
        title,
        content,
      });

      route.push(PATH.COMMUNITY);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={PATH.COMMUNITY} />
          </div>
        ),
        body: (
          <div className={styles.container}>
            <div className={styles.title}>콘텐츠 작성</div>
            <form className={styles.addWrapper} onSubmit={addCommunity}>
              <div className={styles.inputWrapper}>
                제목
                <input
                  className={styles.input}
                  placeholder="제목을 입력해주세요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className={styles.inputWrapper}>
                내용
                <textarea
                  className={clsx(styles.input, styles.textarea)}
                  placeholder="내용을 입력해주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <button className={styles.addCommunityBtn}>추가하기</button>
            </form>
          </div>
        ),
      }}
    </Wrapper>
  );
}
