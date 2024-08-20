'use client';

import AnnouncementLogo from '@/assets/common/AnnouncementLogo.svg';
import StudyLogo from '@/assets/common/StudyLogo.svg';
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
import Image from 'next/image';
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
                    <div className={styles.missionCategory}>
                      {mission.category === 'study' ? (
                        <Image className={styles.categoryLogo} src={StudyLogo.src} alt="logo" width={24} height={24} />
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
                    {mission.title}
                    <div className={styles.missionPrize}>(Prize: {mission.prize})</div>
                  </div>
                  <div className={styles.rightSide}>
                    <span>Deadline: {formatDate}</span>
                    <div className={styles.owner}>Manager: {mission.owner_name || '-'}</div>
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
                              <span className={styles.endTime}>
                                {getConvertDeadline(submission.end_at)} days before deadline
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
                                      {submission.type === 'article' ? 'Article' : 'Mission'}
                                    </span>
                                    <span className={styles.endTime}>
                                      {getConvertDeadline(submission.end_at)} days before deadline
                                    </span>
                                    <Link href={`${PATH.SUBMISSION}/${submission.id}`}>{submission.title}</Link>
                                  </div>
                                  {submission.type && (
                                    <div className={styles.working}>
                                      {submission.submitStatus ? 'Success' : 'Not process'}
                                    </div>
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
