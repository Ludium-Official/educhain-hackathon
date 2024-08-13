'use client';

import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { ProgramType } from '@/types/program';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function ProgramManage() {
  const { user } = useUser();

  const [programs, setPrograms] = useState<ProgramType[]>([]);

  const callProgramsWithMissions = useCallback(async () => {
    try {
      const [programResponse] = await Promise.all([
        fetchData('/programs', 'POST', {
          walletId: user?.walletId,
          isConfirm: true,
        }),
      ]);

      setPrograms(programResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user?.walletId]);

  useEffect(() => {
    callProgramsWithMissions();
  }, [callProgramsWithMissions]);

  const SubmitComment = useCallback(
    async (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      await fetchData('/missions/patchActive', 'POST', {
        id: event.target.value,
      });

      alert(`Now active mission id ${event.target.value}`);
      callProgramsWithMissions();
    },
    [callProgramsWithMissions],
  );

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
            <div className={styles.title}>Program Manage</div>
            <div className={styles.content}>
              {programs.map((program) => {
                return (
                  <div key={program.id} className={styles.row}>
                    <div className={styles.programTitle}>{program.title}</div>
                    {program.missions?.map((mission) => {
                      return (
                        <div key={mission.id} className={styles.line}>
                          <div className={styles.leftSide}>
                            {mission.category === 'study' ? (
                              <Image
                                className={styles.categoryLogo}
                                src={StudyLogo.src}
                                alt="logo"
                                width={24}
                                height={24}
                              />
                            ) : (
                              <Image
                                className={styles.categoryLogo}
                                src={AnnouncementLogo.src}
                                alt="logo"
                                width={24}
                                height={24}
                              />
                            )}
                            <div className={styles.prize}>{mission.prize} EDU</div>
                            {mission.title}
                          </div>
                          {!mission.is_confirm && (
                            <button className={styles.confirmBtn} value={mission.id} onClick={SubmitComment}>
                              Confirm
                            </button>
                          )}
                        </div>
                      );
                    })}
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
