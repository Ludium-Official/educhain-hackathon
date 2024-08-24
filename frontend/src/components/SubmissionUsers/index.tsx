'use client';

import { useValidator } from '@/hooks/store/useValidator';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import { UserSubmissionListType } from '@/types/user_submission_list';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';

const SubmissionUsers: React.FC = () => {
  const param = useParams();
  const { signForClaim } = useValidator();

  const [mission, setMissions] = useState<MissionType>();
  const [userSubmissions, setUserSubmissions] = useState<UserSubmissionListType[]>([]);

  const participateCallData = useCallback(async () => {
    const [userSubmissions] = await Promise.all([fetchData(`/user_submission_status/${param.id}`)]);

    setUserSubmissions(userSubmissions);
  }, [param.id]);

  useEffect(() => {
    const callData = async () => {
      try {
        const [missionResponse] = await Promise.all([fetchData(`/missions/${param.id}`)]);

        setMissions(missionResponse);
        participateCallData();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id, participateCallData]);

  const missionStatus = (submission: UserSubmissionListType) => {
    if (!submission.sig) {
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
          }}
        >
          Sign
        </button>
      );
    }

    return <div>Ing..</div>;
  };

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
            {missionStatus(submission)}
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionUsers;
