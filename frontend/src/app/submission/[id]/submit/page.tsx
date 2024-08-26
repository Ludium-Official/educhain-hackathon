'use client';

import BackLink from '@/components/BackLink';
import MarkedHtml from '@/components/MarkedHtml';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { SubmissionType } from '@/types/submission';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from './page.module.scss';

export default function SubmissionSubmit() {
  const route = useRouter();
  const param = useParams();

  const account = useAccount();
  const { user } = useUser();
  const [submission, setSubmission] = useState<SubmissionType>();

  useEffect(() => {
    const callData = async () => {
      try {
        const response = (await fetchData(`/submissions/${param.id}`, 'POST', {
          wallet_id: user?.walletId,
        })) as SubmissionType;

        setSubmission(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id, user?.walletId]);

  const submissionSubmit = useCallback(async () => {
    if (submission?.submitStatus) {
      return null;
    }

    await fetchData(`/submissions/submit/${param.id}`, 'POST', {
      submission,
      wallet_info: {
        wallet_id: user?.walletId,
        address: account.address,
      },
    });

    route.push(`${PATH.SUBMISSION}/${param.id}`);
  }, [account.address, param.id, route, submission, user?.walletId]);

  const formatDate = dayjs(submission?.end_at).format('YYYY.MM.DD');

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={submission ? `${PATH.SUBMISSION}/${submission.id}` : PATH.PROGRAM} />
          </div>
        ),
        body: (
          <div className={styles.container}>
            {submission ? (
              <>
                <div className={styles.card}>
                  <div className={styles.title}>
                    {submission.title}
                    <span>Deadline: {formatDate}</span>
                  </div>
                  <div className={styles.content}>
                    <MarkedHtml markdownString={submission.content} />
                  </div>
                </div>
                <textarea className={styles.input} placeholder="input your answer" />
                <button
                  className={clsx(styles.submitBtn, submission?.submitStatus ? styles.isSubmit : null)}
                  onClick={submissionSubmit}
                >
                  Submit
                </button>
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
