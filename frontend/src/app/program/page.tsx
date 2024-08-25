'use client';

import AddLogo from '@/assets/common/AddLogo.svg';
import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
import BackLink from '@/components/BackLink';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import fetchData from '@/libs/fetchData';
import { ProgramType } from '@/types/program';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { isEmpty, prop, sortBy } from 'ramda';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { add } from '@/functions/math';

export default function Program() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [totalPrize, setTotalPrize] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const callData = async () => {
      const response = (await fetchData('/programs', 'POST', {
        isDash: false,
      })) as ProgramType[];

      setPrograms(response);
      const newTotalPrize = response.reduce((acc, prgrm) => {
        if (!prgrm.missions) {
          acc[prgrm.id] = '0';
        } else {
          const sum = prgrm.missions.reduce((missionSum, msn) => add(missionSum, msn.prize), '0');
          acc[prgrm.id] = sum;
        }
        return acc;
      }, {} as { [key: number]: string });

      setTotalPrize(newTotalPrize);
    };

    callData();
  }, []);

  return (
    <Wrapper>
      {{
        header: (
          <div className={styles.headerWrapper}>
            <BackLink path={PATH.HOME} />
            <Link className={styles.addLink} href={`${PATH.PROGRAM}/create`}>
              Create program
            </Link>
          </div>
        ),
        body: (
          <div className={styles.container}>
            <div className={styles.title}>Program</div>
            <div className={clsx(styles.table, 'accordion accordion-flush')} id="accordionFlush">
              {/* <div className={styles.tableHeader}>Program list</div> */}
              {programs.map((program) => {
                const missions = sortBy(prop('id'), program.missions || []);
                return (
                  <div key={program.id} className={clsx(styles.tableBody, 'accordion-item')}>
                    <h2 className={clsx(styles.tableRow, 'accordion-header')}>
                      <Link href={`${PATH.PROGRAM}/${program.id}`}>
                        <div className={clsx(styles.badge, program.type === 'study' ? styles.studyBadge : null)}>
                          {program.type}
                        </div>
                        <div className={styles.prize}>{totalPrize[program.id]} EDU</div>
                        <div className={styles.announceTitle}>{program.title}</div>
                      </Link>
                      {/* <button
                        className={clsx(styles.collapseBtn, 'accordion-button')}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#accordion-${program.id}`}
                        aria-expanded="true"
                        aria-controls={`accordion-${program.id}`}
                      ></button> */}
                    </h2>
                    {/* <div
                      id={`accordion-${program.id}`}
                      className={clsx(styles.accordionCollapse, 'accordion-collapse collapse show')}
                    >
                      <div className={clsx(styles.missionsWrapper, 'accordion-body')}>
                        {isEmpty(missions) && (
                          <Link className={styles.makeMissionBtn} href={`${PATH.PROGRAM}/${program.id}/edit`}>
                            Make Missions
                          </Link>
                        )}
                        {!isEmpty(missions) &&
                          missions?.map((mission) => {
                            return (
                              <div key={mission.id} className={styles.missionWrapper}>
                                <div className={styles.titleWrapper}>
                                  <div className={styles.missionCategory}>
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
                                  </div>
                                  <Link href={`${PATH.MISSION}/${mission.id}`}>{mission.title}</Link>
                                </div>
                                <div className={styles.hasOwner}>{mission.owner ? 'Assigned' : 'Not Assigned'}</div>
                              </div>
                            );
                          })}
                      </div>
                    </div> */}
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
