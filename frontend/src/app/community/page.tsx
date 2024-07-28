"use client";

import Wrapper from "@/components/Wrapper";
import { PATH } from "@/constant/route";
import fetchData from "@/libs/fetchData";
import { CommunityType } from "@/types/community";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Community() {
  const [communities, setCommunities] = useState<CommunityType[]>([]);

  useEffect(() => {
    const callData = async () => {
      const response = (await fetchData("/communities")) as CommunityType[];

      setCommunities(response);
    };

    callData();
  }, []);

  return (
    <Wrapper>
      {{
        header: <div>Header</div>,
        body: (
          <div className={styles.container}>
            <div className={styles.title}>커뮤니티</div>
            <div className={styles.table}>
              {communities.map((community) => {
                const now = dayjs();
                const targetDate = dayjs(community.created_at);
                const formatDate = targetDate.format("YYYY.MM.DD");
                const isNew = now.diff(targetDate, "day") <= 7;
                console.log(isNew);

                return (
                  <Link
                    key={community.id}
                    className={styles.row}
                    href={`${PATH.COMMUNITY}/${community.id}`}
                  >
                    <div className={styles.rowTitle}>
                      {isNew && <span>N</span>}
                      {community.title}
                    </div>
                    <div className={styles.rightSide}>
                      <div>작성일: {formatDate}</div>
                      <div>작성자: {community.owner_name}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
