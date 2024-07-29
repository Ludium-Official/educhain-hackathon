"use client";

import ProfileLogo from "@/assets/profile/ProfileLogo.svg";
import { useUser } from "@/hooks/store/user";
import fetchData from "@/libs/fetchData";
import { CommentType } from "@/types/comment";
import clsx from "clsx";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./index.module.scss";

interface CommentProps {
  type: string;
  commentFuc: () => Promise<void>;
  comments?: CommentType[];
}

const Comment: React.FC<CommentProps> = ({ type, commentFuc, comments }) => {
  const param = useParams();
  const { user } = useUser();
  const account = useAccount();
  const [comment, setComment] = useState("");

  const SubmitComment = useCallback(
    async (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();

        await fetchData("/postComment", "POST", {
          id: param.id,
          writer: user?.walletId,
          message: comment,
          type,
        });

        commentFuc();
        setComment("");
      }
    },
    [param.id, user?.walletId, comment, type, commentFuc]
  );

  return (
    <div className={styles.commentsWrapper}>
      <div className={clsx(styles.card, styles.comments)}>
        <div className={styles.title}>코멘트</div>
        <div className={styles.contentWrapper}>
          {comments?.map((comment) => {
            const now = dayjs();
            const beforeDate = now.diff(dayjs(comment.created_at), "day");

            return (
              <div key={comment.id} className={styles.commentWrapper}>
                <div className={styles.header}>
                  <Image
                    className={styles.userImg}
                    src={ProfileLogo.src}
                    alt="logo"
                    width={36}
                    height={36}
                  />
                  {comment.name}
                  <span>{beforeDate}일 전</span>
                </div>
                <div className={styles.commentContent}>{comment.message}</div>
              </div>
            );
          })}
        </div>
      </div>
      <form
        className={clsx(styles.card, styles.inputComment)}
        onKeyDown={SubmitComment}
      >
        <div className={styles.header}>
          <Image
            className={styles.userImg}
            src={ProfileLogo.src}
            alt="logo"
            width={36}
            height={36}
          />
          코멘트 작성하기
        </div>
        {account.address ? (
          <input
            type="text"
            placeholder="코멘트 입력.."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        ) : (
          <div className={styles.notLogin}>로그인 하세요</div>
        )}
      </form>
    </div>
  );
};

export default Comment;
