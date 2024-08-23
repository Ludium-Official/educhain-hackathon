'use client';

import { PATH } from '@/constant/route';
import { getConvertDeadline } from '@/functions/deadline-function';
import { SubmissionType } from '@/types/submission';
import Link from 'next/link';
import { isEmpty } from 'ramda';
import styles from './index.module.scss';

interface SubmissionRowProps {
  submissions?: SubmissionType[];
}

const SubmissionRow: React.FC<SubmissionRowProps> = ({ submissions }) => {
  if (isEmpty(submissions)) {
    return null;
  }

  return (
    <div className={styles.container}>
      {submissions?.map((submission) => {
        return (
          <div key={submission.id} className={styles.submissionWrapper}>
            <div className={styles.leftSide}>
              {submission.type && <span>{submission.type === 'article' ? 'Article' : 'Mission'}</span>}
              <span className={styles.endTime}>D-{getConvertDeadline(submission.end_at)}</span>
              <Link href={`${PATH.SUBMISSION}/${submission.id}`}>{submission.title}</Link>
            </div>
            <div className={styles.rightSide}>
              {submission.type && (
                <div className={styles.working}>{submission.submitStatus ? 'Success' : 'Not process'}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionRow;
