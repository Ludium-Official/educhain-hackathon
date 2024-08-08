'use client';

import BackLink from '@/components/BackLink';
import MarkedHtml from '@/components/MarkedHtml';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { getConvertDeadline } from '@/functions/deadline-function';
import { missionChapterSubmissionParsing } from '@/functions/parsing-function';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { ParsingMissionType } from '@/types/parsingMission';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function MissionDetail() {
  const param = useParams();

  const { user } = useUser();
  const [mission, setMission] = useState<ParsingMissionType>();

  useEffect(() => {
    const callData = async () => {
      try {
        const [missionResponse, chaptersResponse, submissionsResponse] = await Promise.all([
          fetchData(`/missions/${param.id}`),
          fetchData(`/chapters/mission/${param.id}`),
          fetchData(`/submissions/mission/${param.id}`, 'POST', {
            wallet_id: user?.walletId,
          }),
        ]);

        const parsingMissionData = missionChapterSubmissionParsing(
          [missionResponse],
          chaptersResponse,
          submissionsResponse,
        )[0] as ParsingMissionType;

        setMission(parsingMissionData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id, user?.walletId]);

  const formatDate = dayjs(mission?.end_at).format('YYYY.MM.DD');

  return (
    <Wrapper>
      {{
        header: (
          <div>
            <BackLink path={mission ? `${PATH.PROGRAM}/${mission.program_id}` : PATH.PROGRAM} />
          </div>
        ),
        body: (
          <div className={styles.container}>
            {mission ? (
              <>
                <div className={styles.titleWrapper}>
                  <div className={styles.missionHeader}>
                    <div className={styles.missionCategory}>{mission.category === 'study' ? '학습' : '공고'}</div>
                    {mission.title}
                    <div className={styles.missionPrize}>(상금: {mission.prize})</div>
                  </div>
                  <div className={styles.rightSide}>
                    <span>마감일: {formatDate}</span>
                    <div className={styles.owner}>담당자: {mission.owner_name || '-'}</div>
                  </div>
                </div>
                <div className={styles.contentWrapper}>
                  <MarkedHtml markdownString={mission.content} height={600} />
                </div>
                {mission.submissions && (
                  <div className={styles.contentWrapper}>
                    <div className={styles.submissionWrapper}>
                      {mission.submissions?.map((submission) => {
                        return (
                          <div key={submission.id} className={styles.submissionContent}>
                            <div className={styles.leftSide}>
                              <span className={styles.endTime}>마감 {getConvertDeadline(submission.end_at)} 일 전</span>
                              <Link href={`${PATH.SUBMISSION}/${submission.id}`}>{submission.title}</Link>
                            </div>
                            {submission.type && (
                              <div className={styles.working}>{submission.submitStatus ? '완료' : '미진행'}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {mission.chapters && (
                  <div className={styles.contentWrapper}>
                    {mission.chapters?.map((chapter) => {
                      return (
                        <div key={chapter.id} className={styles.chapterWrapper}>
                          <div className={styles.chapterTitle}>{chapter.title}</div>
                          <div className={styles.submissionWrapper}>
                            {chapter.submissions?.map((submission) => {
                              return (
                                <div key={submission.id} className={styles.submissionContent}>
                                  <div className={styles.leftSide}>
                                    <span className={styles.submissionType}>
                                      {submission.type === 'article' ? '아티클' : '미션'}
                                    </span>
                                    <span className={styles.endTime}>
                                      마감 {getConvertDeadline(submission.end_at)} 일 전
                                    </span>
                                    <Link href={`${PATH.SUBMISSION}/${submission.id}`}>{submission.title}</Link>
                                  </div>
                                  {submission.type && (
                                    <div className={styles.working}>{submission.submitStatus ? '완료' : '미진행'}</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!mission.owner_name && <button className={styles.applyBtn}>지원하기</button>}
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
