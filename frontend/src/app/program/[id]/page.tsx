'use client';

import BackLink from '@/components/BackLink';
import MarkedHtml from '@/components/MarkedHtml';
import SubmissionRow from '@/components/Pargram/SubmissionRow';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { missionChapterSubmissionParsing } from '@/functions/parsing-function';
import fetchData from '@/libs/fetchData';
import { ParsingMissionType } from '@/types/parsingMission';
import { ProgramType } from '@/types/program';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function ProgramDetail() {
  const param = useParams();
  const [program, setProgram] = useState<ProgramType>();
  const [missions, setMissions] = useState<ParsingMissionType[]>([]);

  useEffect(() => {
    const callData = async () => {
      try {
        const [programResponse, missionResponse, chaptersResponse, submissionsResponse] = await Promise.all([
          fetchData(`/programs/${param.id}`),
          fetchData(`/missions/program/${param.id}`),
          fetchData(`/chapters/program/${param.id}`),
          fetchData(`/submissions/program/${param.id}`),
        ]);

        const parsingMissionData = missionChapterSubmissionParsing(
          missionResponse,
          chaptersResponse,
          submissionsResponse,
        );

        setProgram(programResponse as ProgramType);
        setMissions(parsingMissionData as ParsingMissionType[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id]);

  const formatDate = dayjs(program?.created_at).format('YYYY.MM.DD');

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={PATH.PROGRAM} />
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
                        Program<span>(총상금: {program.prize})</span>
                      </div>
                      <span className={styles.makeDate}>작성일: {formatDate}</span>
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
                                  {mission.category === 'study' ? '학습' : '공고'}
                                </div>
                                <Link href={`${PATH.MISSION}/${mission.id}`}>{mission.title}</Link>
                                <div className={styles.missionPrize}>(상금: {mission.prize})</div>
                              </div>
                              <button
                                className={clsx(styles.collapseBtn, 'accordion-button collapsed')}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#accordion-${mission.id}`}
                                aria-expanded="true"
                                aria-controls={`accordion-${mission.id}`}
                              ></button>
                            </h2>
                            <div id={`accordion-${mission.id}`} className="accordion-collapse collapse">
                              <div className={clsx(styles.missionsWrapper, 'accordion-body')}>
                                <div className={styles.missionOwner}>
                                  담당자: {mission.owner_name || <button className={styles.apply}>지원하기</button>}
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
              <div>null</div>
            )}
          </div>
        ),
      }}
    </Wrapper>
  );
}
