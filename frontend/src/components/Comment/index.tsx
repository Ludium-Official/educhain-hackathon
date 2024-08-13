'use client';

import ProfileLogo from '@/assets/profile/ProfileLogo.svg';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { CommentType } from '@/types/comment';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from './index.module.scss';

interface CommentProps {
  type: string;
  commentFuc: () => Promise<void>;
  comments?: CommentType[];
}

const Comment: React.FC<CommentProps> = ({ type, commentFuc, comments }) => {
  const param = useParams();
  const { user } = useUser();
  const account = useAccount();
  const [comment, setComment] = useState('');

  const SubmitComment = useCallback(
    async (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      await fetchData('/comments/postComment', 'POST', {
        id: param.id,
        writer: user?.walletId,
        message: comment,
        type,
      });

      commentFuc();
      setComment('');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [param.id, user?.walletId, comment, type],
  );

  return (
    <div className={styles.commentsWrapper}>
      <div className={clsx(styles.card, styles.comments)}>
        <div className={styles.title}>Comment</div>
        <div className={styles.contentWrapper}>
          {comments?.map((comment) => {
            const now = dayjs();
            const beforeDate = now.diff(dayjs(comment.created_at), 'day');

            return (
              <div key={comment.id} className={styles.commentWrapper}>
                <div className={styles.header}>
                  <Image className={styles.userImg} src={ProfileLogo.src} alt="logo" width={36} height={36} />
                  {comment.name}
                  <span>{beforeDate}days before</span>
                </div>
                <div className={styles.commentContent}>{comment.message}</div>
              </div>
            );
          })}
        </div>
      </div>
      <form className={clsx(styles.card, styles.inputComment)} onSubmit={SubmitComment}>
        <div className={styles.header}>
          <Image className={styles.userImg} src={ProfileLogo.src} alt="logo" width={36} height={36} />
          Add Comment
        </div>
        {account.address ? (
          <input
            type="text"
            placeholder="push comment.."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        ) : (
          <div className={styles.notLogin}>Login first</div>
        )}
      </form>
    </div>
  );
};

export default Comment;
