"use client";

import BackLink from "@/components/BackLink";
import Comment from "@/components/Comment";
import Wrapper from "@/components/Wrapper";
import { PATH } from "@/constant/route";
import fetchData from "@/libs/fetchData";
import { CommentType } from "@/types/comment";
import { CommunityType } from "@/types/community";
import clsx from "clsx";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Community() {
  const param = useParams();
  const [community, setCommunity] = useState<CommunityType>();
  const [comments, setComments] = useState<CommentType[]>();

  const commentCallData = useCallback(async () => {
    const commentsResponse = (await fetchData(`/comments/${param.id}`, "POST", {
      type: "community",
    })) as CommentType[];

    setComments(commentsResponse);
  }, [param.id]);

  useEffect(() => {
    const callData = async () => {
      const response = (await fetchData(
        `/communities/${param.id}`
      )) as CommunityType;

      setCommunity(response);
    };

    commentCallData();
    callData();
  }, [param.id]);

  const formatDate = dayjs(community?.created_at).format("YYYY.MM.DD");

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
            <div className={styles.wrapper}>
              <div className={clsx(styles.card, styles.title)}>
                {community?.title}
                <span>작성일: {formatDate}</span>
              </div>
              <div className={clsx(styles.card, styles.content)}>
                {community?.content}
              </div>
            </div>
            <Comment
              type="community"
              commentFuc={commentCallData}
              comments={comments}
            />
          </div>
        ),
      }}
    </Wrapper>
  );
}
