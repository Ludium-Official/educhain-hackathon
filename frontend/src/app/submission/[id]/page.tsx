"use client";

import BackLink from "@/components/BackLink";
import Comment from "@/components/Comment";
import MarkedHtml from "@/components/MarkedHtml";
import Wrapper from "@/components/Wrapper";
import { PATH } from "@/constant/route";
import fetchData from "@/libs/fetchData";
import { CommentType } from "@/types/comment";
import { SubmissionType } from "@/types/submission";
import clsx from "clsx";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";

export default function MissionDetail() {
  const param = useParams();
  const [submission, setSubmission] = useState<SubmissionType>();
  const [comments, setComments] = useState<CommentType[]>();

  const commentCallData = useCallback(async () => {
    const commentsResponse = (await fetchData(`/comments/${param.id}`, "POST", {
      type: "submission",
    })) as CommentType[];

    setComments(commentsResponse);
  }, [param.id]);

  useEffect(() => {
    const callData = async () => {
      try {
        const response = (await fetchData(
          `/submissions/${param.id}`
        )) as SubmissionType;

        setSubmission(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    commentCallData();
    callData();
  }, [param.id]);

  const formatDate = dayjs(submission?.end_at).format("YYYY.MM.DD");
  const buttonTitle = useMemo(() => {
    if (submission?.type) {
      if (submission.type === "article") {
        return "아티클 완료하기";
      }

      return "제출하기";
    }

    return "지원하기";
  }, [submission]);

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink
              path={
                submission
                  ? `${PATH.MISSION}/${submission.mission_id}`
                  : PATH.PROGRAM
              }
            />
          </div>
        ),
        body: (
          <div className={styles.container}>
            {submission ? (
              <>
                <div className={styles.wrapper}>
                  <div>
                    <div className={clsx(styles.card, styles.title)}>
                      {submission.title}
                      <span>마감일: {formatDate}</span>
                    </div>
                    <div className={clsx(styles.card, styles.content)}>
                      <MarkedHtml markdownString={submission.content} />
                    </div>
                  </div>
                  <button className={styles.submitBtn}>{buttonTitle}</button>
                </div>
                <Comment
                  type="submission"
                  commentFuc={commentCallData}
                  comments={comments}
                />
              </>
            ) : (
              <div>null</div>
            )}
          </div>
        ),
      }}
    </Wrapper>
  );
}
