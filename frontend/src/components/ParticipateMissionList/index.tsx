'use client';

import { PATH } from '@/constant/route';
import { getConvertDeadline } from '@/functions/deadline-function';
import { useClaim } from '@/hooks/store/useClaim';
import { useValidator } from '@/hooks/store/useValidator';
import { UserSubmissionStatusMissionsType } from '@/types/user_submission_status_missions';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import styles from './index.module.scss';

interface ParticipateMissionListProps {
  mission: UserSubmissionStatusMissionsType;
}

const ParticipateMissionList: React.FC<ParticipateMissionListProps> = ({ mission }) => {
  const account = useAccount();
  const { requestToValidator } = useValidator();
  const { claim } = useClaim();

  const claimPrize = async () => {
    await claim({ programId: mission.program_id, missionNumber: mission.mission_id });
  };

  const isExpired = useMemo(() => {
    const remindDate = getConvertDeadline(mission.end_at);
    if (remindDate <= 0) {
      return true;
    }

    return false;
  }, [mission.end_at]);

  const missionStatus = useMemo(() => {
    if (account) {
      if (mission.missionCnt === mission.submissionCount) {
        return (
          <button
            className={styles.submissionBtn}
            onClick={async () => {
              await requestToValidator({
                programId: mission.program_id,
                missionNumber: mission.mission_id,
                prize: mission.prize,
                recipient: account.address || '',
              });
            }}
          >
            Request
          </button>
        );
      }

      return <button className={clsx(styles.submissionBtn, styles.notWork)}>Request</button>;
    }

    return null;
  }, [account, mission, requestToValidator]);

  const tokenClaim = useMemo(() => {
    if (account) {
      if (mission.missionCnt === mission.submissionCount) {
        return (
          <button className={styles.submissionBtn} onClick={() => claimPrize()}>
            Claim
          </button>
        );
      }

      return <button className={clsx(styles.submissionBtn, styles.notWork)}>Claim</button>;
    }

    return null;
  }, [account, mission]);

  return (
    <div className={styles.row}>
      <div className={styles.rowTitle}>
        <Link href={`${PATH.MISSION}/${mission.id}`} className={styles.link}>
          <span className={styles.programType}>{mission.missionCnt === mission.submissionCount ? 'Done' : 'Ing'}</span>
          <span className={styles.contentTitle}>{mission.title}</span>
        </Link>
        <div className={styles.prize}>Prize: {mission.prize} EDU</div>
      </div>
      {!isExpired && <div className={styles.buttonWrapper}>{tokenClaim}</div>}
      {isExpired ? (
        <div className={styles.buttonWrapper}>Expired</div>
      ) : (
        <div className={styles.buttonWrapper}>{missionStatus}</div>
      )}
    </div>
  );
};

export default ParticipateMissionList;
