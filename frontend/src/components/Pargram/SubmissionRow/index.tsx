'use client';

import { PATH } from '@/constant/route';
import { getConvertDeadline } from '@/functions/deadline-function';
import { SubmissionType } from '@/types/submission';
import Link from 'next/link';
import styles from './index.module.scss';

interface SubmissionRowProps {
  submissions?: SubmissionType[];
}

const SubmissionRow: React.FC<SubmissionRowProps> = ({ submissions }) => {
  return (
    <div className={styles.container}>
      {submissions?.map((submission) => {
        return (
          <div key={submission.id} className={styles.submissionWrapper}>
            <div className={styles.leftSide}>
              {submission.type && <span>{submission.type === 'article' ? '아티클' : '미션'}</span>}
              <span className={styles.endTime}>마감 {getConvertDeadline(submission.end_at)}일 전</span>
              <Link href={`${PATH.SUBMISSION}/${submission.id}`}>{submission.title}</Link>
            </div>
            <div className={styles.rightSide}>{submission.type && <div className={styles.working}>미진행</div>}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionRow;
