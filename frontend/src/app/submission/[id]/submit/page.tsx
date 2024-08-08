'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import fetchData from '@/libs/fetchData';
import { SubmissionType } from '@/types/submission';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function SubmissionSubmit() {
  const param = useParams();
  const [submission, setSubmission] = useState<SubmissionType>();

  useEffect(() => {
    const callData = async () => {
      try {
        const response = (await fetchData(`/submissions/${param.id}`)) as SubmissionType;

        setSubmission(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id]);

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
                <div>good</div>
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
