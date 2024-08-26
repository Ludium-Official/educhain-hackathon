'use client';

import AddLogo from '@/assets/common/AddLogo.svg';
import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
import BackLink from '@/components/BackLink';
import MarkedHtml from '@/components/MarkedHtml';
import SubmissionRow from '@/components/Pargram/SubmissionRow';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { missionChapterSubmissionParsing } from '@/functions/parsing-function';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { ParsingMissionType } from '@/types/parsingMission';
import { ProgramType } from '@/types/program';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { add } from '@/functions/math';

export default function ProgramDetail() {
  const param = useParams();

  const { user } = useUser();
  const [program, setProgram] = useState<ProgramType>();
  const [missions, setMissions] = useState<ParsingMissionType[]>([]);
  const [totalPrize, setTotalPrize] = useState<string>('0');

  useEffect(() => {
    const callData = async () => {
      try {
        const [programResponse, missionResponse, chaptersResponse, submissionsResponse] = await Promise.all([
          fetchData(`/programs/${param.id}`),
          fetchData(`/missions/program/${param.id}`),
          fetchData(`/chapters/program/${param.id}`),
          fetchData(`/submissions/program/${param.id}`, 'POST', {
            wallet_id: user?.walletId,
          }),
        ]);

        const parsingMissionData = missionChapterSubmissionParsing(
          missionResponse,
          chaptersResponse,
          submissionsResponse,
        );

        setProgram(programResponse as ProgramType);
        setMissions(parsingMissionData as ParsingMissionType[]);

        let total = '0';
        for (const mission of parsingMissionData) {
          total = add(total, mission.prize);
        }
        setTotalPrize(total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id, user?.walletId]);

  const formatDate = dayjs(program?.created_at).format('YYYY.MM.DD');

  return (
    <Wrapper>
      {{
        header: (
          <div className={styles.headerWrapper}>
            <BackLink path={PATH.PROGRAM} />
            <div className="flex space-x-10">
              {user && (
                <Link className={styles.addLink} href={`${PATH.PROGRAM}/${param.id}/new-mission`}>
                  New Mission
                </Link>
              )}
              {user && user.walletId == program?.owner&& (
                <Link className={styles.addLink} href={`${PATH.PROGRAM}/${param.id}/edit`}>
                  Manage Program
                </Link>
              )}
            </div>
          </div>
        ),
        body: (
          <div className={styles.container}>
            {program ? (
              <>
                <div className={styles.title}>{program?.title}</div>
                <div className={styles.tableWrapper}>
                  <div className={styles.table}>
                    <div className={styles.tableHeader}>
                      <div className={styles.titleWrapper}>
                        Program<span>(Total prize: {totalPrize})</span>
                      </div>
                      <span className={styles.makeDate}>Date: {formatDate}</span>
                    </div>
                    <div className={styles.tableContent}>
                      <MarkedHtml markdownString={program?.guide} height={500} />
                    </div>
                  </div>
                  <div className={styles.table}>
                    <div className={styles.tableHeader}>Missions</div>
                    <div className={clsx(styles.tableAccordion, 'accordion accordion-flush')}>
                      {missions.map((mission) => {
                        const chapters = mission.chapters;
                        return (
                          <div key={mission.id} className={clsx(styles.tableBody, 'accordion-item')}>
                            <h2 className={clsx(styles.tableRow, 'accordion-header')}>
                              <div className={styles.missionHeader}>
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
                                <div className={styles.missionPrize}>(Prize: {mission.prize})</div>
                              </div>
                              <button
                                className={clsx(styles.collapseBtn, 'accordion-button')}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#accordion-${mission.id}`}
                                aria-expanded="true"
                                aria-controls={`accordion-${mission.id}`}
                              ></button>
                            </h2>
                            <div
                              id={`accordion-${mission.id}`}
                              className={clsx(styles.accordionCollapse, 'accordion-collapse collapse show')}
                            >
                              <div className={clsx(styles.missionsWrapper, 'accordion-body')}>
                                <div className={styles.missionOwner}>
                                  Manager: {mission.owner_name || <button className={styles.apply}>Apply</button>}
                                </div>
                                {chapters ? (
                                  chapters?.map((chapter) => {
                                    return (
                                      <div key={chapter.id} className={styles.chapterWrapper}>
                                        <div className={styles.chapterTitle}>{chapter.title}</div>
                                        <SubmissionRow submissions={chapter.submissions} />
                                      </div>
                                    );
                                  })
                                ) : (
                                  <SubmissionRow submissions={mission.submissions} />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        ),
      }}
    </Wrapper>
  );
}
