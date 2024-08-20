'use client';

import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { UserSubmissionStatusMissionsType } from '@/types/user_submission_status_missions';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function EditProfile() {
  const { user } = useUser();

  const [statusMissions, setStatusMissions] = useState<UserSubmissionStatusMissionsType[]>([]);

  const callProgramsWithMissions = useCallback(async () => {
    try {
      const [statusMissions] = await Promise.all([
        fetchData('/user_submission_status/missions', 'POST', {
          walletId: user?.walletId,
        }),
      ]);

      setStatusMissions(statusMissions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user?.walletId]);

  useEffect(() => {
    callProgramsWithMissions();
  }, [callProgramsWithMissions]);

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={PATH.PROFILE} />
          </div>
        ),
        body: (
          <div className={styles.container}>
            <div className={styles.title}>Participate Missions</div>
            <div className={styles.content}>
              {statusMissions.map((mission) => {
                const formatDate = dayjs(mission.end_at).format('YYYY.MM.DD');

                return (
                  <div key={mission.id} className={styles.row}>
                    <div className={styles.rowTitle}>
                      <span className={styles.programType}>
                        {mission.missionCnt === mission.submissionCount ? 'Done' : 'Ing'}
                      </span>
                      <span className={styles.contentTitle}>{mission.title}</span>
                      <div className={styles.prize}>prize: {mission.prize} EDU</div>
                    </div>
                    <div className={styles.deadline}>Deadline: {mission.end_at ? formatDate : '-'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ),
      }}
    </Wrapper>
  );
}
