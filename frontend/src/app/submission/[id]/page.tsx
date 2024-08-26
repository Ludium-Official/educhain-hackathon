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
import { useAccount } from 'wagmi';
import styles from './page.module.scss';

export default function SubmissionDetail() {
  const route = useRouter();
  const param = useParams();

  const account = useAccount();
  const { user } = useUser();
  const [submission, setSubmission] = useState<SubmissionType>();
  const [comments, setComments] = useState<CommentType[]>();
  const [answer, setAnswer] = useState<string>('');

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
      return 'Completed';
    }

    if (submission?.type) {
      if (submission.type === 'article') {
        return 'Complete the article';
      }

      return 'Submit';
    }

    return 'Apply';
  }, [submission]);
  const handleChange = (e: any) => {
    console.log('Value before update:', answer);
    setAnswer(e.target.value);
    console.log('Value after update:', e.target.value);
  };
  const submissionSubmit = useCallback(async () => {
    if (submission?.type === 'mission') {
      const content = submission.content;
      const regex = /```([\s\S]*?)```/g;
      let match = regex.exec(content);
      if (match) {
        const extractedValue = match[1];
        const trimmedExtractedValue = extractedValue.replace(/\s+/g, '').trim();
        const trimmedInputValue = answer.replace(/\s+/g, '').trim();
        if (extractedValue !== answer && trimmedExtractedValue !== trimmedInputValue) {
          alert('Wrong answer. Please check the answer and try again.');
          return;
        }
      } else {
        // 백틱 사이의 값이 없는 경우
        console.warn('No content found between backticks.');
        return;
      }
    }

    alert("Correct ansewer! Submit the answer.");

    if (submission?.type) {
      await fetchData(`/submissions/submit/${param.id}`, 'POST', {
        submission,
        wallet_info: {
          wallet_id: user?.walletId,
          address: account.address,
        },
      });

      submissionCallData();
      return null;
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.id, route, submission, user?.walletId, answer]);

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
                  {!submission?.submitStatus && submission.type === 'mission' && (
                    <textarea
                      className={styles.input}
                      placeholder="input your answer"
                      value={answer}
                      onChange={handleChange}
                    />
                  )}
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
              <div></div>
            )}
          </div>
        ),
      }}
    </Wrapper>
  );
}
