'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { SubmissionType } from '@/types/submission';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function SubmissionSubmit() {
  const route = useRouter();
  const param = useParams();

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
      wallet_id: user?.walletId,
    });

    route.push(`${PATH.SUBMISSION}/${param.id}`);
  }, [param.id, route, submission, user?.walletId]);

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
                <input className={styles.input} placeholder="submit anything" />
                <button
                  className={clsx(styles.submitBtn, submission?.submitStatus ? styles.isSubmit : null)}
                  onClick={submissionSubmit}
                >
                  submit
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
