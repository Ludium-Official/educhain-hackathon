"use client";

import Wrapper from "@/components/Wrapper";
import fetchData from "@/libs/fetchData";
import { CommunityType } from "@/types/community";
import clsx from "clsx";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Community() {
  const param = useParams();
  const [community, setCommunity] = useState<CommunityType>();

  useEffect(() => {
    const callData = async () => {
      const response = (await fetchData(
        `/communities/${param.id}`
      )) as CommunityType;

      setCommunity(response);
    };

    callData();
  }, []);

  const formatDate = dayjs(community?.created_at).format("YYYY.MM.DD");

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <div className={clsx(styles.card, styles.title)}>
                {community?.title}
                <span>작성일: {formatDate}</span>
              </div>
              <div className={clsx(styles.card, styles.content)}>
                {community?.content}
              </div>
            </div>
            <div>side text</div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
