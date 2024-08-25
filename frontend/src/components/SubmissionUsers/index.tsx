'use client';

import { useValidator } from '@/hooks/store/useValidator';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { UserSubmissionListType } from '@/types/user_submission_list';
import { useParams } from 'next/navigation';
import { includes, isNil } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';

interface SubmissionUsersProps {
  mission?: MissionType;
  validatorList: string[];
}

const SubmissionUsers: React.FC<SubmissionUsersProps> = ({ mission, validatorList }) => {
  const param = useParams();
  const { signForClaim } = useValidator();

  const { user } = useUser();
  const [userSubmissions, setUserSubmissions] = useState<UserSubmissionListType[]>([]);

  const participateCallData = useCallback(async () => {
    const [userSubmissions] = await Promise.all([
      fetchData(`/user_submission_status/${param.id}`, 'POST', {
        program_id: mission?.program_id,
        mission_id: mission?.mission_id,
      }),
    ]);

    setUserSubmissions(userSubmissions);
  }, [mission?.mission_id, mission?.program_id, param.id]);

  useEffect(() => {
    participateCallData();
  }, [participateCallData]);

  const missionStatus = useCallback(
    (submission: UserSubmissionListType) => {
      if (submission.is_claimed === 0 && isNil(submission.sig)) {
        return (
          <button
            className={styles.submissionBtn}
            onClick={() => {
              signForClaim({
                programId: mission?.program_id || 0,
                missionNumber: mission?.mission_id || 0,
                recipient: submission.address,
                prize: mission?.prize || '',
              });
              participateCallData();
            }}
          >
            Sign
          </button>
        );
      } else if (submission.is_claimed === 1 && !isNil(submission.sig)) {
        return <div>Done</div>;
      }

      return <div>Ing..</div>;
    },
    [mission?.mission_id, mission?.prize, mission?.program_id, participateCallData, signForClaim],
  );

  return (
    <div className={styles.container}>
      {userSubmissions.map((submission) => {
        return (
          <div key={submission.address} className={styles.row}>
            <div className={styles.leftSide}>
              {submission.name}
              <div className={styles.addressWrapper}>
                (<span className={styles.address}>{submission.address}</span>)
              </div>
            </div>
            {includes(user?.walletId, validatorList) && missionStatus(submission)}
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionUsers;
