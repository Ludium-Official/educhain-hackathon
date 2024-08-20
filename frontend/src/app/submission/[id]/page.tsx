'use client';

import BackLink from '@/components/BackLink';
import Comment from '@/components/Comment';
import MarkedHtml from '@/components/MarkedHtml';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { CommentType } from '@/types/comment';
import { SubmissionType } from '@/types/submission';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';

export default function SubmissionDetail() {
  const route = useRouter();
  const param = useParams();

  const { user } = useUser();
  const [submission, setSubmission] = useState<SubmissionType>();
  const [comments, setComments] = useState<CommentType[]>();

  const commentCallData = useCallback(async () => {
    const commentsResponse = (await fetchData(`/comments/${param.id}`, 'POST', {
      type: 'submission',
    })) as CommentType[];

    setComments(commentsResponse);
  }, [param.id]);

  const submissionCallData = useCallback(async () => {
    const response = (await fetchData(`/submissions/${param.id}`, 'POST', {
      wallet_id: user?.walletId,
    })) as SubmissionType;

    setSubmission(response);
  }, [param.id, user?.walletId]);

  useEffect(() => {
    commentCallData();
    submissionCallData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.id, user]);

  const formatDate = dayjs(submission?.end_at).format('YYYY.MM.DD');

  const buttonTitle = useMemo(() => {
    if (submission?.submitStatus) {
      return 'Success';
    }

    if (submission?.type) {
      if (submission.type === 'article') {
        return 'Complete the article';
      }

      return 'Submit';
    }

    return 'Apply';
  }, [submission]);

  const submissionSubmit = useCallback(async () => {
    if (submission?.submitStatus) {
      return null;
    }

    if (submission?.type === 'article') {
      await fetchData(`/submissions/submit/${param.id}`, 'POST', {
        submission,
        wallet_id: user?.walletId,
      });

      submissionCallData();
      return null;
    }

    route.push(`${PATH.SUBMISSION}/${param.id}/submit`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.id, route, submission, user?.walletId]);

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={submission ? `${PATH.MISSION}/${submission.mission_id}` : PATH.PROGRAM} />
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
                      <span>Deadline: {formatDate}</span>
                    </div>
                    <div className={clsx(styles.card, styles.content)}>
                      <MarkedHtml markdownString={submission.content} />
                    </div>
                  </div>
                  <button
                    className={clsx(styles.submitBtn, submission?.submitStatus ? styles.isSubmit : null)}
                    onClick={submissionSubmit}
                  >
                    {buttonTitle}
                  </button>
                </div>
                <Comment type="submission" commentFuc={commentCallData} comments={comments} />
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
