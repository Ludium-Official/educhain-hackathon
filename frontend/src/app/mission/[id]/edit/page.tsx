'use client';

import BackLink from '@/components/BackLink';
import CreateSubmission from '@/components/CreateSubmission';
import Wrapper from '@/components/Wrapper';
import { PATH } from '@/constant/route';
import { useUser } from '@/hooks/store/user';
import fetchData from '@/libs/fetchData';
import { MissionType } from '@/types/mission';
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

    // if (isEmpty(missionPrize) || isEmpty(missionTitle) || isEmpty(missionCategory)) {
    //   if (isEmpty(missionTitle)) {
    //     alert('Fill in title');
    //     return;
    //   } else if (isEmpty(missionCategory)) {
    //     alert('Fill in category');
    //     return;
    //   }

    //   alert('Fill in prize');
    //   return;
    // }

    try {
      // if (user && program) {
      //   await fetchData('/missions/add', 'POST', {
      //     missionData: {
      //       validators: program.owner,
      //       owner: user.walletId,
      //       program_id: program.id,
      //       category: missionCategory,
      //       title: missionTitle,
      //       content: missionContent,
      //       prize: missionPrize,
      //       reserve: missionReserve,
      //       end_at: missionEndTime,
      //     },
      //   });
      //   alert('Success to make mission!');
      //   route.push(`${PATH.PROGRAM}/${program.id}`);
      // }
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
                        <div className={styles.info}>You can create multiple submissions for a single chapter.</div>
                        <div>Study</div>
                        <CreateSubmission submissions={submissions} setSubmissions={setSubmissions} />
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
