'use client';

import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { getConvertDeadline } from '@/functions/deadline-function';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { ProgramType } from '@/types/program';
import { UserCountType } from '@/types/user_count';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';

export default function ProgramManage() {
  const { user } = useUser();

  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [userCount, setUserCount] = useState<UserCountType>();

  const callProgramsWithMissions = useCallback(async () => {
    try {
      const [programResponse, userCount] = await Promise.all([
        fetchData('/programs', 'POST', {
          walletId: user?.walletId,
          isConfirm: true,
        }),
        fetchData('/user_submission_status/count', 'POST', {
          walletId: user?.walletId,
        }),
      ]);

      setPrograms(programResponse);
      setUserCount(userCount);
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

  const totalPrizeAmount = useMemo(() => {
    return programs.reduce((result, program) => (result += program.prize), 0);
  }, [programs]);

  const activeProgramCount = useMemo(() => {
    return programs.reduce((result, program) => {
      if (!program.end_at) {
        return (result += 0);
      } else if (getConvertDeadline(program.end_at) >= 0) {
        return (result += 1);
      }

      return (result += 0);
    }, 0);
  }, [programs]);

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
            <div className={styles.introCard}>
              <div className={styles.content}>
                <div className={styles.cardTitle}>Prize</div>
                {/* TODO: 컨트렉트에서 현재 남은 token수 가져오기 */}
                <div className={styles.cardContent}>0 EDU / {totalPrizeAmount} EDU</div>
              </div>
              <div className={styles.content}>
                <div className={styles.cardTitle}>Used users</div>
                <div className={styles.cardContent}>{userCount?.user_count || 0}</div>
              </div>
              <div className={styles.content}>
                <div className={styles.cardTitle}>Active programs</div>
                <div className={styles.cardContent}>{activeProgramCount}</div>
              </div>
            </div>

            <div className={styles.content}>
              {programs.map((program) => {
                const formatDate = dayjs(program.end_at).format('YYYY.MM.DD');

                return (
                  <div key={program.id} className={styles.row}>
                    <div className={styles.programTitleWrapper}>
                      <Link className={styles.programTitle} href={`${PATH.PROGRAM}/${program.id}`}>
                        {program.title}
                      </Link>
                      <span>Deadline: {program.end_at ? formatDate : '-'}</span>
                    </div>
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
                            <Link href={`${PATH.MISSION}/${mission.id}`}>{mission.title}</Link>
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
