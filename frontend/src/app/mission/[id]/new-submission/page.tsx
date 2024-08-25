'use client';

import BlueExclamationLogo from '@/assets/common/BlueExclamationLogo.svg';
import BackLink from '@/components/BackLink';
import CreateSubmission from '@/components/CreateSubmission';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export interface Submission {
  title: string;
  content: string;
  type: string;
  endTime: string;
}

export default function MissionEdit() {
  const route = useRouter();
  const param = useParams();

  const { user } = useUser();

  const [chapterTitle, setChapterTitle] = useState('');
  const [mission, setMission] = useState<MissionType>();
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      title: '',
      content: '',
      type: 'article',
      endTime: '',
    },
  ]);

  useEffect(() => {
    const callData = async () => {
      try {
        const [missionResponse] = await Promise.all([fetchData(`/missions/${param.id}`)]);

        setMission(missionResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    callData();
  }, [param.id, user?.walletId]);

  const addSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user && mission) {
        await fetchData(`/submissions/${param.id}/add`, 'POST', {
          chapterData:
            mission?.category === 'study'
              ? {
                  title: chapterTitle,
                }
              : null,
          submissionData: {
            program_id: mission.program_id,
            submissions: submissions,
          },
        });

        alert('Success to make submission!');
        route.push(`${PATH.MISSION}/${param.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      {{
        header: <BackLink path={`${PATH.MISSION}/${param.id}`} />,
        body: (
          <div className={styles.container}>
            {user?.walletId === mission?.owner ? (
              <>
                <div className={styles.title}>Mission Manage</div>
                <div className={styles.tableWrapper}>
                  <div className={styles.table}>
                    <div className={styles.tableTitle}>SubMission Create</div>
                    {mission?.category === 'study' ? (
                      <>
                        <div className={styles.info}>
                          <Image src={BlueExclamationLogo.src} alt="logo" width={24} height={24} />
                          You can create multiple submissions for a single chapter.
                        </div>
                        <div className={styles.chapterContainer}>
                          <div className={styles.chapterTitle}>Chapter</div>
                          <div className={styles.inputWrapper}>
                            Title
                            <input
                              type="text"
                              className={styles.input}
                              placeholder="Title of chapter"
                              onChange={(e) => setChapterTitle(e.target.value)}
                            />
                          </div>
                        </div>
                        <CreateSubmission submissions={submissions} setSubmissions={setSubmissions} isStudy={true} />
                      </>
                    ) : (
                      <CreateSubmission submissions={submissions} setSubmissions={setSubmissions} />
                    )}
                    <button className={styles.addBtn} onClick={addSubmission}>
                      Create SubMission
                    </button>
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
